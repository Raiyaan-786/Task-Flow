import { Box, Button, TextField, Typography, Link, useTheme } from '@mui/material';
import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { tokens } from '../../theme';
import Preloader from '../../components/Preloader';



const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showLoadingScreen, setShowLoadingScreen] = useState(false); // Loading screen state

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); 

    try {
      const { data } = await API.post('/auth/login', {
        email,
        password
      });

      const { token, user } = data;
      dispatch(login({ user, token }));
      setShowLoadingScreen(true);
      setTimeout(() => {
        navigate('/');
      }, 5000); 
    } catch (err) {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showLoadingScreen) {
    return <Preloader/>;
  }
  

  return (
    <Box height={"100vh"} width={'100vw'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/login_background5.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box sx={{
        padding: '40px 40px',
        width: 400,
        margin: '50px auto',
        borderRadius: 5,
        background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
        backdropFilter: 'blur(10px)', // Glassmorphic blur effect
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
      }}>

        <Typography variant='h1' fontWeight={500} color={'white'}>Login to your account</Typography>
        <br />
        <form onSubmit={handleLogin} >
          <Typography color={'white'} variant="body2" fontWeight={300} gutterBottom>Email</Typography>
          <TextField
            size='small'
            fullWidth
            variant='outlined'
            name='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
          <br />
          <br />
          <Typography color={'white'} variant="body2" fontWeight={300} gutterBottom>Password</Typography>
          <TextField
            size='small'
            fullWidth
            variant='outlined'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />
          <br />
          <br />
          <br />
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <Button color='black' fullWidth variant='contained' type="submit" disabled={isLoading} sx={{ bgcolor: 'white', color: 'black' }}>
            {isLoading ? "Logging in..." : "LOGIN"}
          </Button>
          <br />
          <br />
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="caption" color='#e6dfdf' >Don't Have An Account? <Link href="/Sign Up" underline="none" color={"white"}>Signup</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
