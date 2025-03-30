import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid, Paper, Grid2 } from "@mui/material";
import { jsPDF } from "jspdf";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const TDSCalculator = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [annualIncome, setAnnualIncome] = useState(0);
  const [exemptions, setExemptions] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [cess, setCess] = useState(4); // Default cess is 4%
  const [tds, setTds] = useState(0);

  const calculateTDS = () => {
    let income = parseFloat(annualIncome) || 0;
    let exemption = parseFloat(exemptions) || 0;

    if (income < 0 || exemption < 0) {
      alert("Values cannot be negative");
      return;
    }

    let taxableIncome = income - exemption;
    let calculatedTDS = 0;

    // Example tax slabs
    if (taxableIncome <= 250000) {
      calculatedTDS = 0; // No tax for income <= 2.5L
    } else if (taxableIncome <= 500000) {
      calculatedTDS = (taxableIncome - 250000) * 0.05; // 5% tax for income between 2.5L and 5L
    } else if (taxableIncome <= 1000000) {
      calculatedTDS = (250000 * 0.05) + (taxableIncome - 500000) * 0.2; // 20% tax for income between 5L and 10L
    } else {
      calculatedTDS = (250000 * 0.05) + (500000 * 0.2) + (taxableIncome - 1000000) * 0.3; // 30% tax for income above 10L
    }

    // Add surcharge
    let surchargeAmount = (calculatedTDS * parseFloat(surcharge)) / 100;

    // Add cess
    let cessAmount = ((calculatedTDS + surchargeAmount) * parseFloat(cess)) / 100;

    // Final TDS
    let totalTDS = calculatedTDS + surchargeAmount + cessAmount;
    setTds(totalTDS.toFixed(2));
  };

  const downloadTDSReport = () => {
    const doc = new jsPDF();
    doc.text("TDS Report", 10, 10);
    doc.text("------------------------", 10, 15);
    doc.text(`Annual Income: ₹${annualIncome}`, 10, 25);
    doc.text(`Exemptions: ₹${exemptions}`, 10, 35);
    doc.text(`Surcharge: ${surcharge}%`, 10, 45);
    doc.text(`Cess: ${cess}%`, 10, 55);
    doc.text(`TDS Amount: ₹${tds}`, 10, 65);
    doc.save("TDS_Report.pdf");
  };

  return (
    <Box p={2} m="20px" height={"67vh"} overflow={"auto"}>
      <Box pb={2}>
        <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
          <Grid2 size={6} display={"flex"} alignItems={"center"}>
            <label>ANNUAL INCOME</label>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6} display={"flex"} alignItems={"center"}>
            <label>EXEMPTIONS</label>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={exemptions}
              onChange={(e) => setExemptions(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6} display={"flex"} alignItems={"center"}>
            <label>SURCHARGE (%)</label>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6} display={"flex"} alignItems={"center"}>
            <label>CESS (%)</label>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size="small"
              type="number"
              fullWidth
              value={cess}
              onChange={(e) => setCess(e.target.value)}
            />
          </Grid2>

          <Grid2 size={12}>
            <Typography variant="h6" mt={2} textAlign="center">
              TDS Amount: ₹{tds}
            </Typography>
          </Grid2>
          <Grid2 size={3} mt={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ bgcolor: colors.teal[200] }}
              fullWidth
              onClick={calculateTDS}
            >
              Calculate TDS
            </Button>
          </Grid2>
          <Grid2 size={3} mt={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={downloadTDSReport}
            >
              Download Report
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default TDSCalculator;