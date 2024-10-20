import React, { useState } from 'react';
import API from '../../api/api'; // Adjust the import path based on your project structure

const CreateCustomer = () => {
  const [newCustomer, setNewCustomer] = useState({
    customerName: '',
    customerCode: '',
    billingName: '',
    companyName: '',
    email: '',
    mobileNo: '',
    whatsappNo: '',
    sameAsMobileNo: false,
    PAN: '',
    address: '',
    contactPerson: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createCustomer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await API.post('/createcustomer', newCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setNewCustomer({
        customerName: '',
        customerCode: '',
        billingName: '',
        companyName: '',
        email: '',
        mobileNo: '',
        whatsappNo: '',
        sameAsMobileNo: false,
        PAN: '',
        address: '',
        contactPerson: '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create customer');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <form onSubmit={createCustomer}>
      <h2>Create Customer</h2>
      <input
        type="text"
        name="customerName"
        placeholder="Customer Name"
        value={newCustomer.customerName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="customerCode"
        placeholder="Customer Code"
        value={newCustomer.customerCode}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="billingName"
        placeholder="Billing Name"
        value={newCustomer.billingName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="companyName"
        placeholder="Company/Firm Name"
        value={newCustomer.companyName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newCustomer.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobileNo"
        placeholder="Mobile No"
        value={newCustomer.mobileNo}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="whatsappNo"
        placeholder="WhatsApp No"
        value={newCustomer.whatsappNo}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="sameAsMobileNo"
          checked={newCustomer.sameAsMobileNo}
          onChange={handleChange}
        />
        Same as Mobile No
      </label>
      <input
        type="text"
        name="PAN"
        placeholder="PAN"
        value={newCustomer.PAN}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newCustomer.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contactPerson"
        placeholder="Contact Person"
        value={newCustomer.contactPerson}
        onChange={handleChange}
      />
      <button type="submit">Create Customer</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default CreateCustomer;
