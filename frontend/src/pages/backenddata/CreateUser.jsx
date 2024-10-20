import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, Grid2, MenuItem, Select, InputLabel } from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";
import API from '../../api/api';

const AddEmployee = () => {
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    role: '',
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Create user function (formerly createUser)
  const createUser = async (values) => {
    const token = localStorage.getItem('token');

    try {
      const response = await API.post('/auth/users', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setNewUser({
        name: '',
        username: '',
        email: '',
        password: '',
        mobile: '',
        address: '',
        role: '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      setSuccess('');
    }
  };

  // Form submission handler
  const handleFormSubmit = (values, { resetForm }) => {
    createUser(values);
    resetForm();  // Reset the form after submission
  };

  return (
    <Box p={2} m="20px" height={'67vh'} overflow={'auto'}>
      <Formik
        initialValues={newUser}
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
              <Grid2 container spacing={2}>
                {/* Employee Name */}
                <Grid2 size={4}>
                  <label>Employee Name</label>
                </Grid2>
                <Grid2 size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid2>

                {/* Username */}
                <Grid2 size={4}>
                  <label>Username</label>
                </Grid2>
                <Grid2 size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                  />
                </Grid2>

                {/* Password */}
                <Grid2 size={4}>
                  <label>Password</label>
                </Grid2>
                <Grid2 size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
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
                    onChange={handleChange}
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

                {/* Assign Role */}
                <Grid2 size={4}>
                  <label>Assign Role</label>
                </Grid2>
                <Grid2 size={8}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      label="Role"
                      error={!!touched.role && !!errors.role}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Employee">Employee</MenuItem>
                    </Select>
                  </FormControl>
                  {touched.role && errors.role && (
                    <Box color="error.main" fontSize="0.75rem">{errors.role}</Box>
                  )}
                </Grid2>

                {/* Submit Button */}
                <Grid2 size={12}>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Box>
                </Grid2>
                {/* Success and Error Messages */}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </Grid2>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Yup validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Employee Name is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup.string().matches(/^[0-9]*$/, "Mobile No must be a number").required("Mobile No is required"),
  address: yup.string().required("Address is required"),
  role: yup.string().required("Assign Role is required"),
});

export default AddEmployee;
