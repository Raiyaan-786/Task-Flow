import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import API from "../../api/api";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import "./TenantPlan.css";
import { Typography, Skeleton } from "@mui/material";
import { CancelOutlined, CheckCircleOutlineOutlined } from "@mui/icons-material";

const TenantPlan = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [plans, setPlans] = useState([]);
  const [tenantPlan, setTenantPlan] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tenant data from localStorage
    const tenantData = localStorage.getItem("tenant");
    if (tenantData) {
      try {
        const parsedTenantData = JSON.parse(tenantData);
        setTenantPlan(parsedTenantData.plan);
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

  const handlePlanSelect = (plan) => {
    if (isCurrentPlan(plan)) {
      alert(`You are already on the ${plan.tier} plan`);
    } else {
      navigate("/tenant/plan-confirmation", { state: { plan } });
    }
  };

  return (
    <div
      className="tenant-pricing-section"
      style={{
        backgroundColor: colors.foreground[100],
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <Typography variant="h1" fontWeight={700} mt={5} mb={2} className="pricing-section-title">
        Simple, Transparent <span className="pricing-gradient-text">Subscription Plans</span>
      </Typography>
      <Typography variant="h4" className="pricing-section-subtitle">
        Choose the perfect plan for your CA firm. All plans include a 14-day free trial.
      </Typography>
      {tenantPlan && (
        <p className="tenant-pricing-current-plan">
          Your current plan: <strong>{tenantPlan.tier}</strong> (
          {tenantPlan.status === "active" ? "Active" : tenantPlan.status})
        </p>
      )}

      {error && <div className="tenant-pricing-error">{error}</div>}

      {plans.length === 0 && !error && (
        <div className="tenant-pricing-grid">
          {[1, 2, 3,4].map((_, index) => (
            <div key={index} className="tenant-pricing-card">
              <div className="tenant-pricing-card-header">
                <Skeleton variant="text" width="60%" height={40} sx={{ mx: "auto" }} />
                <div className="tenant-pricing-price-container">
                  <Skeleton variant="text" width={100} height={60} />
                  <Skeleton variant="text" width={60} height={30} />
                </div>
              </div>
              <div className="tenant-pricing-card-content">
                <ul className="tenant-pricing-features-list">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <li key={idx} className="tenant-pricing-feature-item">
                      <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width="80%" height={24} />
                    </li>
                  ))}
                </ul>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {plans.length > 0 && (
        <div className="tenant-pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`tenant-pricing-card ${
                isCurrentPlan(plan)
                  ? "tenant-pricing-current"
                  : plan.recommended
                  ? "tenant-pricing-popular"
                  : ""
              }`}
            >
              {(plan.recommended || isCurrentPlan(plan)) && (
                <div className="tenant-pricing-badge">
                  {isCurrentPlan(plan) ? "Current Plan" : "Recommended"}
                </div>
              )}
              <div className="tenant-pricing-card-header">
                <Typography
                  variant="h3"
                  fontWeight={700}
                  mb={1}
                  className="tenant-pricing-plan-name"
                >
                  {plan.tier}
                </Typography>
                <div className="tenant-pricing-price-container">
                  <Typography
                    variant="h1"
                    fontWeight={700}
                    mr={1}
                    className="pricing-price"
                  >
                    ${plan.price}
                  </Typography>
                  <Typography variant="h5" className="pricing-period">
                    {plan.billingCycle}
                  </Typography>
                </div>
              </div>
              <div className="tenant-pricing-card-content">
                <ul className="tenant-pricing-features-list">
                  <li className="tenant-pricing-feature-item">
                    <CheckCircleOutlineOutlined className="tenant-pricing-check-icon"/>
                    <Typography variant="h5" fontWeight={400} className="tenant-pricing-feature-text">
                      {plan.features.users} users
                    </Typography>
                  </li>
                  <li className="tenant-pricing-feature-item">
                    <CheckCircleOutlineOutlined className="tenant-pricing-check-icon"/>
                    <Typography variant="h5" fontWeight={400} className="tenant-pricing-feature-text">
                      {plan.features.storage} storage
                    </Typography>
                  </li>
                  <li className="tenant-pricing-feature-item">
                    <CheckCircleOutlineOutlined className="tenant-pricing-check-icon"/>
                    <Typography variant="h5" fontWeight={400} className="tenant-pricing-feature-text">
                      {plan.features.support}
                    </Typography>
                  </li>
                  <li className="tenant-pricing-feature-item">
                    {plan.features.apiAccess ? (
                      <CheckCircleOutlineOutlined className="tenant-pricing-check-icon"/>
                    ) : (
                      <CancelOutlined className="tenant-pricing-times-icon" />
                    )}
                    <Typography variant="h5" fontWeight={400} className="tenant-pricing-feature-text">
                      API Access
                    </Typography>
                  </li>
                  <li className="tenant-pricing-feature-item">
                    {plan.features.analytics ? (
                      <CheckCircleOutlineOutlined className="tenant-pricing-check-icon"/>
                    ) : (
                      <CancelOutlined className="tenant-pricing-times-icon" />
                    )}
                    <Typography variant="h5" fontWeight={400} className="tenant-pricing-feature-text">
                      Advanced Analytics
                    </Typography>
                  </li>
                </ul>
                <button
                  className={`tenant-pricing-button ${
                    isCurrentPlan(plan)
                      ? "tenant-pricing-current-button"
                      : plan.recommended
                      ? "tenant-pricing-gradient-button"
                      : "tenant-pricing-outline-button"
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {isCurrentPlan(plan) ? "Current Plan" : "Upgrade Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantPlan;