import { Avatar, Box, Button,  Container,  Grid2, Link, Paper,  TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Lock } from '@mui/icons-material';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  //paper style
  const paperStyle = {padding: '40px 30px', width: 350, margin: '50px auto' }
  // Login API  
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', {
        email: email,
        password: password
      });
      localStorage.setItem('token', data.token);  
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <Box  height={"100vh"} width={'100vw'}  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
      <Paper elevation={10} style={paperStyle}>
        <Grid2 align='center' sx={{ paddingBottom: "20px" }}>
          <Avatar sx={{ bgcolor: '#1976d2' }}><Lock /></Avatar>
          <Typography variant="h3">Login</Typography>
        </Grid2>
        <form onSubmit={handleLogin}>
          <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email'></TextField>
          <br />
          <br />
          <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} varient="outlined" placeholder='Password'></TextField>
          <br />
          <br />
          <Button fullWidth variant='contained' type="submit" sx={{ margin: '15px 0' }}>LOGIN</Button>
          <br />
          <Typography variant="caption" sx={{paddingLeft:'30px'}} >Do you have an account? <Link href='/signup' underline="none">Sign Up</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}

export default Login