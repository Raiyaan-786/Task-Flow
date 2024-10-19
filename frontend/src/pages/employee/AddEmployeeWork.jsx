import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Grid, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const AddEmployeeWork = () => {

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box p={2} m="20px" height={'67vh'} overflow={'auto'}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
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
                            <Grid container spacing={2}>
                                
                                {/* Work Name */}
                                <Grid item xs={4}>
                                    <label>Work Name</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.workName}
                                        name="workName"
                                        error={!!touched.workName && !!errors.workName}
                                        helperText={touched.workName && errors.workName}
                                    />
                                </Grid>

                                {/* Select Service */}
                                <Grid item xs={4}>
                                    <label>Select Service</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormControl fullWidth size="small" error={!!touched.service && !!errors.service}>
                                        <InputLabel>Service</InputLabel>
                                        <Select
                                            name="service"
                                            value={values.service}
                                            onChange={handleChange}
                                            label="Service"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="Service1">Service1</MenuItem>
                                            <MenuItem value="Service2">Service2</MenuItem>
                                            <MenuItem value="Service3">Service3</MenuItem>
                                        </Select>
                                        <FormHelperText>{touched.service && errors.service}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Contact Person */}
                                <Grid item xs={4}>
                                    <label>Contact Person</label>
                                </Grid>
                                <Grid item xs={8}>
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
                                </Grid>

                                {/* Select Employee */}
                                <Grid item xs={4}>
                                    <label>Select Employee</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormControl fullWidth size="small" error={!!touched.employee && !!errors.employee}>
                                        <InputLabel>Employee</InputLabel>
                                        <Select
                                            name="employee"
                                            value={values.employee}
                                            onChange={handleChange}
                                            label="Employee"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="Employee1">Employee1</MenuItem>
                                            <MenuItem value="Employee2">Employee2</MenuItem>
                                            <MenuItem value="Employee3">Employee3</MenuItem>
                                        </Select>
                                        <FormHelperText>{touched.employee && errors.employee}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Upload Document */}
                                <Grid item xs={4}>
                                    <label>Upload Document</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <input
                                        type="file"
                                        name="document"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            setFieldValue('document', event.currentTarget.files[0]);
                                        }}
                                    />
                                    {touched.document && errors.document && (
                                        <Box color="error.main" fontSize="0.75rem">{errors.document}</Box>
                                    )}
                                </Grid>

                                {/* Reminder Date */}
                                <Grid item xs={4}>
                                    <label>Reminder Date</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.reminderDate}
                                        name="reminderDate"
                                        error={!!touched.reminderDate && !!errors.reminderDate}
                                        helperText={touched.reminderDate && errors.reminderDate}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid item xs={4}>
                                    <label>Status</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormControl fullWidth size="small" error={!!touched.status && !!errors.status}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={values.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                        <FormHelperText>{touched.status && errors.status}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="end" mt="20px">
                                        <Button type="submit" variant="contained">
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

// Yup validation schema
const validationSchema = yup.object().shape({
    workName: yup.string().required("Work Name is required"),
    service: yup.string().required("Service is required"),
    contactPerson: yup.string().required("Contact Person is required"),
    employee: yup.string().required("Employee selection is required"),
    document: yup.mixed().required("Document is required"),
    reminderDate: yup.date().required("Reminder Date is required"),
    status: yup.string().required("Status is required"),
});

// Initial form values
const initialValues = {
    workName: "",
    service: "",
    contactPerson: "",
    employee: "",
    document: null,
    reminderDate: "",
    status: "",
};

export default AddEmployeeWork;
