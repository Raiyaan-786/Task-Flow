import { Button, FormControl, FormControlLabel, FormLabel, Grid2, Link, Paper, Radio, RadioGroup, TextField,Typography } from '@mui/material';
import React, { useState } from 'react'

const Login = () => {
    const [inputs,setInputs]=useState({
        name: '',
        email: '',
        password: "",
        role:'',
    });
    // input change function 
    const handleChange=(e)=>{
        setInputs(prevState=>({
            ...prevState,
            [e.target.name]:[e.target.value],
          }))
    }
    //form handling
      const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(inputs);
   }
   //paper style
   const paperStyle={padding:20,height:'80vh',width:280,margin:'20px auto'}
  return (
    <Grid2>
    <Paper  elevation={10} style={paperStyle}>
            
    <form  onSubmit={handleSubmit}>
        <TextField fullWidth label='Name' name='name' type='text' value={inputs.name} onChange={handleChange} variant='standard' placeholder='Enter Name'>hello</TextField>
        {/* <TextField fullWidth name='name' type='text' value={inputs.name} onChange={handleChange} varient='standard' placeholder='Enter your Name'></TextField> */}
        <br />
         <TextField fullWidth variant='standard' label='Email' name='email' type='email' value={inputs.email} onChange={handleChange}  placeholder='Enter Email'></TextField>
        <br />
         <TextField fullWidth variant='standard' label='Password' name='password' type='password' value={inputs.password} onChange={handleChange} varient="outlined" placeholder='Enter Password'></TextField>
        <br />
        <FormControl>
                  <FormLabel>Role</FormLabel>
                  <RadioGroup name='role' defaultValue={'Admin'} onChange={handleChange}>
                     <FormControlLabel label='Admin' value={'Admin'} control={<Radio/>}/>
                     <FormControlLabel label='Employee' value={'Employee'} control={<Radio/>}/>
                     <FormControlLabel label='Customer' value={'Customer'} control={<Radio/>}/>
                  </RadioGroup>
        </FormControl>
        
        

        <Button fullWidth variant='contained'  type="submit" sx={{margin:'8px 0'}}>Sign in</Button>
        <Typography>Do you have an account? <Link href="#" underline="none">Sign Up</Link>
        </Typography>
    </form>
    </Paper>
    </Grid2>
  )
}

export default Login