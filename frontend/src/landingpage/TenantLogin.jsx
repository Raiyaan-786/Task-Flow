import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
} from "@mui/material";
import { ArrowBack, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/api";
import Preloader from "../components/Preloader";
import { tenantLogin } from "../features/tenantAuthSlice";
import "./TenantLogin.css";

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
        navigate("/tenant/profile");
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
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
      className="login-container"
    >
      <Box sx={{ maxWidth: "400px", width: "100%" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Link
              href="/landingpage"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#2563eb",
                textDecoration: "none",
                "&:hover": { color: "#1e40af" },
              }}
            >
              <IconButton size="small" sx={{ mr: 1 }}>
                <ArrowBack fontSize="small" sx={{color:"#2563eb"}} />
              </IconButton>
              Back to Home
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                // background: "linear-gradient(to right, #2563eb, #7c3aed)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
              }}
            >
              {/* <Description sx={{ color: "#fff", fontSize: 24 }} /> */}
              <img src="logoicon.svg" alt="" />
            </Box>
            <Typography
              variant="h3"
              sx={{
                background: "linear-gradient(to right, #2563eb, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Tenant Portal
            </Typography>
          </Box>
          <Typography variant="h6" color="textSecondary">
            Welcome back to your tenant management dashboard
          </Typography>
        </Box>

        <Card sx={{ border: "none", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          <CardHeader
            title="Sign In"
            subheader="Enter your credentials to access your tenant account"
            sx={{ textAlign: "center" }}
            titleTypographyProps={{ variant: "h3",fontWeight:700,mb:1 }}
            subheaderTypographyProps={{ variant: "h6",fontWeight:500, color: "textSecondary" }}
          />
          <CardContent sx={{ px: 4, py: 2 }}>
            {errorMessage && (
              <Typography  color="error" sx={{ mb: 2, textAlign: "center", fontSize: "0.875rem" }}>
                {errorMessage}
              </Typography>
            )}
            <form onSubmit={handleLogin}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="email"
                  sx={{ display: "block", mb: 1 }}
                >
                  Email
                </Typography>
                <TextField
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#e5e7eb" },
                      "&:hover fieldset": { borderColor: "#2563eb" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="password"
                  sx={{ display: "block", mb: 1 }}
                >
                  Password
                </Typography>
                <TextField
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#e5e7eb" },
                      "&:hover fieldset": { borderColor: "#2563eb" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  fontSize: "0.875rem",
                }}
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Keep me logged in"
                  sx={{ "& .MuiTypography-root": { fontSize: "0.875rem" } }}
                />
                <Link
                  href="#"
                  sx={{ color: "#2563eb", textDecoration: "none", "&:hover": { color: "#1e40af" } }}
                >
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  background: "linear-gradient(to right, #2563eb, #7c3aed)",
                  "&:hover": {
                    background: "linear-gradient(to right, #1e40af, #6d28d9)",
                  },
                  color: "#fff",
                  textTransform: "none",
                  py: 1,
                }}
              >
                {isLoading ? "Signing In..." : "Continue"}
              </Button>
            </form>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 2, color: "textSecondary" }}
            >
              Don't have an account?{" "}
              <Link
                href="/tenantsignup"
                sx={{ color: "#2563eb", textDecoration: "none", "&:hover": { color: "#1e40af" } }}
              >
                Sign up for free
              </Link>
            </Typography>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{ mt: 2, textAlign: "center", display: "block", color: "textSecondary" }}
        >
          Protected by 256-bit SSL encryption
        </Typography>
      </Box>
    </Container>
  );
};

export default TenantLogin;