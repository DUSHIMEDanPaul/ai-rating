'use client'

import { TextField, Box, Button, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { auth, provider } from '../../firebase'; // Import the provider
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../ThemeContext';
import Image from 'next/image';  // Import Image component from Next.js
import { useTheme } from "@mui/material/styles"; // Import useTheme

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme(); // Retrieve the theme

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/ai-rmp');  // Redirect to chatbot page after login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/ai-rmp');  // Redirect to chatbot page after Google login
    } catch (error) {
      setError(error.message);
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
          <Button color="inherit" onClick={() => router.push('/signup')}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        sx={{
          px: {
            xs: 2, // Padding for small screens
            sm: 3, // Padding for medium screens and up
          },
          backgroundColor: theme.palette.background.default,  // Use theme for background
        }}
      >
        <Box
          width={{
            xs: '100%',  // Full width on small screens
            sm: '80%',   // 80% width on medium screens
            md: '400px'  // Fixed width on large screens
          }}
          p={4}
          border="1px solid"
          borderColor={theme.palette.divider}
          borderRadius={8}
          boxShadow={3}  // Adding box-shadow for a modern look
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h5" mb={2} sx={{
            fontSize: {
              xs: '1.5rem', // Smaller font on mobile
              sm: '2rem'   // Larger font on larger screens
            },
            fontWeight: 'bold',  // Bold the title
            textAlign: 'center',  // Center align the title
          }}>
            Login
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: { 
                color: theme.palette.text.primary, 
                backgroundColor: theme.palette.background.default, 
              },
              label: {
                color: theme.palette.text.secondary,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: { 
                color: theme.palette.text.primary, 
                backgroundColor: theme.palette.background.default, 
              },
              label: {
                color: theme.palette.text.secondary,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogin} 
            sx={{ 
              mt: 3,
              fontSize: {
                xs: '1rem', // Smaller font on mobile
                sm: '1.25rem' // Larger font on larger screens
              },
              padding: '10px 20px',  // Adjust button padding
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Log In
          </Button>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleGoogleSignIn} 
            sx={{ 
              mt: 2,
              fontSize: {
                xs: '1rem',
                sm: '1.25rem'
              },
              padding: '10px 20px',
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.background.default,
              }
            }}
          >
            Sign In with Google
          </Button>
          <Typography mt={2} textAlign="center">
            Don&apos;t have an account?{" "}
            <Button
              onClick={() => router.push('/signup')}
              sx={{
                textTransform: 'none', // Remove uppercase transformation
                color: theme.palette.primary.main,
              }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
