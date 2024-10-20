import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path based on your project structure

const CreateWork = () => {
  const [newWork, setNewWork] = useState({
    customer: '',
    billingName: '',
    email: '',
    mobile: '',
    pan: '',
    address: '',
    service: '',
    workType: '',
    assignedEmployee: '',
    month: '',
    quarter: '',
    financialYear: '',
    price: '',
    quantity: '',
    discount: '',
  });

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch customers and users on component mount
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

  const createWork = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await API.post('/addwork', newWork, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setNewWork({
        customer: '',
        billingName: '',
        email: '',
        mobile: '',
        pan: '',
        address: '',
        service: '',
        workType: '',
        assignedEmployee: '',
        month: '',
        quarter: '',
        financialYear: '',
        price: '',
        quantity: '',
        discount: '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create work');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWork({ ...newWork, [name]: value });
  };

  return (
    <form onSubmit={createWork}>
      <h2>Create Work</h2>
      
      <select
        name="customer"
        value={newWork.customer}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Customer</option>
        {customers.map(customer => (
          <option key={customer._id} value={customer._id}>
            {customer.customerName} (Code: {customer.customerCode})
          </option>
        ))}
      </select>

      <input
        type="text"
        name="billingName"
        placeholder="Billing Name"
        value={newWork.billingName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newWork.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={newWork.mobile}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="pan"
        placeholder="PAN"
        value={newWork.pan}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newWork.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="service"
        placeholder="Service"
        value={newWork.service}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="workType"
        placeholder="Work Type"
        value={newWork.workType}
        onChange={handleChange}
        required
      />

      <select
        name="assignedEmployee"
        value={newWork.assignedEmployee}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Assigned Employee</option>
        {employees.map(employee => (
          <option key={employee._id} value={employee._id}>
            {employee.name} (Role: {employee.role})
          </option>
        ))}
      </select>

      <input
        type="text"
        name="month"
        placeholder="Month"
        value={newWork.month}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="quarter"
        placeholder="Quarter"
        value={newWork.quarter}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="financialYear"
        placeholder="Financial Year"
        value={newWork.financialYear}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newWork.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={newWork.quantity}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="discount"
        placeholder="Discount"
        value={newWork.discount}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Work</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default CreateWork;
