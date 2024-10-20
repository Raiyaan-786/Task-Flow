import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure

const DisplayCustomers = () => {
  const [customers, setCustomers] = useState([]); // State to hold the customer data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to track error messages

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallcustomers', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });

        // Check if customers data is defined and is an array
        const customersData = response.data.customers || []; // Fallback to empty array
        setCustomers(customersData); // Set the customers state
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers'); // Handle error
        console.log(err);
        setLoading(false); // Set loading to false
      }
    };

    fetchCustomers(); // Fetch customers on component mount
  }, []);

  if (loading) {
    return <p>Loading customers...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  return (
    <div>
      <h1>Customer List</h1>
      {customers.length > 0 ? ( // Check if customers are available
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th>Billing Name</th>
              <th>Company/Firm Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>WhatsApp No</th>
              <th>PAN</th>
              <th>Address</th>
              <th>Contact Person</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.customerName}</td>
                <td>{customer.customerCode}</td>
                <td>{customer.billingName}</td>
                <td>{customer.companyName || '-'}</td>
                <td>{customer.email}</td>
                <td>{customer.mobileNo}</td>
                <td>{customer.whatsappNo || '-'}</td>
                <td>{customer.PAN}</td>
                <td>{customer.address}</td>
                <td>{customer.contactPerson || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p> // Message if no customers are available
      )}
    </div>
  );
};

export default DisplayCustomers;
