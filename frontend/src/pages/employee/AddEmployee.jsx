import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, Typography, Grid2, MenuItem, Select, InputLabel, Modal, Autocomplete } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import API from '../../api/api';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CheckCircle, Cancel } from '@mui/icons-material';

const AddEmployee = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [departmentList] = useState([
        "department1", "department2", "department3"
    ])
    const [postnameList] = useState([
        "post1", "post2", "post3"
    ]);
    const handleFormSubmit = async (values, { resetForm }) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await API.post('/auth/users', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess(response.data.message || "Customer created successfully!");
            setError('');
            resetForm();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
            setSuccess('');
        }
        setLoading(false);
        setOpen(true);
    };
    return (
        <Box p={2} m="20px" height="67vh" overflow="auto">
            <Formik
                initialValues={{
                    empname: '',
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    address: '',
                    role: '',
                    department: '',
                    postname: '',
                    dateofjoining: '',
                }}
                validationSchema={yup.object().shape({
                    empname: yup.string().required("Employee Name is required"),
                    username: yup.string().required("Username is required"),
                    email: yup.string().email("Invalid email").required("Email is required"),
                    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
                    mobile: yup.string().required("Mobile No is required"),
                    address: yup.string().required("Address is required"),
                    role: yup.string().required("Assign Role is required"),
                    department: yup.string().required("Department is required"),
                    postname: yup.string().required("Post Name is required"),
                    dateofjoining: yup.date().required("Date of Joining is required"),
                })}
                onSubmit={(values, { resetForm }) => {
                    const payload = {
                        ...values,
                        name: values.empname, // Map 'empname' to 'name'
                    };
                    delete payload.empname; // Remove 'empname'
                    handleFormSubmit(payload, { resetForm });
                }}
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
                    <form onSubmit={handleSubmit} >
                        <Box pb={2}>
                            <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                                {/* Employee Name */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>EMPLOYEE NAME</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER EMPLOYEE NAME'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.empname}
                                        name="empname"
                                        error={!!touched.empname && !!errors.empname}
                                        helperText={touched.empname && errors.empname}
                                    // autoComplete="name"
                                    />
                                </Grid2>
                                {/* Username */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>USERNAME</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER USERNAME'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.username}
                                        name="username"
                                        error={!!touched.username && !!errors.username}
                                        helperText={touched.username && errors.username}
                                        autoComplete="new-username"
                                    />
                                </Grid2>
                                {/* Password */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>PASSWORD</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        placeholder='ENTER PASSWORD'
                                        size="small"
                                        fullWidth
                                        variant="filled"
                                        type="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                        autoComplete="new-password" // Prevents autofill
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
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid2>
                                {/* Mobile No */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>MOBILE NUMBER</label>
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
                                        type="number"
                                        sx={{
                                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                display: 'none'
                                            },
                                            '& input[type=number]': {
                                                MozAppearance: 'textfield'
                                            },
                                        }
                                        }
                                        error={!!touched.mobile && !!errors.mobile}
                                        helperText={touched.mobile && errors.mobile}
                                    />
                                </Grid2>

                                {/* Address */}
                                <Grid2 size={6}>
                                    <label>ADDRESS</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        size="small"
                                        multiline
                                        minRows={3}
                                        maxRows={3}
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
                                    />
                                </Grid2>
                                {/* department */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>SELECT DEPARTMENT</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Autocomplete
                                        options={departmentList}
                                        value={values.department}
                                        onChange={(event, newValue) => setFieldValue('department', newValue)}
                                        renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT DEPARTMENT"
                                            error={touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                        />}
                                        fullWidth
                                        size="small"
                                        onBlur={handleBlur}
                                    />
                                </Grid2>
                                {/* postname */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>SELECT POST</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Autocomplete
                                        options={postnameList}
                                        value={values.postname}
                                        onChange={(event, newValue) => setFieldValue('postname', newValue)}
                                        renderInput={(params) => <TextField variant="filled" {...params} placeholder="SELECT POST"
                                            error={touched.postname && !!errors.postname}
                                            helperText={touched.postname && errors.postname}
                                        />}
                                        fullWidth
                                        size="small"
                                        onBlur={handleBlur}
                                    />
                                </Grid2>
                                  {/* date of joining*/}
                                  <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>DATE OF JOINING</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        size="small"
                                        type='date'
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.dateofjoining}
                                        name="dateofjoining"
                                        error={!!touched.dateofjoining && !!errors.dateofjoining}
                                        helperText={touched.dateofjoining && errors.dateofjoining}
                                    />
                                </Grid2>
                                {/* Assign Role */}
                                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                    <label>ASSIGN ROLE</label>
                                </Grid2>
                                <Grid2 size={6}>
                                    <FormControl fullWidth size="small" variant='filled'>
                                        <InputLabel><em>ROLE</em></InputLabel>
                                        <Select
                                            name="role"
                                            value={values.role}
                                            onChange={handleChange}
                                            label="role"
                                            error={!!touched.role && !!errors.role}
                                        >
                                            <MenuItem value="Admin">ADMIN</MenuItem>
                                            <MenuItem value="Manager">MANAGER</MenuItem>
                                            <MenuItem value="Employee">EMPLOYEE</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {touched.role && errors.role && (
                                        <Box color="error.main" fontSize="0.75rem">{errors.role}</Box>
                                    )}
                                </Grid2>
                              
                                {/* Submit Button */}
                                <Grid2 size={2} mt={2}>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: colors.blueHighlight[900] }}
                                        fullWidth
                                        type="submit"
                                        disabled={loading}
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
                                        height: '220px', width: '300px', bgcolor:colors.bgc[200], borderRadius: '15px', padding: '25px'
                                    }}>
                                        {error ? (
                                            <>
                                                <Cancel color="error" sx={{ height: '80px', width: '80px' }} />
                                                <Typography variant="h2" fontWeight={500} color="error">Error!</Typography>
                                                <Typography variant="h5" mb={1} color={colors.grey[500]}>{error}</Typography>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle color="#11b823" sx={{ height: '80px', width: '80px',color:"#11b823" }} />
                                                <Typography variant="h2" fontWeight={500} color="initial">Success</Typography>
                                                <Typography variant="h5" mb={1} color={colors.grey[500]}>{success}</Typography>
                                            </>
                                        )}

                                        <Button sx={{ borderRadius: 5,bgcolor:error?"error":"#11b823" }}  variant="contained" fullWidth onClick={() => setOpen(false)}>
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

export default AddEmployee;
