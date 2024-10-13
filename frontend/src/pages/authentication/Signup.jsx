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
  const paperStyle = { padding: '40px 30px', width: 350, margin: '50px auto'}

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
      <Box height={"100vh"} width={'100vw'}  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <Paper elevation={5} style={paperStyle} square={false}  >
        <Grid2 align='center' sx={{ paddingBottom: "20px",height:'190px' }}>
            <Avatar sx={{ height:'150px',width:'150px' }} src='/logoicon5.svg'/>
          </Grid2>
          <form onSubmit= {handleSignUp}>
            <TextField size='small' fullWidth variant='outlined' name='name' type='text' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Name' required></TextField>
            <br />
            <br />
            <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email' required></TextField>
            <br />
            <br />
            <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} varient="outlined" placeholder='Password' required></TextField>
            <br />
            <br />
            <Button fullWidth variant='contained' type="submit" sx={{ margin: '15px 0',bgcolor:colors.pink[500] }}>SIGNUP</Button>
            <br />
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="caption">Already have an account? <Link href="/login" underline="none" color={colors.teal[500]}>Login</Link>
            </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
  )
}

export default Signup