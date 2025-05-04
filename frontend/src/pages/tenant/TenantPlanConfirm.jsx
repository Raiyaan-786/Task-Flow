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

const TenantPlanConfirm = () => {
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
   
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
          Confirm Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please review your selected plan and billing details below.
        </Typography>

        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #ddd" }}>
          <CardContent>
            <Typography variant="h5" color="text.primary" gutterBottom>
              {selectedPlan.name} Plan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Billed {selectedPlan.billingCycle}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Plan Details</Typography>
            <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.users} users
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.storage} storage
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.support}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.apiAccess ? "API Access" : "No API Access"}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <FaCheckCircle style={{ color: "#4CAF50", marginRight: 8 }} />
              {selectedPlan.features.analytics ? "Advanced Analytics" : "No Advanced Analytics"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Billing Information</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1">
                Plan Price: ${billingInfo.price.toFixed(2)}/{billingInfo.billingCycle}
              </Typography>
              <Typography variant="body1">
                Tax (8%): ${billingInfo.tax.toFixed(2)}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
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
              }}
            >
              Back to Plans
            </Button>
            <Button
              variant="contained"
              onClick={handleProceedToPayment}
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45a049" },
                borderRadius: 1,
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