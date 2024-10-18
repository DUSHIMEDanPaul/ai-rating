import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; // Ensure this path is correct

export async function POST(req) {
  const { subject, minRating, discussionBased, keywords } = await req.json();

  try {
    const reviewsCollection = collection(db, 'reviews'); // Correct the reference here
    const q = query(reviewsCollection);
    const querySnapshot = await getDocs(q);
    const firebaseReviews = [];

    querySnapshot.forEach((doc) => {
      firebaseReviews.push(doc.data());
    });

    let filteredReviews = firebaseReviews;

    if (subject) {
      filteredReviews = filteredReviews.filter(review =>
        review.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (minRating) {
      filteredReviews = filteredReviews.filter(review =>
        review.stars >= minRating
      );
    }

    if (keywords && keywords.length > 0) {
      filteredReviews = filteredReviews.filter(review =>
        keywords.some(keyword => review.review.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

    return new Response(JSON.stringify({ results: filteredReviews }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
