import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure

const CustomerList = () => {
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
  console.log(customers)
  return (
    <div>
      <h1>Customer List</h1>
    </div>
  );
};

export default CustomerList;
