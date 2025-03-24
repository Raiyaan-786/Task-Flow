import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid, Paper, Grid2 } from "@mui/material";
import { jsPDF } from "jspdf";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const PayrollCalculator = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [basicSalary, setBasicSalary] = useState(0);
    const [hra, setHra] = useState(0);
    const [allowances, setAllowances] = useState(0);
    const [bonuses, setBonuses] = useState(0);
    const [pf, setPf] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [tax, setTax] = useState(0);
    const [netPay, setNetPay] = useState(0);

    const calculateNetPay = () => {
        let salary = parseFloat(basicSalary) || 0;
        let houseRent = parseFloat(hra) || 0;
        let extraAllowances = parseFloat(allowances) || 0;
        let bonus = parseFloat(bonuses) || 0;
        let providentFund = parseFloat(pf) || 0;
        let totalDeductions = parseFloat(deductions) || 0;

        if (salary < 0 || houseRent < 0 || extraAllowances < 0 || bonus < 0 || providentFund < 0 || totalDeductions < 0) {
            alert("Values cannot be negative");
            return;
        }

        let taxableIncome = salary + houseRent + extraAllowances + bonus;
        let calculatedTax = taxableIncome > 50000 ? taxableIncome * 0.2 : taxableIncome * 0.1; // 20% tax if > 50K, else 10%
        setTax(calculatedTax);

        let finalPay = taxableIncome - calculatedTax - providentFund - totalDeductions;
        setNetPay(finalPay);
    };

    const downloadPayslip = () => {
        const doc = new jsPDF();
        doc.text("Company XYZ - Payslip", 10, 10);
        doc.text("------------------------", 10, 15);
        doc.text(`Basic Salary: ₹${basicSalary}`, 10, 25);
        doc.text(`HRA: ₹${hra}`, 10, 35);
        doc.text(`Allowances: ₹${allowances}`, 10, 45);
        doc.text(`Bonuses: ₹${bonuses}`, 10, 55);
        doc.text(`PF: ₹${pf}`, 10, 65);
        doc.text(`Deductions: ₹${deductions}`, 10, 75);
        doc.text(`Tax: ₹${tax.toFixed(2)}`, 10, 85);
        doc.text(`Net Pay: ₹${netPay.toFixed(2)}`, 10, 95);
        doc.save("payslip.pdf");
    };

    return (
        <Box p={2} m="20px" height={"67vh"} overflow={"auto"}>
            <Box pb={2}>
                <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>BASIC SALARY</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} /></Grid2>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>HRA</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={hra} onChange={(e) => setHra(e.target.value)} /></Grid2>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>ALLOWANCES</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={allowances} onChange={(e) => setAllowances(e.target.value)} /></Grid2>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>BONUSES</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={bonuses} onChange={(e) => setBonuses(e.target.value)} /></Grid2>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>PROVIDENT FUND</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={pf} onChange={(e) => setPf(e.target.value)} /></Grid2>
                    <Grid2 size={6} display={'flex'} alignItems={'center'}><label>DEDUCTIONS</label></Grid2>
                    <Grid2 size={6}><TextField size="small" type="number" fullWidth value={deductions} onChange={(e) => setDeductions(e.target.value)} /></Grid2>

                    <Grid2 size={12} >
                        <Typography variant="h6" mt={2} textAlign="center">Net Pay: ₹{netPay.toFixed(2)}</Typography>
                    </Grid2>
                    <Grid2 size={3} mt={2}>
                        <Button variant="contained" color="primary"  sx={{ bgcolor: colors.teal[200] }} fullWidth onClick={calculateNetPay} >Calculate Net Pay</Button>
                    </Grid2>
                    <Grid2 size={2} mt={2}>
                        <Button variant="contained" color="secondary" fullWidth onClick={downloadPayslip}>Download Payslip</Button>
                    </Grid2>
                </Grid2>

            </Box>
        </Box>
    );
};

export default PayrollCalculator;
