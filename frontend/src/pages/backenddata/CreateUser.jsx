import React, { useState } from 'react';
import API from '../../api/api';

const CreateUser = () => {
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    role: '', // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await API.post('/auth/users', newUser, {
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
        role: '', // Reset to default role
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  return (
    <form onSubmit={createUser}>
      <h2>Create User</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newUser.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={newUser.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newUser.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={newUser.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={newUser.mobile}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newUser.address}
        onChange={handleChange}
        required
      />
      <select name="role" value={newUser.role} onChange={handleChange}>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
      </select>
      <button type="submit">Create User</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default CreateUser