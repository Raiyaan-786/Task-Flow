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

const TenantReciept = () => {
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
    
      <Box sx={{ p: 3,height:'100vh',bgcolor:colors.foreground[100] }}>
        

          <Typography variant="h1" fontWeight={700} mt={5} mb={2} className="pricing-section-title">
                                  Payment  <span className="pricing-gradient-text">Successful</span>
                                </Typography>
                                <Typography variant="h4" className="pricing-section-subtitle">
                                   Thank you for your payment. Below is your receipt for the {plan.name}{" "}
          plan.
                 </Typography>

        <Card sx={{height:550, mt: 3, borderRadius: 2,maxWidth:900 ,boxShadow: 2, border: "1px solid #ddd",display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Receipt Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold",mb:2 }}>
                Transaction ID: {paymentId}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Date: {new Date(transactionDate).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" ,mb:2}}>
                Plan: {plan.name}
              </Typography>
              <Typography variant="h6">Base Price: ${billingInfo.price.toFixed(2)}</Typography>
              <Typography variant="h6">Tax: ${billingInfo.tax.toFixed(2)}</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total: ${billingInfo.total.toFixed(2)} USD
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" ,mb:2}}>
                Payment Method
              </Typography>
              <Typography variant="h6">
                Cardholder: {paymentDetails.firstName} {paymentDetails.lastName}
              </Typography>
              <Typography variant="h6">
                Card Number: **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="h6">
                Expiry: {paymentDetails.expiryMonth}/{paymentDetails.expiryYear.toString().slice(-2)}
              </Typography>
            </Box>
          </CardContent>
          <Box sx={{ p: 2, display: "flex", justifyContent: "start" }}>
            <Button
              variant="contained"
              className="gradient-button"
              onClick={handleGoToDashboard}
              sx={{
                backgroundColor: "#2ecc71",
                color: "#fff",
                "&:hover": { backgroundColor: "#27ae60" },
                
                px: 4,
              }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Card>
      </Box>
   
  );
};

export default TenantReciept;