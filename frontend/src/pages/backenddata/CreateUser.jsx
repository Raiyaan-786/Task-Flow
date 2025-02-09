import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import API from '../../api/api';

const AddEmployee = () => {
  const [formData, setFormData] = useState(new FormData());
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      formData.set(name, files[0]);
    } else {
      formData.set(name, value);
    }
    setFormData(new FormData(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await API.post('/auth/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      setSuccess('');
    }
  };

  return (
    <Box p={2} m="20px" height={'67vh'} overflow={'auto'}>
      <form onSubmit={handleSubmit}>
        <Box pt={1}>
          <TextField fullWidth label="Employee Name" size="small" name="name" onChange={handleChange} required />
          <TextField fullWidth label="Username" size="small" name="username" onChange={handleChange} required />
          <TextField fullWidth label="Password" size="small" name="password" type="password" onChange={handleChange} required />
          <TextField fullWidth label="Email" size="small" name="email" type="email" onChange={handleChange} required />
          <TextField fullWidth label="Mobile" size="small" name="mobile" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handleChange} required />
          <TextField fullWidth label="Address" size="small" name="address" onChange={handleChange} required />
          <TextField fullWidth label="Department" size="small" name="department" onChange={handleChange} />
          <TextField fullWidth label="Post Name" size="small" name="postname" onChange={handleChange} />
          <TextField fullWidth label="Salary" size="small" name="salary" type="number" onChange={handleChange} />
          <TextField fullWidth label="Date of Joining" size="small" name="dateofjoining" type="date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select name="role" onChange={handleChange} required>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select name="status" onChange={handleChange} required>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Block">Block</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Mute">Mute</MenuItem>
            </Select>
          </FormControl>
          
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" variant="contained">Submit</Button>
          </Box>
          
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Box>
      </form>
    </Box>
  );
};

export default AddEmployee;