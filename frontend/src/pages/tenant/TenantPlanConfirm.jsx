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
import { FaCheckCircle } from "react-icons/fa";
import TenantLayout from "./TenantLayout";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";

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
    // Retrieve plan data from location state
    const planData = location.state?.plan;
    if (planData) {
      setSelectedPlan(planData);
      // Store selected plan in localStorage for fallback
      localStorage.setItem("selectedPlan", JSON.stringify(planData));
      // Calculate billing details (example tax calculation: 8%)
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
      // Try to retrieve from localStorage as fallback
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
   
      <Box sx={{ p: 3,height:'100vh',bgcolor:colors.foreground[100] }}>

         <Typography variant="h1" fontWeight={700} mt={5} mb={2} className="pricing-section-title">
                          Confirm  <span className="pricing-gradient-text">Your Plan</span>
                        </Typography>
                        <Typography variant="h4" className="pricing-section-subtitle">
                          Please review your selected plan and billing details below.
         </Typography>
         
        <Card sx={{ mt: 5, borderRadius: 2, border: "1px solid #ddd" }}>
          <CardContent>
            <Typography variant="h4" fontWeight={500} color="text.primary" gutterBottom>
              {selectedPlan.name} Plan
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Billed {selectedPlan.billingCycle}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4" fontWeight={500}>Plan Details</Typography>
            <Typography variant="h5" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <CheckCircleOutline style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.users} users
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <CheckCircleOutline style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.storage} storage
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <CheckCircleOutline style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.support}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {selectedPlan.features.apiAccess ? (<CheckCircleOutline style={{ color: "#4CAF50", marginRight: 8 }} />) 
              : (<CancelOutlined className="tenant-pricing-times-icon" />)}
              {selectedPlan.features.apiAccess ? "API Access" : "No API Access"}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {selectedPlan.features.analytics ? (<CheckCircleOutline style={{ color: "#4CAF50", marginRight: 8 }} />) 
              : (<CancelOutlined className="tenant-pricing-times-icon" />)}
              {selectedPlan.features.analytics ? "Advanced Analytics" : "No Advanced Analytics"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4" fontWeight={500}>Billing Information</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="h5" color="text.secondary">
                Plan Price: ${billingInfo.price.toFixed(2)}/{billingInfo.billingCycle}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Tax (8%): ${billingInfo.tax.toFixed(2)}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
                Total: ${billingInfo.total.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                borderColor: "#2e3b4e",
                color: "#2e3b4e",
                "&:hover": { borderColor: "#1a252f", color: "#1a252f" },
                textTransform: "none",
                fontSize: ".875rem",
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
                fontSize: ".875rem",
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