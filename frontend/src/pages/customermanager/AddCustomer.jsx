import React, { useState } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid2 } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const AddCustomer = () => {
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box p={2} m="20px" height={'67vh'} overflow={'auto'}>
            <Formik
                initialValues={initialValues}
                validationSchema={checkoutSchema}
                onSubmit={handleFormSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box pt={1}>
                            <Grid2 container spacing={2}>
                                {/* Customer Name */}
                                <Grid2 size={4}>
                                    <label>Customer Name</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.customerName}
                                        name="customerName"
                                        error={!!touched.customerName && !!errors.customerName}
                                        helperText={touched.customerName && errors.customerName}
                                    />
                                </Grid2>

                                {/* Customer Code */}
                                <Grid2 size={4}>
                                    <label>Customer Code</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.customerCode}
                                        name="customerCode"
                                        error={!!touched.customerCode && !!errors.customerCode}
                                        helperText={touched.customerCode && errors.customerCode}
                                    />
                                </Grid2>

                                {/* Billing Name */}
                                <Grid2 size={4}>
                                    <label>Billing Name</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.billingName}
                                        name="billingName"
                                        error={!!touched.billingName && !!errors.billingName}
                                        helperText={touched.billingName && errors.billingName}
                                    />
                                </Grid2>

                                {/* Company/Firm Name */}
                                <Grid2 size={4}>
                                    <label>Company/Firm Name</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.companyFirmName}
                                        name="companyFirmName"
                                        error={!!touched.companyFirmName && !!errors.companyFirmName}
                                        helperText={touched.companyFirmName && errors.companyFirmName}
                                    />
                                </Grid2>

                                {/* Email */}
                                <Grid2 size={4}>
                                    <label>Email</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid2>

                                {/* Mobile No */}
                                <Grid2 size={4}>
                                    <label>Mobile No</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // Copy mobile number to WhatsApp number if checkbox is checked
                                            if (isWhatsappSame) {
                                                setFieldValue('whatsappNo', e.target.value);
                                            }
                                        }}
                                        value={values.mobile}
                                        name="mobile"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                        }}
                                        error={!!touched.mobile && !!errors.mobile}
                                        helperText={touched.mobile && errors.mobile}
                                    />
                                </Grid2>

                                {/* Checkbox for Same WhatsApp and Mobile */}
                                <Grid2 size={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isWhatsappSame}
                                                onChange={(event) => {
                                                    setIsWhatsappSame(event.target.checked);
                                                    if (event.target.checked) {
                                                        // Copy mobile number to WhatsApp number when checked
                                                        setFieldValue('whatsappNo', values.mobile);
                                                    } else {
                                                        // Clear WhatsApp number when unchecked
                                                        setFieldValue('whatsappNo', '');
                                                    }
                                                }}
                                                name="isWhatsappSame"
                                            />
                                        }
                                        label="WhatsApp No same as Mobile No"
                                    />
                                </Grid2>
                                {/* WhatsApp No */}
                                <Grid2 size={4}>
                                    <label>WhatsApp No</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.whatsappNo}
                                        name="whatsappNo"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                        }}
                                        error={!!touched.whatsappNo && !!errors.whatsappNo}
                                        helperText={touched.whatsappNo && errors.whatsappNo}
                                        disabled={isWhatsappSame} // Disable if checkbox is checked
                                    />
                                </Grid2>
                                {/* PAN */}
                                <Grid2 size={4}>
                                    <label>PAN</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pan}
                                        name="pan"
                                        error={!!touched.pan && !!errors.pan}
                                        helperText={touched.pan && errors.pan}
                                    />
                                </Grid2>

                                {/* Address */}
                                <Grid2 size={4}>
                                    <label>Address</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
                                    />
                                </Grid2>

                                {/* Contact Person */}
                                <Grid2 size={4}>
                                    <label>Contact Person</label>
                                </Grid2>
                                <Grid2 size={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.contactPerson}
                                        name="contactPerson"
                                        error={!!touched.contactPerson && !!errors.contactPerson}
                                        helperText={touched.contactPerson && errors.contactPerson}
                                    />
                                </Grid2>

                                {/* Submit Button */}
                                <Grid2 >
                                    <Box display="flex" justifyContent="end" mt="20px">
                                        <Button type="submit" variant="contained">
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

// Yup validation schema
const checkoutSchema = yup.object().shape({
    customerName: yup.string().required("Customer Name is required"),
    customerCode: yup.string().required("Customer Code is required"),
    billingName: yup.string().required("Billing Name is required"),
    companyFirmName: yup.string().required("Company/Firm Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    whatsappNo: yup.string().matches(/^[0-9]*$/, "WhatsApp No must be a number").required("WhatsApp No is required"),
    mobile: yup.string().matches(/^[0-9]*$/, "Mobile No must be a number").required("Mobile No is required"),
    pan: yup.string().required("PAN is required"),
    address: yup.string().required("Address is required"),
    contactPerson: yup.string().required("Contact Person is required"),
});

// Initial form values
const initialValues = {
    customerName: "",
    customerCode: "",
    billingName: "",
    companyFirmName: "",
    email: "",
    whatsappNo: "",
    mobile: "",
    pan: "",
    address: "",
    contactPerson: "",
};

export default AddCustomer;
