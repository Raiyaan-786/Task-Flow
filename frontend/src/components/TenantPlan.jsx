import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { tenantLogout } from "../features/tenantAuthSlice";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const storedPlans = localStorage.getItem("tenantPlans");
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      const defaultPlans = [
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
      setPlans(defaultPlans);
      localStorage.setItem("tenantPlans", JSON.stringify(defaultPlans));
    }
  }, []);

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate("/tenantlogin");
  };

  return (
    <TenantLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Subscription Plans
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Choose the plan that fits your business needs
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: 250,
                borderRadius: 2,
                boxShadow: 2,
                border: plan.recommended
                  ? "2px solid #4CAF50"
                  : "1px solid #ddd",
                position: "relative",
              }}
            >
              {plan.recommended && (
                <Chip
                  label="Recommended"
                  color="success"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: 10,
                    fontWeight: "bold",
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
                    <FaCheck style={{ color: "#4CAF50", marginRight: 1 }} />{" "}
                    {plan.features.users} users
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FaCheck style={{ color: "#4CAF50", marginRight: 1 }} />{" "}
                    {plan.features.storage} storage
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FaCheck style={{ color: "#4CAF50", marginRight: 1 }} />{" "}
                    {plan.features.support}
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    {plan.features.apiAccess ? (
                      <FaCheck style={{ color: "#4CAF50", marginRight: 1 }} />
                    ) : (
                      <FaTimes style={{ color: "#f44336", marginRight: 1 }} />
                    )}
                    API Access
                  </Typography>
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    {plan.features.analytics ? (
                      <FaCheck style={{ color: "#4CAF50", marginRight: 1 }} />
                    ) : (
                      <FaTimes style={{ color: "#f44336", marginRight: 1 }} />
                    )}
                    Advanced Analytics
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => alert(`Selected ${plan.name} plan`)}
                  sx={{
                    backgroundColor: plan.recommended ? "#4CAF50" : "#2e3b4e",
                    "&:hover": {
                      backgroundColor: plan.recommended ? "#45a049" : "#1a252f",
                    },
                    borderRadius: 1,
                  }}
                >
                  {plan.recommended ? "Current Plan" : "Upgrade Now"}
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
