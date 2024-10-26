import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure

const DisplayWork = () => {
  const [workItems, setWorkItems] = useState([]); // State to hold work data
  const [customers, setCustomers] = useState([]); // State to hold customer data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to track error messages

  // Fetch customers on component mount
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
        
        const customerData = response.data.customers || []; // Fallback to empty array
        setCustomers(customerData); // Set the customers state
        console.log("Fetched Customers:", customerData); // Log fetched customers
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers'); // Handle error
        console.log(err);
      }
    };

    fetchCustomers(); // Fetch customers on component mount
  }, []);

  // Fetch work items on component mount
  useEffect(() => {
    const fetchWorkItems = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallwork', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });

        const workData = response.data.works || []; // Fallback to empty array
        setWorkItems(workData); // Set the work state
        console.log("Fetched Work Items:", workData); // Log fetched work items
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch work items'); // Handle error
        console.log(err);
        setLoading(false); // Set loading to false
      }
    };

    fetchWorkItems(); // Fetch work items on component mount
  }, []);

  if (loading) {
    return <p>Loading work items...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  // Function to get customer name by ID
  const getCustomerNameById = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    console.log("Customer ID:", customerId, "Found Customer:", customer); // Log the search process
    return customer ? customer.customerName : 'Unknown Customer'; // Return customer name or fallback
  };
  
  return (
    <div>
      <h1>Work List</h1>
      {workItems.length > 0 ? ( // Check if work items are available
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Assigned Employee</th>
              <th>Employee Email</th>
              <th>Service</th>
              <th>Work Type</th>
              <th>Month</th>
              <th>Quarter</th>
              <th>Financial Year</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Current Status</th> {/* Added Current Status column */}
            </tr>
          </thead>
          <tbody>
            {workItems.map((work) => (
              <tr key={work._id}>
                <td>{getCustomerNameById(work.customer._id) || '-'}</td> {/* Fetching customer name */}
                <td>{work.customer?.email || '-'}</td>
                <td>{work.assignedEmployee?.name || '-'}</td>
                <td>{work.assignedEmployee?.email || '-'}</td>
                <td>{work.service}</td>
                <td>{work.workType}</td>
                <td>{work.month}</td>
                <td>{work.quarter}</td>
                <td>{work.financialYear}</td>
                <td>{work.price}</td>
                <td>{work.quantity}</td>
                <td>{work.discount}</td>
                <td>{work.currentStatus || '-'}</td> {/* Display current status */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No work items found.</p> // Message if no work items are available
      )}
    </div>
  );
};

export default DisplayWork;
