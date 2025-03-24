import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid2, Modal, Select, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CheckCircle, Cancel } from '@mui/icons-material';
import { MenuItem } from "react-pro-sidebar";

const AddPayroll = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false); //for modal opening and closing
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            const employeeResponse = await API.get('/auth/allusers');
            setEmployees(employeeResponse.data.users);
        } catch (err) {
            setError('Failed to load employees');
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleFormSubmit = async (values, { resetForm }) => {
        // const token = localStorage.getItem('token');
        // try {
        //   setLoading(true);
        //   const response = await API.post('/createconsultant', values, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   });
        //   setSuccess(response.data.message || "Consultant created successfully!");
        //   setError("");
        //   resetForm();
        // } catch (err) {
        //   setError(err.response?.data?.error || 'Failed to create Consultant');
        //   setSuccess("");
        // }
        // setOpen(true);
        // setLoading(false);
    };

    return (
        <Box p={2} m="20px" height={"67vh"} overflow={"auto"}>
            <Formik
                initialValues={{
                    employees: '',
                    basicSalary: '',
                    deductions: '',
                    bonuses: '',
                    netPay: '',
                    status: '',
                }}
                validationSchema={yup.object().shape({
                    employees: yup.string().required("Employees Name is required"),
                    basicSalary: yup.string().required("Basic salary is required"),
                    deductions: yup.string().required("deductions is required"),
                    bonuses: yup.string().required("bonuses is required"),
                    netPay: yup.string().required("Net pay is required"),
                    status: yup.string().required("status is required"),
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
                    resetForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box pb={2}>
                            <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>

                                {/* employee name */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>EMPLOYEE NAME</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Autocomplete
                                        options={employees}
                                        value={employees.find(emp => emp._id === values.assignedEmployee) || null} // select the employee based on _id
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
                                {/* BASIC SALARY */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>BASIC SALARY</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER BASIC SALARY'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.basicSalary}
                                        name="basicSalary"
                                        error={!!touched.basicSalary && !!errors.basicSalary}
                                        helperText={touched.basicSalary && errors.basicSalary}
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
                                {/* DEDUCTIONS */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>DEDUCTIONS</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER DEDUCTIONS'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.deductions}
                                        name="deductions"
                                        error={!!touched.deductions && !!errors.deductions}
                                        helperText={touched.deductions && errors.deductions}
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
                                {/* BONUSES */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>BONUSES</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='BONUSES'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.bonuses}
                                        name="bonuses"
                                        error={!!touched.bonuses && !!errors.bonuses}
                                        helperText={touched.bonuses && errors.bonuses}
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
                                {/* NET PAY */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>NET PAY</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER NET PAY'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.netPay}
                                        name="netPay"
                                        error={!!touched.netPay && !!errors.netPay}
                                        helperText={touched.netPay && errors.netPay}
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
                                {/* STATUS */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>STATUS</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <Select
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            sx={{ bgcolor: colors.teal[300]}}
                                            displayEmpty
                                            name="status"
                                            value={values.status}
                                            onChange={handleChange}
                                            error={!!touched.status && !!errors.status}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Paid">Paid</MenuItem>
                                        </Select>
                                        {touched.status && errors.status && (
                                            <FormHelperText error>{errors.status}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>


                                
                                {/* submit button */}
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
        </Box >
    );
};

export default AddPayroll;
