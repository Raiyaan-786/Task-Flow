import { Avatar, Box, Button, Grid2, Paper, TextField, Typography, Link, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Lock } from '@mui/icons-material';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { tokens } from '../../theme';

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const paperStyle = { padding: '40px 30px', width: 350, margin: '50px auto' };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    setIsLoading(true); // Set loading to true

    try {
      const { data } = await API.post('/auth/login', {
        email,
        password
      });

      const { token, user } = data;

      dispatch(login({ user, token }));
      navigate('/');
    } catch (err) {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <Box height={"100vh"} width={'100vw'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={10} style={paperStyle}>
        <Grid2 align='center' sx={{ paddingBottom: "20px", height: '190px' }}>
          <Avatar sx={{ height: '150px', width: '150px' }} src='/logoicon2.png' />
        </Grid2>
        <form onSubmit={handleLogin} >
          <TextField
            size='small'
            fullWidth
            variant='outlined'
            name='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
          <br />
          <br />
          <TextField
            size='small'
            fullWidth
            variant='outlined'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
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
          <Button fullWidth variant='contained' type="submit" disabled={isLoading} sx={{ bgcolor: colors.teal[500] }}>
            {isLoading ? "Logging in..." : "LOGIN"}
          </Button>
          <br />
          <br />
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="caption">Already have an account? <Link href="/signup" underline="none" color={colors.teal[500]}>Signup</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
