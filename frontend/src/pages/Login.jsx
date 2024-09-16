import { Avatar, Button, FormControl, Grid2, InputLabel, Link, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Lock } from '@mui/icons-material';

const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: "",
    role: '',
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
  const paperStyle = {padding: '25px 30px', width: 250, margin: '35px auto' }
  // const paperStyle = { padding: '40px 30px', width: 250, margin: '40px auto' }
  return (
    <Grid2>
      <Paper elevation={10} style={paperStyle}>
        <Grid2 align='center' sx={{ paddingBottom: "20px" }}>
          <Avatar sx={{ bgcolor: '#1976d2' }}><Lock /></Avatar>
          <Typography variant="h3">Login</Typography>
        </Grid2>
        <form onSubmit={handleSubmit}>
          <TextField size='small' fullWidth variant='outlined' name='email' type='email' value={inputs.email} onChange={handleChange} placeholder='Email'></TextField>
          <br />
          <br />
          <TextField size='small' fullWidth variant='outlined' name='password' type='password' value={inputs.password} onChange={handleChange} varient="outlined" placeholder='Password'></TextField>
          <br />
          <br />
          <FormControl size='small' fullWidth >
            <InputLabel id="menu">Role</InputLabel>
            <Select labelId='menu' id='menu-list' label="role" name="role" value={inputs.role} onChange={handleChange}>
              <MenuItem value={'Admin'}>Admin</MenuItem>
              <MenuItem value={'Employee'}>Employee</MenuItem>
              <MenuItem value={'Customer'}>Customer</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <Button fullWidth variant='contained' type="submit" sx={{ margin: '15px 0' }}>LOGIN</Button>
          <br />
          <Typography variant="caption" sx={{paddingLeft:'30px'}} >Do you have an account? <Link href="#" underline="none">Sign Up</Link>
          </Typography>
        </form>
      </Paper>
    </Grid2>
  )
}

export default Login