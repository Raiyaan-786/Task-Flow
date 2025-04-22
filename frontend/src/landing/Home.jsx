import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
      navigate('/tenantlogin');
    };
  return (
    <div className="home">
      <AppBar position="static" color="transparent" elevation={0} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <img src="./logoicon.svg" alt="Taskflow Logo" style={{ height: 40, marginRight: 20 }} />
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Button color="primary" href="#">Solutions</Button>
          <Button color="primary" href="#">Features</Button>
          <Button color="primary" href="#">Pricing</Button>
          <Button color="primary" href="#">Help Center</Button>
          <Button color="primary" href="#">About Us</Button>
          <Button color="primary" href="#">Contact Us</Button>
        </Toolbar>
        <Button variant="outlined"  onClick={handleLoginClick}>Login</Button>
        <Button variant="contained" color="primary" sx={{ ml: 2, bgcolor: '#0165E2' }}>Get Started</Button>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ py: 6, bgcolor: '#f9f9f9' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" fontWeight={800} gutterBottom>
                Office Management Software for CA & Accounting Firms
              </Typography>
              <Typography variant="h4" color="textSecondary" paragraph>
                Taskflow software manages all your tasks efficiently so that you can focus on growing your business and practice. Establish a fully managed office and practice.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" sx={{ mr: 2, bgcolor: '#0165E2' }}>Get Started</Button>
                <Button variant="outlined" color="primary">Free Demo</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="./homepage.svg"
                alt="Office Management Illustration"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Home;