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
import { FaCreditCard } from "react-icons/fa";
import TenantLayout from "./TenantLayout";
import API from "../api/api";

const TenantPayment = () => {
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
    companyName: "",
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
        navigate("/plan-confirmation");
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
      newErrors.companyName = "Company name is required";
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
          companyName: paymentDetails.companyName,
          plan: planId,
          amount: billingInfo.total,
          currency: "USD",
          cardNumber: paymentDetails.cardNumber,
          expiry: `${paymentDetails.expiryMonth}/${paymentDetails.expiryYear.toString().slice(-2)}`,
          cvv: paymentDetails.cvv,
          billingCycle: billingInfo.billingCycle,
        };

        const response = await API.post("/tenant/payments/process", paymentData);

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
            `Payment of $${billingInfo.total.toFixed(2)} processed successfully!\n` +
              `Login Credentials:\nUsername: ${response.data.loginCredentials.username}\n` +
              `Password: ${response.data.loginCredentials.password}`
          );
          navigate("/tenant/receipt", {
            state: {
              plan: selectedPlan,
              billingInfo,
              paymentDetails,
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
    navigate("/plan-confirmation", { state: { plan: selectedPlan } });
  };

  if (!selectedPlan || !billingInfo) {
    return null;
  }

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <TenantLayout>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <FaCreditCard style={{ color: "#4CAF50", marginRight: 8 }} />
          Payment Details
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Enter your payment information to subscribe to the {selectedPlan.name} plan.
        </Typography>

        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #ddd" }}>
          <CardContent>
            <Box sx={{ backgroundColor: "#2c3e50", color: "#fff", p: 2, mb: 2 }}>
              <Typography variant="h6">ORDER OVERVIEW</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ${billingInfo.total.toFixed(2)} USD
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              PLEASE SELECT A PAYMENT METHOD
            </Typography>
            <Typography variant="h6" gutterBottom>
              CREDIT / DEBIT CARD
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First name"
                  name="firstName"
                  value={paymentDetails.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  value={paymentDetails.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{ mb: 2 }}
                />
              </Box>
              <TextField
                fullWidth
                label="Company name"
                name="companyName"
                value={paymentDetails.companyName}
                onChange={handleInputChange}
                error={!!errors.companyName}
                helperText={errors.companyName || "Please review as it cannot be changed"}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Card number"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 16 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  sx={{ flex: 1, mb: 2 }}
                  inputProps={{ maxLength: 4 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Month</InputLabel>
                    <Select
                      name="expiryMonth"
                      value={paymentDetails.expiryMonth}
                      onChange={handleInputChange}
                      error={!!errors.expiry}
                      sx={{ minWidth: 100 }}
                    >
                      {months.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      name="expiryYear"
                      value={paymentDetails.expiryYear}
                      onChange={handleInputChange}
                      error={!!errors.expiry}
                      sx={{ minWidth: 100 }}
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
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                {typeof window !== "undefined" && (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Visa_and_MasterCard_logos.svg/1200px-Visa_and_MasterCard_logos.svg.png"
                    alt="Accepted cards"
                    style={{ maxWidth: "200px", height: "auto", display: "block" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#2c3e50",
                color: "#fff",
                "&:hover": { backgroundColor: "#1a252f" },
                borderRadius: 0,
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitPayment}
              sx={{
                backgroundColor: "#2ecc71",
                color: "#fff",
                "&:hover": { backgroundColor: "#27ae60" },
                borderRadius: 0,
                px: 4,
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </TenantLayout>
  );
};

export default TenantPayment;