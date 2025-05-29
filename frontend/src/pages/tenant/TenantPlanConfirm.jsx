import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Divider,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import TenantLayout from "./TenantLayout";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const TenantPlanConfirm = () => {
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

  useEffect(() => {
    const planData = location.state?.plan;
    if (planData) {
      setSelectedPlan(planData);
      localStorage.setItem("selectedPlan", JSON.stringify(planData));
      const taxRate = 0.08;
      const price = parseFloat(planData.price);
      const tax = price * taxRate;
      const total = price + tax;
      setBillingInfo({
        billingCycle: planData.billingCycle,
        price,
        tax,
        total,
      });
    } else {
      const storedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
      if (storedPlan) {
        setSelectedPlan(storedPlan);
        const taxRate = 0.08;
        const price = parseFloat(storedPlan.price);
        const tax = price * taxRate;
        const total = price + tax;
        setBillingInfo({
          billingCycle: storedPlan.billingCycle,
          price,
          tax,
          total,
        });
      } else {
        navigate("/tenant/plan");
      }
    }
  }, [location, navigate]);

  const handleProceedToPayment = () => {
    navigate("/tenant/payment", { state: { selectedPlan, billingInfo } });
  };

  const handleBack = () => {
    navigate("/tenant/plan");
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, minHeight: "100vh", bgcolor: colors.foreground[100] }}>
      {/* Header Section */}
      <Typography
        variant="h1"
        fontWeight={700}
        mt={3}
        mb={1}
        className="pricing-section-title"
        sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem" }, textAlign: "center" }}
      >
        Confirm <span className="pricing-gradient-text">Your Plan</span>
      </Typography>
      <Typography
        variant="h4"
        className="pricing-section-subtitle"
        sx={{ mb: 2, textAlign: "center", fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Please review your selected plan and billing details below.
      </Typography>

      {/* Card Section */}
      <Card
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          mt: 1,
          borderRadius: 2,
          boxShadow: 2,
          border: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Plan Header */}
          <Typography variant="h4" fontWeight={500} color="text.primary" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {selectedPlan.name} Plan
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Billed {selectedPlan.billingCycle}
          </Typography>
          <Divider sx={{ my: 1 }} />

          {/* Plan Details Section */}
          <Typography variant="h5" fontWeight={500} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            Plan Details
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              <CheckCircleOutline sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
              {selectedPlan.features.users} users
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              <CheckCircleOutline sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
              {selectedPlan.features.storage} storage
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              <CheckCircleOutline sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
              {selectedPlan.features.support}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              {selectedPlan.features.apiAccess ? (
                <CheckCircleOutline sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
              ) : (
                <CancelOutlined className="tenant-pricing-times-icon" sx={{ mr: 1, fontSize: 18 }} />
              )}
              {selectedPlan.features.apiAccess ? "API Access" : "No API Access"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              {selectedPlan.features.analytics ? (
                <CheckCircleOutline sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
              ) : (
                <CancelOutlined className="tenant-pricing-times-icon" sx={{ mr: 1, fontSize: 18 }} />
              )}
              {selectedPlan.features.analytics ? "Advanced Analytics" : "No Advanced Analytics"}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Billing Information Section */}
          <Typography variant="h5" fontWeight={500} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            Billing Information
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body1" color="text.secondary" mb={0.5}>
              Plan Price: ${billingInfo.price.toFixed(2)}/{billingInfo.billingCycle}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={0.5}>
              Tax (8%): ${billingInfo.tax.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total: ${billingInfo.total.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ justifyContent: "space-between", p: 1, borderTop: "1px solid #ddd" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: "#2e3b4e",
              color: "#2e3b4e",
              "&:hover": { borderColor: "#1a252f", color: "#1a252f" },
              textTransform: "none",
              fontSize: "0.875rem",
              px: 2,
              py: 0.5,
            }}
          >
            Back to Plans
          </Button>
          <Button
            className="gradient-button"
            variant="contained"
            onClick={handleProceedToPayment}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              px: 2,
              py: 0.5,
              backgroundColor: "#2ecc71",
              "&:hover": { backgroundColor: "#27ae60" },
            }}
          >
            Proceed to Payment
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default TenantPlanConfirm;