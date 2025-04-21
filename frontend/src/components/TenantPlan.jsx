import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
} from "@mui/material";
import TenantLayout from "./TenantLayout";

const TenantPlan = () => {
  const [plans, setPlans] = useState([]);
  const [tenantPlan, setTenantPlan] = useState(null);

  useEffect(() => {
    // Fetch tenant data from localStorage
    const tenantData = localStorage.getItem("tenant");
    if (tenantData) {
      try {
        const parsedTenantData = JSON.parse(tenantData);
        setTenantPlan(parsedTenantData.plan); // Extract tenant's plan
      } catch (error) {
        console.error("Error parsing tenant data:", error);
      }
    }

    // Define static plans
    const staticPlans = [
      {
        name: "Free",
        price: 0,
        billingCycle: "monthly",
        features: {
          users: 1,
          storage: "1GB",
          support: "Community only",
          apiAccess: false,
          analytics: false,
        },
      },
      {
        name: "Basic",
        price: 19.99,
        billingCycle: "monthly",
        features: {
          users: 5,
          storage: "10GB",
          support: "Email only",
          apiAccess: false,
          analytics: false,
        },
      },
      {
        name: "Pro",
        price: 49.99,
        billingCycle: "monthly",
        features: {
          users: 15,
          storage: "50GB",
          support: "Priority email",
          apiAccess: true,
          analytics: true,
        },
        recommended: true,
      },
      {
        name: "Enterprise",
        price: 99.99,
        billingCycle: "monthly",
        features: {
          users: "Unlimited",
          storage: "1TB",
          support: "24/7 phone",
          apiAccess: true,
          analytics: true,
        },
      },
    ];
    setPlans(staticPlans);
  }, []);

  // Function to check if the plan is the tenant's current plan
  const isCurrentPlan = (plan) => {
    if (!tenantPlan) return false;
    return plan.name.toLowerCase() === tenantPlan.tier.toLowerCase();
  };

  return (
    <TenantLayout>
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

        <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: 250,
                borderRadius: 2,
                boxShadow: 2,
                border: isCurrentPlan(plan)
                  ? "2px solid #FF9800" // Orange for current plan
                  : plan.recommended
                  ? "2px solid #4CAF50" // Green for recommended
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
                    backgroundColor: isCurrentPlan(plan) ? "#FF9800" : "#4CAF50", // Orange for current, green for recommended
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
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary">
                  ${plan.price}
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
                  onClick={() =>
                    isCurrentPlan(plan)
                      ? alert(`You are already on the ${plan.name} plan`)
                      : alert(`Selected ${plan.name} plan`)
                  }
                  sx={{
                    backgroundColor: isCurrentPlan(plan)
                      ? "#FF9800" // Orange for current plan
                      : plan.recommended
                      ? "#4CAF50" // Green for recommended
                      : "#2e3b4e",
                    "&:hover": {
                      backgroundColor: isCurrentPlan(plan)
                        ? "#F57C00" // Darker orange on hover
                        : plan.recommended
                        ? "#45a049" // Darker green on hover
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
    </TenantLayout>
  );
};

export default TenantPlan;