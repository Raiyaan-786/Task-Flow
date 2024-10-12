import { Avatar, Box, Button, Grid2, Link, Paper, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { Lock } from '@mui/icons-material';
import API from '../../api/api';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  //paper style
  const paperStyle = { padding: '40px 30px', width: 350, margin: '50px auto' }

  // Sign up APi 
  const navigate = useNavigate()
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register',{
        name:name,
        email:email,
        password:password
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response)
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
      <Box height={"100vh"} width={'100vw'} bgcolor={colors.primary[700]} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <Paper elevation={10} style={paperStyle}  >
          <Grid2 align='center' sx={{ paddingBottom: "20px" }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}><Lock /></Avatar>
            <Typography variant="h3">Signup</Typography>
          </Grid2>
          <form onSubmit= {handleSignUp}>
            <TextField size='small' fullWidth variant='outlined' name='name' type='text' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Name'></TextField>
            <br />
            <br />
            <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email'></TextField>
            <br />
            <br />
            <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} varient="outlined" placeholder='Password'></TextField>
            <br />
            <br />
            <Button fullWidth variant='contained' type="submit" sx={{ margin: '15px 0' }}>SIGNUP</Button>
            <br />
            <Typography variant="caption" sx={{ paddingLeft: '30px' }} >Already have an account? <Link href="/login" underline="none">Login</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
  )
}

export default Signup