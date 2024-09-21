import { Avatar, Button, Grid2,  Link, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Lock } from '@mui/icons-material';

const Signup = () => {
  const [inputs, setInputs] = useState({
    name:'dfdf',
    email: '',
    password: "",
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
  const paperStyle = {padding: '40px 30px', width: 250, margin: '50px auto' }
  
  return (
    <Grid2>
      <Paper elevation={10} style={paperStyle}>
        <Grid2 align='center' sx={{ paddingBottom: "20px" }}>
          <Avatar sx={{ bgcolor: '#1976d2' }}><Lock /></Avatar>
          <Typography variant="h3">Signup</Typography>
        </Grid2>
        <form onSubmit={handleSubmit}>
          <TextField size='small' fullWidth variant='outlined' name='name' type='text' value={inputs.name} onChange={handleChange} placeholder='Name'></TextField>
          <br />
          <br />
          <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={inputs.email} onChange={handleChange} placeholder='Email'></TextField>
          <br />
          <br />
          <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={inputs.password} onChange={handleChange} varient="outlined" placeholder='Password'></TextField>
          <br />
          <br />
          <Button fullWidth variant='contained' type="submit" sx={{ margin: '15px 0' }}>LOGIN</Button>
          <br />
          <Typography variant="caption" sx={{paddingLeft:'30px'}} >Already have an account? <Link href="#" underline="none">Login</Link>
          </Typography>
        </form>
      </Paper>
    </Grid2>
  )
}

export default Signup