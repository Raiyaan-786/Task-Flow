import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import TenantLayout from "./TenantLayout";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const TenantReceipt = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, billingInfo, paymentDetails, paymentId, transactionDate } =
    location.state || {};

  if (!plan || !billingInfo || !paymentDetails || !paymentId) {
    navigate("/tenant/payment");
    return null;
  }

  const handleGoToDashboard = () => {
    navigate("/tenant/profile", { state: { plan } });
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, minHeight: '100vh', bgcolor: colors.foreground[100] }}>
      {/* Header Section */}
      <Typography
        variant="h1"
        fontWeight={700}
        mt={3} // Reduced from 5 (40px) to 3 (24px)
        mb={0.5} // Reduced from 1 (8px) to 0.5 (4px)
        className="pricing-section-title"
        sx={{ fontSize: { xs: "2rem", sm: "3rem" }, textAlign: "center" }}
      >
        Payment <span className="pricing-gradient-text">Successful</span>
      </Typography>
      <Typography
        variant="h4"
        className="pricing-section-subtitle"
        sx={{ mb: 1.5, textAlign: "center", fontSize: { xs: "1.2rem", sm: "1.5rem" } }} // Reduced from 3 (24px) to 1.5 (12px)
      >
        Thank you for your payment. Below is your receipt for the {plan.name} plan.
      </Typography>

      {/* Receipt Card */}
      <Card
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          mt: 1, // Reduced from 2 (16px) to 1 (8px)
          borderRadius: 2,
          boxShadow: 2,
          border: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          minHeight: 300, // Reduced from 400px to 300px to reflect compact layout
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}> {/* Reduced padding from 3 (24px) to 2 (16px) */}
          <Typography variant="h4" fontWeight="bold" mb={1}> {/* Reduced from 2 (16px) to 1 (8px) */}
            Receipt Details
          </Typography>
          <Divider sx={{ mb: 1.5 }} /> {/* Reduced from 3 (24px) to 1.5 (12px) */}

          {/* Transaction Details */}
          <Box sx={{ mb: 2 }}> {/* Reduced from 3 (24px) to 2 (16px) */}
            <Typography variant="h5" fontWeight="bold" mb={1}> {/* Reduced from 1.5 (12px) to 1 (8px) */}
              Transaction ID: {paymentId}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Date: {new Date(transactionDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>

          {/* Plan Details */}
          <Box sx={{ mb: 2 }}> {/* Reduced from 3 (24px) to 2 (16px) */}
            <Typography variant="h5" fontWeight="bold" mb={1}> {/* Reduced from 1.5 (12px) to 1 (8px) */}
              Plan: {plan.name}
            </Typography>
            <Typography variant="h6" mb={0.25}> {/* Reduced from 0.5 (4px) to 0.25 (2px) */}
              Base Price: ${billingInfo.price.toFixed(2)}
            </Typography>
            <Typography variant="h6" mb={0.25}> {/* Reduced from 0.5 (4px) to 0.25 (2px) */}
              Tax: ${billingInfo.tax.toFixed(2)}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Total: ${billingInfo.total.toFixed(2)} USD
            </Typography>
          </Box>

          {/* Payment Method */}
          <Box sx={{ mb: 2 }}> {/* Reduced from 3 (24px) to 2 (16px) */}
            <Typography variant="h5" fontWeight="bold" mb={1}> {/* Reduced from 1.5 (12px) to 1 (8px) */}
              Payment Method
            </Typography>
            <Typography variant="h6" mb={0.25}> {/* Reduced from 0.5 (4px) to 0.25 (2px) */}
              Cardholder: {paymentDetails.firstName} {paymentDetails.lastName}
            </Typography>
            <Typography variant="h6" mb={0.25}> {/* Reduced from 0.5 (4px) to 0.25 (2px) */}
              Card Number: **** **** **** {paymentDetails.cardNumber.slice(-4)}
            </Typography>
            <Typography variant="h6">
              Expiry: {paymentDetails.expiryMonth}/{paymentDetails.expiryYear.toString().slice(-2)}
            </Typography>
          </Box>
        </CardContent>

        {/* Action Button */}
        <Box sx={{ p: 1.5, display: "flex", justifyContent: "center", borderTop: "1px solid #ddd" }}> {/* Reduced padding from 2 (16px) to 1.5 (12px) */}
          <Button
            variant="contained"
            className="gradient-button"
            onClick={handleGoToDashboard}
            sx={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              "&:hover": { backgroundColor: "#27ae60" },
              textTransform: "none",
              fontSize: "0.875rem",
              px: 4,
              py: 1,
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default TenantReceipt;