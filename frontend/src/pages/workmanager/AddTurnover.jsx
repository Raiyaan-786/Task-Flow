import React from 'react';
import { Autocomplete, Box, Button, IconButton, TextField } from "@mui/material";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { mockDataManagers } from "../../data/mockData";  // Assuming mockDataManagers is used for customer data
import { AddCircleOutline, AddOutlined, DeleteOutline, RemoveCircleOutline } from '@mui/icons-material';

const AddTurnoverCertificate = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box p={2} m="20px" height={'67vh'} overflow={'auto'}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
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
                        <Box
                            pt={1}
                            display="grid"
                            gap="10px"
                            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            {/* Select Customer */}
                            <Autocomplete
                                size="small"
                                disablePortal
                                options={mockDataManagers}
                                fullWidth
                                name="customer"
                                getOptionLabel={(option) => option.label}
                                onBlur={handleBlur}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "customer",
                                        value !== null ? value.label : initialValues.customer
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        variant="outlined"
                                        {...params}
                                        label="Select Customer"
                                        name="customer"
                                        error={!!touched.customer && !!errors.customer}
                                        helperText={touched.customer && errors.customer}
                                    />
                                )}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Company/Firm Name */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="Company/Firm Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.companyName}
                                name="companyName"
                                error={!!touched.companyName && !!errors.companyName}
                                helperText={touched.companyName && errors.companyName}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Name */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Code */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="Code"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.code}
                                name="code"
                                error={!!touched.code && !!errors.code}
                                helperText={touched.code && errors.code}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* PAN */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="PAN"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.pan}
                                name="pan"
                                error={!!touched.pan && !!errors.pan}
                                helperText={touched.pan && errors.pan}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Address */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="Address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address}
                                name="address"
                                error={!!touched.address && !!errors.address}
                                helperText={touched.address && errors.address}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Types */}
                            <TextField
                                size="small"
                                fullWidth
                                variant="outlined"
                                label="Types"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.types}
                                name="types"
                                error={!!touched.types && !!errors.types}
                                helperText={touched.types && errors.types}
                                sx={{ gridColumn: "span 8" }}
                            />

                            {/* Dynamic Fields for Financial Year, Turnover, and Status */}
                            <FieldArray
                                name="turnoverDetails"
                                render={(arrayHelpers) => (
                                    <>
                                        {values.turnoverDetails.map((turnoverDetail, index) => (
                                            <React.Fragment key={index}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Financial Year"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.turnoverDetails[index].financialYear}
                                                    name={`turnoverDetails[${index}].financialYear`}
                                                    error={!!touched.turnoverDetails?.[index]?.financialYear && !!errors.turnoverDetails?.[index]?.financialYear}
                                                    helperText={touched.turnoverDetails?.[index]?.financialYear && errors.turnoverDetails?.[index]?.financialYear}
                                                    sx={{ gridColumn: "span 2" }}
                                                />
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Turnover"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.turnoverDetails[index].turnover}
                                                    name={`turnoverDetails[${index}].turnover`}
                                                    error={!!touched.turnoverDetails?.[index]?.turnover && !!errors.turnoverDetails?.[index]?.turnover}
                                                    helperText={touched.turnoverDetails?.[index]?.turnover && errors.turnoverDetails?.[index]?.turnover}
                                                    sx={{ gridColumn: "span 2" }}
                                                />
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Status"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.turnoverDetails[index].status}
                                                    name={`turnoverDetails[${index}].status`}
                                                    error={!!touched.turnoverDetails?.[index]?.status && !!errors.turnoverDetails?.[index]?.status}
                                                    helperText={touched.turnoverDetails?.[index]?.status && errors.turnoverDetails?.[index]?.status}
                                                    sx={{ gridColumn: "span 2" }}
                                                />

                                                {/* Remove Button */}
                                                <Box gridColumn="span 1" display="flex" justifyContent="end" >
                                                    <Button
                                                        type="button"
                                                        color="error"
                                                        variant='outlined'
                                                        size='small'
                                                        onClick={() => arrayHelpers.remove(index)}
                                                        disabled={values.turnoverDetails.length === 1} // Disable if there's only one item
                                                    >
                                                        <RemoveCircleOutline/>
                                                    </Button>
                                                </Box>
                                            </React.Fragment>
                                        ))}

                                        {/* Add More Button */}
                                        <Box gridColumn="span 1" display="flex" justifyContent="end" >
                                            <Button
                                                type="button"
                                                variant="contained"
                                                 size='small'
                                                onClick={() => arrayHelpers.push({ financialYear: "", turnover: "", status: "" })}
                                            >
                                                <AddCircleOutline/>
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            />

                            {/* Submit Button */}
                            <Box gridColumn="span 8" display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" variant="contained">
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    customer: yup.string().required("Customer is required"),
    companyName: yup.string().required("Company/Firm Name is required"),
    name: yup.string().required("Name is required"),
    code: yup.string().required("Code is required"),
    pan: yup.string().required("PAN is required"),
    address: yup.string().required("Address is required"),
    types: yup.string().required("Types is required"),
    turnoverDetails: yup.array().of(
        yup.object().shape({
            financialYear: yup.string().required("Financial Year is required"),
            turnover: yup.number().required("Turnover is required"),
            status: yup.string().required("Status is required"),
        })
    )
});

const initialValues = {
    customer: "",
    companyName: "",
    name: "",
    code: "",
    pan: "",
    address: "",
    types: "",
    turnoverDetails: [
        {
            financialYear: "",
            turnover: "",
            status: ""
        }
    ]
};

export default AddTurnoverCertificate;
