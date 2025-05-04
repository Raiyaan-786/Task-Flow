import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/api";
import Preloader from '../components/Preloader'
import { tenantLogin } from "../features/tenantAuthSlice";

const TenantLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [showLoadingScreen, setShowLoadingScreen] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data } = await API.post("/tenant/login", {
        email,
        password,
      });
      const { tenant, tenanttoken } = data;
      dispatch(tenantLogin({ tenant, tenanttoken }));
      setShowLoadingScreen(true);
      setTimeout(() => {
        navigate("/tenant/home");
      }, 5000);
    } catch (err) {
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showLoadingScreen) {
    return <Preloader />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, bgcolor: "#f9f9f9" }}>
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#0165E2",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            padding: 4,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src="./loginpage.svg"
              alt="Login Illustration"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            padding: 4,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#0165E2" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ width: "100%", maxWidth: "300px", mt: 1 }}
          >
            {errorMessage && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              sx={{ backgroundColor: "#f9f9f9" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{ backgroundColor: "#f9f9f9" }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Keep me logged in"
            />
            <Link href="#" variant="body2" sx={{ display: "block", mb: 2 }}>
              Forgot Password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, bgcolor: "#0165E2" }}
            >
              {isLoading ? "Signing In..." : "Continue"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TenantLogin;