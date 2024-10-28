import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const TurnoverCreation = () => {
  const [formData, setFormData] = useState({
    customer: '',
    companyName: '',
    name: '',
    code: '',
    pan: '',
    address: '',
    types: '',
    financialYear: '',
    turnover: '',
    status: '',
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await API.post('/createturnover', formData, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setSuccess('Turnover created successfully!');
      setFormData({
        customer: '',
        companyName: '',
        name: '',
        code: '',
        pan: '',
        address: '',
        types: '',
        financialYear: '',
        turnover: '',
        status: '',
      });
    } catch (err) {
      console.error('Error creating turnover:', err);
      setError('Failed to create turnover. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(); 
  }, []);

  return (
    <div className="turnover-creation-container">
      <h1>Create Turnover Entry</h1>
      <form onSubmit={handleSubmit} className="turnover-form">
        <select
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.companyName} ({customer.customerName})
            </option>
          ))}
        </select>
        <input
          type="text"
          name="companyName"
          placeholder="Company/Firm Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="pan"
          placeholder="PAN"
          value={formData.pan}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="types"
          placeholder="Types"
          value={formData.types}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="financialYear"
          placeholder="Financial Year"
          value={formData.financialYear}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="turnover"
          placeholder="Turnover"
          value={formData.turnover}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Turnover'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default TurnoverCreation;
