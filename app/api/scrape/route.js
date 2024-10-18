import axios from 'axios';
import * as cheerio from 'cheerio';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../../firebase';  // Adjust the path based on your project structure

export async function GET(req) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return new Response(JSON.stringify({ error: 'No URL provided' }), { status: 400 });
    }

    try {
        // Use ScraperAPI to fetch the content from the provided URL
        const { data } = await axios.get(`http://api.scraperapi.com`, {
            params: {
                api_key: process.env.SCRAPER_API_KEY,
                url: url,
            },
            timeout: 10000,  // Add a timeout in milliseconds
        });

        // Load the HTML data using cheerio
        const $ = cheerio.load(data);

        // Scrape professor's first and last name
        const firstName = $('div.NameTitle__Name-dowf0z-0.cfjPUG span:first-of-type').text().trim();
        const lastName = $('span.NameTitle__LastNameWrapper-dowf0z-2').text().trim();
        const professorName = `${firstName} ${lastName}`;

        // Scrape all reviews for this professor
        const reviews = $('div.Comments__StyledComments-dzzyvm-0.gRjWel').map((i, element) => {
            return $(element).text().trim();
        }).get();

        // Scrape ratings associated with each review by looking for "Quality" headers
        const ratings = [];
        $('div.CardNumRating__CardNumRatingHeader-sc-17t4b9u-1.fVETNc').each((i, element) => {
            const qualityLabel = $(element).text().trim();
            if (qualityLabel === "Quality") {
                const ratingElement = $(element).next('div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.gcFhmN');
                const rating = ratingElement.text().trim();
                if (rating) {
                    ratings.push(rating);
                }
            }
        });

        // Scrape the subject
        const subject = $('div.RatingHeader__StyledClass-sc-1dlkqw1-3.eXfReS').first().text().trim();

        if (!professorName || reviews.length === 0 || ratings.length === 0 || !subject) {
            throw new Error('Failed to scrape all necessary data.');
        }

        // Randomly select one review
        const randomIndex = Math.floor(Math.random() * reviews.length);
        const selectedReview = reviews[randomIndex];
        const selectedRating = ratings[randomIndex];

        // Save to Firestore
        await addDoc(collection(db, 'reviews'), {
            professor: professorName,
            subject: subject,
            stars: parseFloat(selectedRating),
            review: selectedReview,
            timestamp: new Date(),
        });

        return new Response(JSON.stringify({ 
            name: professorName, 
            rating: selectedRating, 
            review: selectedReview,
            subject: subject 
        }), { status: 200 });
    } catch (error) {
        console.error('Error occurred during scraping:', error.message);
        return new Response(JSON.stringify({ error: `Failed to fetch and parse the data: ${error.message}` }), { status: 500 });
    }
}
