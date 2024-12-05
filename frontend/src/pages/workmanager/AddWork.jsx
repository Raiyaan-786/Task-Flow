import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid2, Typography, Autocomplete, Modal, Alert, } from "@mui/material";
import { Formik } from 'formik';
import * as yup from 'yup';
import API from '../../api/api';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CheckCircle, Cancel } from '@mui/icons-material';

const AddWork = () => {
  const [months, setMonths] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState([]);

  // Generate a list of years for the last 10 years and the next 10 years
  useEffect(() => {
    const yearList = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearList.push(i.toString());
    }
    setYears(yearList);
  }, []);

  const [services] = useState([
    "Consulting", "Audit", "Taxation" // 3 predefined services
  ]);
  const [workTypes] = useState([
    "Internal Audit", "External Audit", "Tax Filing" // 3 predefined work types
  ]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false); //for modal opening and closing
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomersAndEmployees = async () => {
      try {
        const customerResponse = await API.get('/getallcustomers');
        setCustomers(customerResponse.data.customers);
        const employeeResponse = await API.get('/auth/allusers');
        setEmployees(employeeResponse.data.users);
      } catch (err) {
        setError('Failed to load customers or employees');
      }
    };

    fetchCustomersAndEmployees();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);  // Add loading state if needed
      const response = await API.post('/addwork', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message || "Work created successfully!");
      setError("");
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create work');
      setSuccess("");
    }
    setOpen(true);
    setLoading(false);  // Reset loading state
  };



  return (
    <Box p={2} m="20px" height="67vh" overflow="auto">
      <Formik
        initialValues={{
          customer: '',
          billingName: '',
          email: '',
          mobile: '',
          pan: '',
          address: '',
          service: '',
          workType: '',
          assignedEmployee: "",
          month: '',
          quarter: '',
          financialYear: '',
          price: '',
          quantity: '',
          discount: '',
        }}
        validationSchema={yup.object().shape({
          customer: yup.string().required('Customer is required'),
          billingName: yup.string().required('Billing Name is required'),
          email: yup.string().email('Invalid email format').required('Email is required'),
          mobile: yup.string().required('Mobile number is required'),
          pan: yup.string().required('PAN is required'),
          address: yup.string().required('Address is required'),
          service: yup.string().required('Service is required'),
          workType: yup.string().required('Work Type is required'),
          assignedEmployee: yup.string().required('Assigned Employee is required'),
          month: yup.string().required('Month is required'),
          quarter: yup.string().required('Quarter is required'),
          financialYear: yup.string().required('Financial Year is required'),
          price: yup.number().required('Price is required').positive(),
          quantity: yup.number().required('Quantity is required').positive().integer(),
          discount: yup.number().required('Discount is required').min(0),
        })}
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
          resetForm
        }) => (
          <form onSubmit={handleSubmit}>
            <Box pb={2}>
              <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>

                {/* select customer */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CUSTOMER</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={customers}
                    getOptionLabel={(option) => option?.customerName || ""}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}  // Match by _id
                    onChange={(event, value) => {
                      // Store the customer ID in the "customer" field
                      setFieldValue("customer", value?._id || "");  // Update customer field with _id
                      if (value) {
                        // Populate other fields when a customer is selected
                        setFieldValue("billingName", value.billingName || "");
                        setFieldValue("email", value.email || "");
                        setFieldValue("mobile", value.mobileNo || "");
                        setFieldValue("address", value.address || "");
                        setFieldValue("pan", value.PAN || "");
                      } else {
                        // Clear the fields when no customer is selected
                        setFieldValue("billingName", "");
                        setFieldValue("email", "");
                        setFieldValue("mobile", "");
                        setFieldValue("address", "");
                        setFieldValue("pan", "");
                      }
                    }}
                    value={customers.find((cust) => cust._id === values.customer) || null}  // Use _id to find the selected customer
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        placeholder="SELECT CUSTOMER"
                        error={touched.customer && !!errors.customer}
                        helperText={touched.customer && errors.customer}
                      />
                    )}
                    fullWidth
                    size="small"
                  />


                </Grid2>

                {/* Billing Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>BILLING NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER BILLING NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billingName}
                    name="billingName"
                    error={touched.billingName && !!errors.billingName}
                    helperText={touched.billingName && errors.billingName}
                  />
                </Grid2>

                {/* Email */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>EMAIL</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER EMAIL ID'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid2>

                {/* Mobile */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>MOBILE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER MOBILE NUMBER'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mobile}
                    name="mobile"
                    error={touched.mobile && !!errors.mobile}
                    helperText={touched.mobile && errors.mobile}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }}
                  />
                </Grid2>

                {/* PAN */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>PAN NUMBER</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER PAN NUMBER"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.pan}
                    name="pan"
                    error={touched.pan && !!errors.pan}
                    helperText={touched.pan && errors.pan}
                    slotProps={{
                      htmlInput: {
                        style: {
                          textTransform: 'uppercase', // Capitalize all letters
                        },
                        maxLength: 10, // Setting the maximum number of characters to 10
                      },
                    }}
                  />
                </Grid2>

                {/* Address */}
                <Grid2 size={6} >
                  <label>ADDRESS</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    multiline
                    minRows={3}
                    maxRows={3}
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    name="address"
                    error={touched.address && !!errors.address}
                    helperText={touched.address && errors.address}

                  />
                </Grid2>

                {/* fields that will be filled */}

                {/* select SERVICE */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>SELECT SERVICE</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={services}
                    value={values.service}
                    onChange={(event, newValue) => setFieldValue('service', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT SERVICE"
                      error={touched.service && !!errors.service}
                      helperText={touched.service && errors.service}
                    />}
                    fullWidth
                    size="small"
                    onBlur={handleBlur}
                  />
                </Grid2>

                {/* select WORK */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>SELECT WORK</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={workTypes}
                    value={values.workType}
                    onChange={(event, newValue) => setFieldValue('workType', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT WORK TYPE"
                      error={touched.workType && !!errors.workType}
                      helperText={touched.workType && errors.workType}
                    />}
                    fullWidth
                    size="small"
                    onBlur={handleBlur}
                  />
                </Grid2>

                {/* Assign employee */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>ASSIGN EMPLOYEE</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={employees}
                    value={employees.find(emp => emp._id === values.assignedEmployee) || null} // Make sure you select the employee based on _id
                    getOptionLabel={(option) => option.name || ''} // Show the employee's name
                    onChange={(event, newValue) => {
                      setFieldValue('assignedEmployee', newValue ? newValue._id : ''); // Store only the _id in the field
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        placeholder="SELECT EMPLOYEE"
                        error={touched.assignedEmployee && !!errors.assignedEmployee}
                        helperText={touched.assignedEmployee && errors.assignedEmployee}
                      />
                    )}
                    fullWidth
                    size="small"
                  />


                </Grid2>

                {/* select month */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>MONTH</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={months}
                    value={values.month}
                    onChange={(event, newValue) => setFieldValue('month', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT MONTH"
                      error={touched.month && !!errors.month}
                      helperText={touched.month && errors.month}
                    />}
                    fullWidth
                    size="small"
                    onBlur={handleBlur}
                  />
                </Grid2>

                {/* select quarter */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>QUARTER</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    disablePortal
                    options={["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"]}
                    size="small"
                    value={values.quarter}
                    onChange={(event, newValue) => setFieldValue('quarter', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT QUARTER"
                      error={touched.quarter && !!errors.quarter}
                      helperText={touched.quarter && errors.quarter}
                    />}
                  />
                </Grid2>

                {/* select year */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>YEAR</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    options={years}
                    value={values.financialYear}
                    onChange={(event, newValue) => setFieldValue('financialYear', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT YEAR"
                      error={touched.financialYear && !!errors.financialYear}
                      helperText={touched.financialYear && errors.financialYear}
                    />}
                    fullWidth
                    size="small"
                    onBlur={handleBlur}
                  />
                </Grid2>

                {/* price */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>PRICE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    name="price"
                    error={touched.price && !!errors.price}
                    helperText={touched.price && errors.price}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }}
                  />
                </Grid2>{/* quantity */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>QUANTITY</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    name="quantity"
                    error={touched.quantity && !!errors.quantity}
                    helperText={touched.quantity && errors.quantity}
                    type="number"
                  />
                </Grid2>{/* discount */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>DISCOUNT</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.discount}
                    name="discount"
                    error={touched.discount && !!errors.discount}
                    helperText={touched.discount && errors.discount}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }}
                  />
                </Grid2>

                {/* Submit Button */}
                <Grid2 size={2} mt={2}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.teal[300] }}
                    fullWidth
                    type="submit"
                  // disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Grid2>
                <Modal
                  disableAutoFocus
                  open={open}
                  onClose={() => { setOpen(false) }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Box sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '220px', width: '300px', bgcolor: 'white', borderRadius: '15px', padding: '25px'
                  }}>
                    {error ? (
                      <>
                        <Cancel color="error" sx={{ height: '80px', width: '80px' }} />
                        <Typography variant="h2" fontWeight={500} color="error">Error!</Typography>
                        <Typography variant="h5" mb={1} color={colors.grey[500]}>{error}</Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircle color="success" sx={{ height: '80px', width: '80px' }} />
                        <Typography variant="h2" fontWeight={500} color="initial">Success</Typography>
                        <Typography variant="h5" mb={1} color={colors.grey[500]}>{success}</Typography>
                      </>
                    )}

                    <Button sx={{ borderRadius: 5 }} color={error ? "error" : "success"} variant="contained" fullWidth onClick={() => setOpen(false)}>
                      OK
                    </Button>

                  </Box>
                </Modal>
              </Grid2>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddWork;
