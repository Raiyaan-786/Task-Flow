import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  Alert,
} from "@mui/material";
import TenantLayout from "./TenantLayout";
import API from "../../api/api";

const TenantPlan = () => {
  const [plans, setPlans] = useState([]);
  const [tenantPlan, setTenantPlan] = useState(null);
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tenant data from localStorage
    const tenantData = localStorage.getItem("tenant");
    if (tenantData) {
      try {
        const parsedTenantData = JSON.parse(tenantData);
        setTenantPlan(parsedTenantData.plan); // Extract tenant's plan
      } catch (error) {
        console.error("Error parsing tenant data:", error);
        setError("Failed to load tenant data.");
      }
    }

    // Fetch plans from backend
    const fetchPlans = async () => {
      try {
        const tenanttoken = localStorage.getItem("tenanttoken");
        if (!tenanttoken) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await API.get("/tenant/getAllPlans", {
          headers: {
            Authorization: `Bearer ${tenanttoken}`,
          },
        });

        if (!response.data.plans) {
          throw new Error("Invalid response format: No plans found.");
        }

        setPlans(response.data.plans);
        setError(null); 
      } catch (error) {
        console.error("Error fetching plans:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to fetch subscription plans."
        );
      }
    };
    fetchPlans();
  }, []);

  const isCurrentPlan = (plan) => {
    if (!tenantPlan) return false;
    return plan.tier.toLowerCase() === tenantPlan.tier.toLowerCase();
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    if (isCurrentPlan(plan)) {
      alert(`You are already on the ${plan.tier} plan`);
    } else {
      navigate("/tenant/plan-confirmation", { state: { plan } });
    }
  };

  return (
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Subscription Plans
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Choose the plan that fits your business needs
        </Typography>

        {tenantPlan && (
          <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
            Your current plan: <strong>{tenantPlan.tier}</strong> (
            {tenantPlan.status === "active" ? "Active" : tenantPlan.status})
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {plans.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary">
            Loading plans...
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
          {plans.map((plan) => (
            <Card
              key={plan._id}
              sx={{
                flex: 1,
                minWidth: 250,
                borderRadius: 2,
                boxShadow: 2,
                border: isCurrentPlan(plan)
                  ? "2px solid #FF9800"
                  : plan.recommended
                  ? "2px solid #4CAF50"
                  : "1px solid #ddd",
                position: "relative",
              }}
            >
              {(plan.recommended || isCurrentPlan(plan)) && (
                <Chip
                  label={isCurrentPlan(plan) ? "Current Plan" : "Recommended"}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: 10,
                    fontWeight: "bold",
                    backgroundColor: isCurrentPlan(plan) ? "#FF9800" : "#4CAF50",
                    color: "#fff",
                  }}
                />
              )}
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  color="text.primary"
                  gutterBottom
                >
                  {plan.tier}
                </Typography>
                <Typography variant="h4" color="primary">
                  ${parseFloat(plan.price).toFixed(2)}
                  <span style={{ fontSize: "1rem", color: "#666" }}>
                    /{plan.billingCycle}
                  </span>
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FaCheck style={{ color: "#4CAF50", marginRight: 8 }} />
                    {plan.features.users} users
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FaCheck style={{ color: "#4CAF50", marginRight: 8 }} />
                    {plan.features.storage} storage
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FaCheck style={{ color: "#4CAF50", marginRight: 8 }} />
                    {plan.features.support}
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    {plan.features.apiAccess ? (
                      <FaCheck style={{ color: "#4CAF50", marginRight: 8 }} />
                    ) : (
                      <FaTimes style={{ color: "#f44336", marginRight: 8 }} />
                    )}
                    API Access
                  </Typography>
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    {plan.features.analytics ? (
                      <FaCheck style={{ color: "#4CAF50", marginRight: 8 }} />
                    ) : (
                      <FaTimes style={{ color: "#f44336", marginRight: 8 }} />
                    )}
                    Advanced Analytics
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handlePlanSelect(plan)}
                  sx={{
                    backgroundColor: isCurrentPlan(plan)
                      ? "#FF9800"
                      : plan.recommended
                      ? "#4CAF50"
                      : "#2e3b4e",
                    "&:hover": {
                      backgroundColor: isCurrentPlan(plan)
                        ? "#F57C00"
                        : plan.recommended
                        ? "#45a049"
                        : "#1a252f",
                    },
                    borderRadius: 1,
                  }}
                >
                  {isCurrentPlan(plan) ? "Current Plan" : "Upgrade Now"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    
  );
};

export default TenantPlan;