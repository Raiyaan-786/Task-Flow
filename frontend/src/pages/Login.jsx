import { Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField,Typography } from '@mui/material';
import React, { useState } from 'react'

const Login = () => {
    const [inputs,setInputs]=useState({
        name: 'inzamam',
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
  return (
    <>
    <Container  sx={{background:'yellow' ,marginTop:'8%'}} maxWidth='xs'>
            
    <form  onSubmit={handleSubmit}>
        <TextField name='name' type='text' value={inputs.name} onChange={handleChange} varient="outlined" placeholder='Enter your Name'></TextField>
        <br />
        <TextField name='email' type='email' value={inputs.email} onChange={handleChange} varient="outlined" placeholder='Enter your email'></TextField>
        <br />
        <TextField name='password' type='password' value={inputs.password} onChange={handleChange} varient="outlined" placeholder='Password'></TextField>
        <br />
        <FormControl>
                  <FormLabel>Role</FormLabel>
                  <RadioGroup name='role' defaultValue={'Admin'} onChange={handleChange}>
                     <FormControlLabel label='Admin' value={'Admin'} control={<Radio/>}/>
                     <FormControlLabel label='Employee' value={'Employee'} control={<Radio/>}/>
                     <FormControlLabel label='Customer' value={'Customer'} control={<Radio/>}/>
                  </RadioGroup>
        </FormControl>
        <br />
        <Button variant='contained'  type="submit" >Sign in</Button>
        <br />
        <Button variant='outlined'>Sign up</Button>
    </form>
    </Container>
    </>
  )
}

export default Login