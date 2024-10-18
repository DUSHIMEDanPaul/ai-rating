'use client';

import { useState } from 'react';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Container,
    AppBar,
    Toolbar,
    IconButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function SearchPage() {
    const router = useRouter();
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

    const { mode, toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();

    const handleSearch = async () => {
        setError(null); // Reset any previous errors

        try {
            const searchCriteria = {
                subject,
                minRating: parseInt(minRating) || 0,
                keywords: Object.keys(keywords).filter(key => keywords[key])
            };

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchCriteria)
            });

            const data = await response.json();
            if (response.ok) {
                setResults(data.results);
            } else {
                setError('Failed to fetch results');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('An unexpected error occurred');
        }
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Image 
                            src="/logo.png" // Path to your logo
                            alt="Logo" 
                            width={40} // Adjust the width as needed
                            height={40} // Adjust the height as needed
                        />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            ProfInsight AI
                        </Typography>
                    </Box>
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Button color="inherit" onClick={() => router.push('/home')}>
                        Home
                    </Button>
                    <Button color="inherit" onClick={() => router.push('/ai-rmp')}>
                        Back
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Card sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Advanced Search
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Minimum Rating"
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="number"
                                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Typography variant="h6">Filter by Keywords:</Typography>
                        <Grid container spacing={2}>
                            {Object.keys(keywords).map((key) => (
                                <Grid item xs={6} sm={3} key={key}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={keywords[key]}
                                                onChange={(e) =>
                                                    setKeywords({ ...keywords, [key]: e.target.checked })
                                                }
                                            />
                                        }
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            sx={{ padding: '10px 20px', borderRadius: '20px', fontSize: '1rem' }}
                        >
                            Search
                        </Button>
                    </Box>

                    {error && (
                        <Typography color="error" mt={2} align="center">
                            {error}
                        </Typography>
                    )}
                </Card>

                <Box mt={4}>
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <Card key={index} sx={{ mb: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6">{result.professor}</Typography>
                                    <Typography variant="body2">
                                        <strong>Subject:</strong> {result.subject}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Rating:</strong> {result.stars}
                                    </Typography>
                                    <Typography variant="body2">{result.review}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography align="center" mt={4}>
                            No results found
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
