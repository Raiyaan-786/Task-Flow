import { Box, Button, TextField, Typography, Link, useTheme, Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { tokens } from '../../theme';
import Preloader from '../../components/Preloader';

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [step, setStep] = useState("email"); // email, selectCompany, password
  const [companies, setCompanies] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/companies', { email });
      if (data.companies.length === 0) {
        setErrorMessage("No companies found for this email.");
        setIsLoading(false);
        return;
      }
      setCompanies(data.companies);
      setModalOpen(true);
      setStep("selectCompany");
    } catch (err) {
      setErrorMessage("Failed to fetch companies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySelect = (e) => {
    setSelectedTenantId(e.target.value);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!selectedTenantId) {
      setErrorMessage("Please select a company.");
      return;
    }
    setModalOpen(false);
    setStep("password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/login', {
        email,
        password,
        tenantId: selectedTenantId,
      });

      const { token, user } = data;
      dispatch(login({ user, token }));
      setShowLoadingScreen(true);
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (err) {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showLoadingScreen) {
    return <Preloader />;
  }

  return (
    <Box
      height={"100vh"}
      width={'100vw'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/login_background5.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          padding: '40px 40px',
          width: 400,
          margin: '50px auto',
          borderRadius: 5,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {step === "email" && (
          <>
            <Typography variant='h1' fontWeight={500} color={'white'}>
              Login to your account
            </Typography>
            <br />
            <form onSubmit={handleEmailSubmit}>
              <Typography color={'white'} variant="body2" fontWeight={300} gutterBottom>
                Email
              </Typography>
              <TextField
                size='small'
                fullWidth
                variant='outlined'
                name='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    color: "white",
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />
              <br />
              <br />
              {errorMessage && (
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              )}
              <Button
                color='black'
                fullWidth
                variant='contained'
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: '25px',
                  bgcolor: 'white',
                  color: 'black',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? "Fetching..." : "NEXT"}
              </Button>
              <br />
              <br />
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Typography variant="caption" color='#e6dfdf'>
                  Don't Have An Account? <Link href="/Sign Up" underline="none" color={"white"}>Signup</Link>
                </Typography>
              </Box>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <Typography variant='h1' fontWeight={500} color={'white'}>
              Enter Password
            </Typography>
            <br />
            <form onSubmit={handleLogin}>
              <Typography color={'white'} variant="body2" fontWeight={300} gutterBottom>
                Password
              </Typography>
              <TextField
                size='small'
                fullWidth
                variant='outlined'
                name='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    color: "white",
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />
              <br />
              <br />
              {errorMessage && (
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              )}
              <Button
                color='black'
                fullWidth
                variant='contained'
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: '25px',
                  bgcolor: 'white',
                  color: 'black',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </Button>
              <br />
              <br />
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Button
                  onClick={() => {
                    setStep("email");
                    setCompanies([]);
                    setSelectedTenantId("");
                    setErrorMessage("");
                  }}
                  sx={{ color: 'white' }}
                >
                  Back
                </Button>
              </Box>
            </form>
          </>
        )}

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="company-selection-modal"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              padding: '20px',
              width: 300,
              borderRadius: 5,
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" color="black" gutterBottom>
              Select a Company
            </Typography>
            <form onSubmit={handleModalSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Company</InputLabel>
                <Select
                  value={selectedTenantId}
                  onChange={handleCompanySelect}
                  label="Company"
                  required
                >
                  <MenuItem value="">
                    <em>Select a company</em>
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.tenantId} value={company.tenantId}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Box display="flex" justifyContent="space-between">
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    setStep("email");
                    setCompanies([]);
                    setErrorMessage("");
                  }}
                  sx={{ color: 'black' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!selectedTenantId || isLoading}
                  sx={{
                    borderRadius: '25px',
                    bgcolor: 'black',
                    color: 'white',
                    '&:hover': { bgcolor: '#333' },
                  }}
                >
                  Next
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Login;