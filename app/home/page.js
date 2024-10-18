'use client'
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Image from "next/image";  

export default function Home() {
  const router = useRouter();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const [fadeInHero, setFadeInHero] = useState(false);
  const [fadeInFeatures, setFadeInFeatures] = useState(false);
  const [fadeInCTA, setFadeInCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;

      const heroSection = document.getElementById("hero-section");
      const featuresSection = document.getElementById("features-section");
      const ctaSection = document.getElementById("cta-section");

      if (
        heroSection &&
        scrollPosition > heroSection.offsetTop + heroSection.offsetHeight / 2
      ) {
        setFadeInHero(true);
      }
      if (
        featuresSection &&
        scrollPosition > featuresSection.offsetTop + featuresSection.offsetHeight / 2
      ) {
        setFadeInFeatures(true);
      }
      if (
        ctaSection &&
        scrollPosition > ctaSection.offsetTop + ctaSection.offsetHeight / 2
      ) {
        setFadeInCTA(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    router.push("/signup"); // Redirect to the signup page
  };

  return (
    <Box width="100%" minHeight="100vh" bgcolor={theme.palette.background.default}>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Image 
              src="/logo.png"  // Path to your logo
              alt="Logo" 
              width={40}  // Adjust the width as needed
              height={40}  // Adjust the height as needed
            />
            <Typography variant="h6" sx={{ ml: 2 }}>
                ProfInsight AI
            </Typography>
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        id="hero-section"
        minHeight="80vh" // Reduced minHeight for less whitespace
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          opacity: fadeInHero ? 1 : 0,
          transform: fadeInHero ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s ease-in-out",
          px: {
            xs: 2, // Padding for small screens
            sm: 3, // Padding for medium screens and up
          },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontSize: {
              xs: "2rem", // Smaller font on mobile
              sm: "3rem", // Larger font on tablets and up
            },
          }}
        >
          Welcome to the Future of Professor Ratings
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.25rem", // Smaller font on mobile
              sm: "1.5rem", // Larger font on tablets and up
            },
          }}
        >
          Discover insights with our AI-powered chatbot designed to give you the information you need, fast.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleGetStarted}
          sx={{
            mt: 4,
            width: {
              xs: "100%", // Full width on mobile
              sm: "auto", // Auto width on larger screens
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Divider between sections */}
      <Divider sx={{ borderColor: theme.palette.divider, my: 0 }} />

      {/* Features Section */}
      <Box
        id="features-section"
        minHeight="80vh" // Reduced minHeight for less whitespace
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          opacity: fadeInFeatures ? 1 : 0,
          transform: fadeInFeatures ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s ease-in-out",
          px: {
            xs: 2, // Padding for small screens
            sm: 3, // Padding for medium screens and up
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.75rem", // Smaller font on mobile
              sm: "2.5rem", // Larger font on tablets and up
            },
          }}
        >
          Why Choose Our AI Chatbot?
        </Typography>
        <Typography
          variant="body1"
          paragraph
          maxWidth="600px"
          sx={{
            fontSize: {
              xs: "1rem", // Smaller font on mobile
              sm: "1.25rem", // Larger font on tablets and up
            },
          }}
        >
          Our chatbot leverages advanced AI to analyze and deliver comprehensive professor reviews, so you can make informed decisions about your education.
        </Typography>
        <Typography
          variant="body1"
          paragraph
          maxWidth="600px"
          sx={{
            fontSize: {
              xs: "1rem", // Smaller font on mobile
              sm: "1.25rem", // Larger font on tablets and up
            },
          }}
        >
          Our latest enhancement lets you filter professors based on specific teaching qualities, helping you find the perfect match for your needs.
        </Typography>
        <Typography
          variant="body1"
          paragraph
          maxWidth="600px"
          sx={{
            fontSize: {
              xs: "1rem", // Smaller font on mobile
              sm: "1.25rem", // Larger font on tablets and up
            },
          }}
        >
          Seamlessly interact with a system that learns from your queries, providing more accurate results over time.
         </Typography>
         <Typography
           variant="body1"
           paragraph
           maxWidth="600px"
           sx={{
             fontSize: {
               xs: "1rem", // Smaller font on mobile
               sm: "1.25rem", // Larger font on tablets and up
             },
           }}
         >
          With our latest feature, the chatbot can even scrape data from RateMyProfessors based on a URL you provide, ensuring you get the most up-to-date and relevant information.
        </Typography>
      </Box>

      {/* Divider between sections */}
      <Divider sx={{ borderColor: theme.palette.divider, my: 0 }} />

      {/* Call to Action Section */}
      <Box
        id="cta-section"
        minHeight="60vh" // Reduced minHeight for less whitespace
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          opacity: fadeInCTA ? 1 : 0,
          transform: fadeInCTA ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s ease-in-out",
          px: {
            xs: 2, // Padding for small screens
            sm: 3, // Padding for medium screens and up
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.75rem", // Smaller font on mobile
              sm: "2.5rem", // Larger font on tablets and up
            },
          }}
        >
          Get Started Today
        </Typography>
        <Typography
          variant="body1"
          paragraph
          maxWidth="600px"
          sx={{
            fontSize: {
              xs: "1rem", // Smaller font on mobile
              sm: "1.25rem", // Larger font on tablets and up
            },
          }}
        >
          Join thousands of students who are using our AI-powered platform to get ahead in their academic journey.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{
            mt: 4,
            width: {
              xs: "100%", // Full width on mobile
              sm: "auto", // Auto width on larger screens
            },
          }}
        >
          Sign Up Now
        </Button>
      </Box>
    </Box>
  );
}
