'use client'

import { TextField, Box, Button, Stack, AppBar, Toolbar, Typography } from "@mui/material";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import { auth } from '../firebase';  // Corrected path
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the Rate My Professor support assistant. How can I help you today?"
    }
  ]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (pathname === '/') {
        router.push('/home');  // Redirect to the new Home page
      } else if (user && pathname === '/') {
        router.push('/');  // If already authenticated, stay on the current page
      } else if (!user && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');  // Redirect to login if not authenticated and not on login/signup pages
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return null;


  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);

    setMessage('');
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');  // Redirect to login after logout
    });
  };

  if (loading) {
    return <p>Loading...</p>;  // Optionally, replace with a spinner or loading screen
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Rate My Professor AI Assistant
          </Typography>
          <Button color="inherit" onClick={() => router.push('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
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
      >
        <Stack 
          direction="column" 
          width="500px" 
          height="500px" 
          border="1px solid black" 
          p={2} 
          spacing={3}
        >
          <Stack 
            direction="column" 
            spacing={2} 
            flexGrow={1} 
            overflow='auto'
            maxHeight='100%'
          >
            {messages.map((message, index) => (
              <Box 
                key={index} 
                display="flex" 
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box 
                bgcolor={ 
                  message.role === 'assistant' ? 'primary.main': 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
            <Button variant='contained' onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
