import { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';

export default function SearchPage() {
    const [subject, setSubject] = useState('');
    const [minRating, setMinRating] = useState('');
    const [keywords, setKeywords] = useState({
        knowledgeable: false,
        engaging: false,
        responsive: false,
        criticalThinking: false,
    });
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null); // Reset any previous errors
        try {
            const searchCriteria = {
                subject,
                minRating: parseInt(minRating) || 0,
                keywords: Object.keys(keywords).filter((key) => keywords[key]),
            };

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchCriteria),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }

            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Advanced Search</Typography>
            <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Minimum Rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={minRating > 0}
                        onChange={(e) => setMinRating(e.target.checked ? '1' : '')}
                    />
                }
                label="Minimum Rating 1+"
            />
            <Button variant="contained" onClick={handleSearch}>Search</Button>

            {error && (
                <Typography color="error" mt={2}>
                    {error}
                </Typography>
            )}

            <Box mt={4}>
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <Box key={index} mb={3} p={2} border="1px solid #ddd" borderRadius="4px">
                            <Typography variant="h6">{result.professor}</Typography>
                            <Typography>Subject: {result.subject}</Typography>
                            <Typography>Rating: {result.stars}</Typography>
                            <Typography>{result.review}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>No results found</Typography>
                )}
            </Box>
        </Box>
    );
}
