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
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/api";
import Preloader from "../components/Preloader";
import { tenantLogin } from "../features/tenantAuthSlice";
import "./TenantSignup.css";

const TenantSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    firmName: "",
    teamSize: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      setErrorMessage("Please enter a valid phone number (10-15 digits).");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data } = await API.post("/tenant/register", {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      const { tenant } = data;
      // Assuming a token is needed for tenantLogin; if not, adjust accordingly
      const tenanttoken = data.tenanttoken || "temp-token"; // Fallback if no token is returned
      dispatch(tenantLogin({ tenant, tenanttoken }));
      setShowLoadingScreen(true);
      setTimeout(() => {
        navigate("/tenant/home");
      }, 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Signup failed. Please check your details and try again.");
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
      className="signup-container"
    >
      <Grid container spacing={4} sx={{ maxWidth: "1200px", width: "100%", alignItems: "center" }}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={6}>
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
                  <ArrowBack fontSize="small" sx={{ color: "#2563eb" }} />
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
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <img src="logoicon.svg" alt="Tenant Portal Logo" />
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
              Start your 14-day free trial today
            </Typography>
          </Box>

          <Card sx={{ border: "none", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
            <CardHeader
              title="Create Your Account"
              subheader="Join thousands of tenants already using our portal"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{ variant: "h3", fontWeight: 700, mb: 1 }}
              subheaderTypographyProps={{ variant: "h6", fontWeight: 500, color: "textSecondary" }}
            />
            <CardContent sx={{ px: 4, py: 2 }}>
              {errorMessage && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center", fontSize: "0.875rem" }}>
                  {errorMessage}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="firstName"
                      sx={{ display: "block", mb: 1 }}
                    >
                      First Name
                    </Typography>
                    <TextField
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      fullWidth
                      value={formData.firstName}
                      onChange={handleInputChange}
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="lastName"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Last Name
                    </Typography>
                    <TextField
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      fullWidth
                      value={formData.lastName}
                      onChange={handleInputChange}
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
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="email"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Work Email
                  </Typography>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@yourfirm.com"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
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
                    htmlFor="phone"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Phone Number
                  </Typography>
                  <TextField
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    htmlFor="firmName"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Firm Name
                  </Typography>
                  <TextField
                    id="firmName"
                    name="firmName"
                    placeholder="Your Firm Name"
                    fullWidth
                    value={formData.firmName}
                    onChange={handleInputChange}
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
                    htmlFor="teamSize"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Team Size
                  </Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="teamSize-label">Select team size</InputLabel>
                    <Select
                      labelId="teamSize-label"
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      label="Select team size"
                      required
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                      }}
                    >
                      <MenuItem value="1-5">1-5 people</MenuItem>
                      <MenuItem value="6-15">6-15 people</MenuItem>
                      <MenuItem value="16-50">16-50 people</MenuItem>
                      <MenuItem value="50+">50+ people</MenuItem>
                    </Select>
                  </FormControl>
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
                    value={formData.password}
                    onChange={handleInputChange}
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
                <Box sx={{ mb: 2, fontSize: "0.75rem", color: "textSecondary" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                    }
                    label={
                      <span>
                        I agree to TaskFlow's{" "}
                        <Link
                          href="#"
                          sx={{ color: "#2563eb", textDecoration: "none", "&:hover": { color: "#1e40af" } }}
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          sx={{ color: "#2563eb", textDecoration: "none", "&:hover": { color: "#1e40af" } }}
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    }
                    sx={{ "& .MuiTypography-root": { fontSize: "0.75rem" } }}
                  />
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
                  {isLoading ? "Starting Free Trial..." : "Start Free Trial"}
                </Button>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mt: 2, color: "textSecondary" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    sx={{ color: "#2563eb", textDecoration: "none", "&:hover": { color: "#1e40af" } }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Benefits */}
        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(4px)",
              borderRadius: "16px",
              p: 4,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              What you get with Free Plan:
            </Typography>
            <Box sx={{ mb: 4 }}>
              {[
                "14-day free access to tenant portal",
                "Complete tenant management",
                "Explore plans and pricing",
                "Community access",
                "24/7 customer support",
                "Bank-level security & compliance",
              ].map((benefit, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CheckCircleOutline sx={{ color: "#22c55e", mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" color="textSecondary">
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#1e40af", fontWeight: "medium" }}
              >
                🎉 Special Offer: Get 2 months free when you upgrade to an annual plan!
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TenantSignup;