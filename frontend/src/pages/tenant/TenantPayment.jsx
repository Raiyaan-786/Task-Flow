import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import TenantLayout from "./TenantLayout";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const TenantPayment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    billingCycle: "monthly",
    price: 0,
    tax: 0,
    total: 0,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    firstName: "",
    lastName: "",
    companyName: "", // Added companyName field
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const planData = location.state?.selectedPlan;
    const billingData = location.state?.billingInfo;
    if (planData && billingData) {
      setSelectedPlan(planData);
      setBillingInfo(billingData);
      localStorage.setItem("selectedPlan", JSON.stringify(planData));
      localStorage.setItem("billingInfo", JSON.stringify(billingData));
    } else {
      const storedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
      const storedBilling = JSON.parse(localStorage.getItem("billingInfo"));
      if (storedPlan && storedBilling) {
        setSelectedPlan(storedPlan);
        setBillingInfo(storedBilling);
      } else {
        navigate("/tenant/plan-confirmation");
      }
    }
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!paymentDetails.firstName || paymentDetails.firstName.trim() === "") {
      newErrors.firstName = "First name is required";
    }
    if (!paymentDetails.lastName || paymentDetails.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
    }
    if (!paymentDetails.companyName || paymentDetails.companyName.trim() === "") {
      newErrors.companyName = "Company name is required"; // Added validation for companyName
    }
    if (!paymentDetails.cardNumber || !/^\d{16}$/.test(paymentDetails.cardNumber)) {
      newErrors.cardNumber = "Enter a valid 16-digit card number";
    }
    if (!paymentDetails.cvv || !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "Enter a valid CVV (3 or 4 digits)";
    }
    if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
      newErrors.expiry = "Select a valid expiry date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const tenanttoken = localStorage.getItem('tenanttoken');
        if (!tenanttoken) {
          navigate('/tenantlogin');
          return;
        }
        const tenantData = localStorage.getItem("tenant");
        if (!tenantData) {
          throw new Error("Tenant information not found in localStorage");
        }
        const tenant = JSON.parse(tenantData);
        if (!tenant._id) {
          throw new Error("Invalid tenant data: missing _id");
        }

        const planId = selectedPlan._id;
        const paymentData = {
          tenant: tenant._id,
          firstName: paymentDetails.firstName,
          lastName: paymentDetails.lastName,
          companyName: paymentDetails.companyName, // Added companyName to paymentData
          plan: planId,
          amount: billingInfo.total,
          currency: "USD",
          cardNumber: paymentDetails.cardNumber,
          expiry: `${paymentDetails.expiryMonth}/${paymentDetails.expiryYear.toString().slice(-2)}`,
          cvv: paymentDetails.cvv,
          billingCycle: billingInfo.billingCycle,
        };

        const response = await API.post("/tenant/payments/process", paymentData, {
          headers: {
            'Authorization': `Bearer ${tenanttoken}`,
          },
        });

        if (response.data.success) {
          const updatedTenant = {
            ...tenant,
            loginCredentials: response.data.loginCredentials,
            plan: response.data.plan || {
              tier: selectedPlan.tier || "basic",
              price: billingInfo.total,
              billingCycle: billingInfo.billingCycle,
              startsAt: new Date().toISOString(),
              renewsAt: new Date(
                billingInfo.billingCycle === "monthly"
                  ? Date.now() + 30 * 24 * 60 * 60 * 1000
                  : Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(),
              status: "active",
              isAutoRenew: true,
            },
          };
          localStorage.setItem("tenant", JSON.stringify(updatedTenant));
          alert(
            `Payment of $${billingInfo.total.toFixed(2)} processed successfully!\n`
          );
          navigate("/tenant/receipt", {
            state: {
              plan: selectedPlan,
              billingInfo,
              paymentDetails: {
                ...paymentDetails,
                companyName: paymentDetails.companyName, // Include companyName in paymentDetails for the receipt
              },
              paymentId: response.data.paymentId,
              transactionDate: new Date().toISOString(),
            },
          });
          localStorage.removeItem("selectedPlan");
          localStorage.removeItem("billingInfo");
        } else {
          alert("Payment failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert("An error occurred during payment processing: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/tenant/plan-confirmation", { state: { plan: selectedPlan } });
  };

  if (!selectedPlan || !billingInfo) {
    return null;
  }

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', bgcolor: colors.foreground[100] }}>
      {/* Header Section */}
      <Typography
        variant="h1"
        fontWeight={700}
        mt={5}
        mb={1}
        className="pricing-section-title"
        sx={{ fontSize: { xs: "2rem", sm: "3rem" }, textAlign: "center" }}
      >
        Payment <span className="pricing-gradient-text">Details</span>
      </Typography>
      <Typography
        variant="h4"
        className="pricing-section-subtitle"
        sx={{ mb: 3, textAlign: "center", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
      >
        Enter your payment information to subscribe to the {selectedPlan.name} plan.
      </Typography>

      {/* Card Section */}
      <Card
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          mt: 2,
          borderRadius: 2,
          boxShadow: 2,
          border: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          minHeight: 400,
          overflow: "auto",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Order Overview */}
          <Box sx={{ backgroundColor: "#2c3e50", color: "#fff", p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight={500}>
              ORDER OVERVIEW
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              ${billingInfo.total.toFixed(2)} USD
            </Typography>
          </Box>

          {/* Payment Method Section */}
          <Typography variant="h6" fontWeight={500} mb={2}>
            PLEASE SELECT A PAYMENT METHOD
          </Typography>
          <Box sx={{ mt: 1 }}>
            {/* First Name, Last Name, and Company Name */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <TextField
                size="small"
                fullWidth
                label="First name"
                name="firstName"
                value={paymentDetails.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.33% - 16px)" } }}
              />
              <TextField
                size="small"
                fullWidth
                label="Last name"
                name="lastName"
                value={paymentDetails.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.33% - 16px)" } }}
              />
              <TextField
                size="small"
                fullWidth
                label="Company name"
                name="companyName"
                value={paymentDetails.companyName}
                onChange={handleInputChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.33% - 16px)" } }}
              />
            </Box>

            {/* Card Number */}
            <TextField
              size="small"
              fullWidth
              label="Card number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
              sx={{ mb: 2 }}
            />

            {/* CVV and Expiry Date */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <TextField
                size="small"
                label="CVV"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                inputProps={{ maxLength: 4 }}
                sx={{ width: { xs: "100%", sm: "30%" } }}
              />
              <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    size="small"
                    name="expiryMonth"
                    value={paymentDetails.expiryMonth}
                    onChange={handleInputChange}
                    error={!!errors.expiry}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    size="small"
                    name="expiryYear"
                    value={paymentDetails.expiryYear}
                    onChange={handleInputChange}
                    error={!!errors.expiry}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Accepted Cards Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {typeof window !== "undefined" && (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Visa_and_MasterCard_logos.svg/1200px-Visa_and_MasterCard_logos.svg.png"
                  alt="Accepted cards"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </Box>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ justifyContent: "space-between", p: 2, borderTop: "1px solid #ddd" }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "#2e3b4e",
              color: "#2e3b4e",
              "&:hover": { borderColor: "#1a252f", color: "#1a252f" },
              textTransform: "none",
              fontSize: "0.875rem",
              px: 3,
              py: 1,
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="gradient-button"
            variant="contained"
            onClick={handleSubmitPayment}
            sx={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              "&:hover": { backgroundColor: "#27ae60" },
              textTransform: "none",
              fontSize: "0.875rem",
              px: 3,
              py: 1,
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default TenantPayment;