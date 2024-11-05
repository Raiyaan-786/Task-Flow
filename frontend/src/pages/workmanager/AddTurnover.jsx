import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Autocomplete } from "@mui/material";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import API from '../../api/api';

const AddTurnover = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch customers from backend
    const fetchCustomers = async () => {
        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const response = await API.get('/getallcustomers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(response.data.customers);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to fetch customers. Please try again later.');
        }
    };

    useEffect(() => {
        fetchCustomers(); 
    }, []);

    // Handle form submission to create turnover
    const handleFormSubmit = async (values) => {
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            await API.post('/createturnover', values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Turnover created successfully!');
            alert('Turnover created successfully!');
            
        } catch (err) {
            console.error('Error creating turnover:', err);
            setError('Failed to create turnover. Please try again.');
        } finally {
            setLoading(false);
        }
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
                                options={customers}
                                fullWidth
                                getOptionLabel={(option) => `${option.companyName} (${option.customerName})`}
                                onBlur={handleBlur}
                                onChange={(e, value) => {
                                    setFieldValue("customer", value ? value._id : initialValues.customer);
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

                            {/* Static Fields */}
                            {['companyName', 'name', 'code', 'pan', 'address', 'types'].map((field, index) => (
                                <TextField
                                    key={index}
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values[field]}
                                    name={field}
                                    error={!!touched[field] && !!errors[field]}
                                    helperText={touched[field] && errors[field]}
                                    sx={{ gridColumn: "span 8" }}
                                />
                            ))}

                            {/* Dynamic Fields for Financial Year, Turnover, and Status */}
                            <FieldArray
                                name="turnoverDetails"
                                render={(arrayHelpers) => (
                                    <>
                                        {values.turnoverDetails.map((_, index) => (
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
                                                <Box gridColumn="span 1" display="flex" justifyContent="end">
                                                    <Button
                                                        type="button"
                                                        color="error"
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => arrayHelpers.remove(index)}
                                                        disabled={values.turnoverDetails.length === 1}
                                                    >
                                                        <RemoveCircleOutline />
                                                    </Button>
                                                </Box>
                                            </React.Fragment>
                                        ))}

                                        {/* Add More Button */}
                                        <Box gridColumn="span 1" display="flex" justifyContent="end">
                                            <Button
                                                type="button"
                                                variant="contained"
                                                size="small"
                                                onClick={() => arrayHelpers.push({ financialYear: "", turnover: "", status: "" })}
                                            >
                                                <AddCircleOutline />
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            />

                            {/* Submit Button */}
                            <Box gridColumn="span 8" display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? 'Creating...' : 'Submit'}
                                </Button>
                            </Box>
                        </Box>

                        {/* Display Error or Success Messages */}
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                    </form>
                )}
            </Formik>
        </Box>
    );
};

// Validation Schema with Yup
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
    turnoverDetails: [{ financialYear: "", turnover: "", status: "" }]
};

export default AddTurnover;
