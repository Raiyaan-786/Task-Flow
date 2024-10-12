import { Avatar, Box, Button,  Container,  Grid2, Link, Paper,  TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Lock } from '@mui/icons-material';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [inputs, setInputs] = useState({
    email:'',
    password:''
  });
  // input change function 
  const handleChange = (e) => {
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: [e.target.value],
    }))
  }
  //form handling
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
  }
  //paper style
  const paperStyle = {padding: '40px 30px', width: 350, margin: '50px auto' }
  
  // Login API 
  // Isme email aur password ke jagah apna variable jo use kiye ho wo daal dena 
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', {inputs});
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
        {/* <form onSubmit={handleSubmit}> */}
        <form onSubmit={handleLogin}>
          <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={inputs.email} onChange={handleChange} placeholder='Email'></TextField>
          <br />
          <br />
          <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={inputs.password} onChange={handleChange} varient="outlined" placeholder='Password'></TextField>
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