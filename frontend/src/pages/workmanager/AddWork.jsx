import React, { useState } from 'react';
import { Autocomplete, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { mockDataManagers } from "../../data/mockData";

const AddWork = () => {
    const [customer, setCustomer] = useState('');
    const [billingName, setBillingName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [service, setService] = useState('');
    const [work, setWork] = useState('');
    const [employee, setEmployee] = useState('');
    const [month, setMonth] = useState('');
    const [quarter, setQuarter] = useState('');
    const [financialYear, setFinancialYear] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [discount, setDiscount] = useState('');
    const [open, setOpen] = useState(false);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (
        <Box>
            <Box p={'10px  0px 0px 35px'}>
                <Button variant='outlined'>Add Customer</Button>
                <Button variant='outlined'>Upload Work</Button>
            </Box>
            <Box p={2} m="20px" height={'67vh'} overflow={"auto"}>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        customer,
                        billingName,
                        email,
                        mobile,
                        pan,
                        address,
                        service,
                        work,
                        employee,
                        month,
                        quarter,
                        financialYear,
                        price,
                        quantity,
                        discount
                    }}
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
                                gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="customer"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e, value) => {
                                        setFieldValue("customer", value !== null ? value.label : "");
                                        setCustomer(value !== null ? value.label : "");
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
                                    sx={{ gridColumn: "span 3" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="billingName"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e, value) => {
                                        setFieldValue("billingName", value !== null ? value.label : "");
                                        setBillingName(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Billing Name"
                                            name="billingName"
                                            error={!!touched.billingName && !!errors.billingName}
                                            helperText={touched.billingName && errors.billingName}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 3" }}
                                />
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="email"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setEmail(e.target.value);
                                    }}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 2" }}
                                /> 
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Mobile"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setMobile(e.target.value);
                                    }}
                                    value={values.mobile}
                                    name="mobile"
                                    error={!!touched.mobile && !!errors.mobile}
                                    helperText={touched.mobile && errors.mobile}
                                    sx={{ gridColumn: "span 2" }}
                                />  
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="PAN"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setPan(e.target.value);
                                    }}
                                    value={values.pan}
                                    name="pan"
                                    error={!!touched.pan && !!errors.pan}
                                    helperText={touched.pan && errors.pan}
                                    sx={{ gridColumn: "span 2" }}
                                />  
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Address"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setAddress(e.target.value);
                                    }}
                                    value={values.address}
                                    name="address"
                                    error={!!touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                    sx={{ gridColumn: "span 6" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="service"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e, value) => {
                                        setFieldValue("service", value !== null ? value.label : "");
                                        setService(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Select Service"
                                            name="service"
                                            error={!!touched.service && !!errors.service}
                                            helperText={touched.service && errors.service}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 6" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="work"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e,value) => {
                                        setFieldValue("work", value !== null ? value.label : "");
                                        setWork(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Select Work"
                                            name="work"
                                            error={!!touched.work && !!errors.work}
                                            helperText={touched.work && errors.work}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 6" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="employee"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e,value) => {
                                        setFieldValue("employee", value !== null ? value.label : "");
                                        setEmployee(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Assign Employee"
                                            name="employee"
                                            error={!!touched.employee && !!errors.employee}
                                            helperText={touched.employee && errors.employee}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 6" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="month"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e,value) => {
                                        setFieldValue("month", value !== null ? value.label : "");
                                        setMonth(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Month"
                                            name="month"
                                            error={!!touched.month && !!errors.month}
                                            helperText={touched.month && errors.month}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="quarter"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e,value) => {
                                        setFieldValue("quarter", value !== null ? value.label : "");
                                        setQuarter(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Quarter"
                                            name="quarter"
                                            error={!!touched.quarter && !!errors.quarter}
                                            helperText={touched.quarter && errors.quarter}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <Autocomplete
                                    size='small'
                                    disablePortal
                                    options={mockDataManagers}
                                    fullWidth
                                    name="financialYear"
                                    getOptionLabel={(option) => option.label}
                                    onBlur={handleBlur}
                                    onChange={(e,value) => {
                                        setFieldValue("financialYear", value !== null ? value.label : "");
                                        setFinancialYear(value !== null ? value.label : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            {...params}
                                            label="Financial Year"
                                            name="financialYear"
                                            error={!!touched.financialYear && !!errors.financialYear}
                                            helperText={touched.financialYear && errors.financialYear}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Price"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setPrice(e.target.value);
                                    }}
                                    value={values.price}
                                    name="price"
                                    error={!!touched.price && !!errors.price}
                                    helperText={touched.price && errors.price}
                                    sx={{ gridColumn: "span 2" }}
                                /> 
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Quantity"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setQuantity(e.target.value);
                                    }}
                                    value={values.quantity}
                                    name="quantity"
                                    error={!!touched.quantity && !!errors.quantity}
                                    helperText={touched.quantity && errors.quantity}
                                    sx={{ gridColumn: "span 2" }}
                                /> 
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Discount"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setDiscount(e.target.value);
                                    }}
                                    value={values.discount}
                                    name="discount"
                                    error={!!touched.discount && !!errors.discount}
                                    helperText={touched.discount && errors.discount}
                                    sx={{ gridColumn: "span 2" }}
                                /> 
                                <Button onClick={() => setOpen(true)} sx={{ backgroundColor: "#cb3cff" }} variant="contained">
                                    Submit
                                </Button>
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Modal
                                    open={open}
                                    onClose={() => { setOpen(!open) }}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}
                                >
                                    <Box display={'flex'} flexDirection={'column'} gap={3} sx={{ height: '150px', width: "250px", bgcolor: "white", borderRadius: '8px', p: 3 }} >
                                        <Typography id="modal-modal-title" variant="h4" component="h2" textAlign={'center'}>
                                            Create a New Task ?
                                        </Typography>
                                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={4}>
                                            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                                            <Button onClick={() => { handleSubmit(); setOpen(false); }} type="submit" variant="outlined">Create</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    customer: yup.string().required("Customer is required"),
    billingName: yup.string().required("Billing Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().required("Mobile is required"),
    pan: yup.string().required("PAN is required"),
    address: yup.string().required("Address is required"),
    service: yup.string().required("Service is required"),
    work: yup.string().required("Work is required"),
    employee: yup.string().required("Employee is required"),
    month: yup.string().required("Month is required"),
    quarter: yup.string().required("Quarter is required"),
    financialYear: yup.string().required("Financial Year is required"),
    price: yup.number().required("Price is required"),
    quantity: yup.number().required("Quantity is required"),
    discount: yup.number().optional(),
});

export default AddWork;
