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

const TenantReciept = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, billingInfo, paymentDetails, paymentId, transactionDate } =
    location.state || {};

  if (!plan || !billingInfo || !paymentDetails || !paymentId) {
    navigate("/tenant/payment");
    return null;
  }

  const handleGoToDashboard = () => {
    navigate("/tenant", { state: { plan } });
  };

  return (
    <TenantLayout>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", color: "#2ecc71" }}
        >
          <FaCheckCircle style={{ marginRight: 8 }} />
          Payment Successful
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Thank you for your payment. Below is your receipt for the {plan.name}{" "}
          plan.
        </Typography>

        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #ddd" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Receipt Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Transaction ID: {paymentId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(transactionDate).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Plan: {plan.name}
              </Typography>
              <Typography variant="body2">Base Price: ${billingInfo.price.toFixed(2)}</Typography>
              <Typography variant="body2">Tax: ${billingInfo.tax.toFixed(2)}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Total: ${billingInfo.total.toFixed(2)} USD
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Payment Method
              </Typography>
              <Typography variant="body2">
                Cardholder: {paymentDetails.firstName} {paymentDetails.lastName}
              </Typography>
              <Typography variant="body2">
                Card Number: **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body2">
                Expiry: {paymentDetails.expiryMonth}/{paymentDetails.expiryYear.toString().slice(-2)}
              </Typography>
            </Box>
          </CardContent>
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleGoToDashboard}
              sx={{
                backgroundColor: "#2ecc71",
                color: "#fff",
                "&:hover": { backgroundColor: "#27ae60" },
                borderRadius: 0,
                px: 4,
              }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Card>
      </Box>
    </TenantLayout>
  );
};

export default TenantReciept;