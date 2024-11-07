import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const DisplayWork = () => {
  const [workItems, setWorkItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallcustomers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const customerData = response.data.customers || [];
        setCustomers(customerData);
        console.log("Fetched Customers:", customerData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers');
        console.log(err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchWorkItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallwork', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const workData = response.data.works || [];
        setWorkItems(workData);
        console.log("Fetched Work Items:", workData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch work items');
        console.log(err);
        setLoading(false);
      }
    };

    fetchWorkItems();
  }, []);

  if (loading) {
    return <p>Loading work items...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const getCustomerNameById = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    console.log("Customer ID:", customerId, "Found Customer:", customer);
    return customer ? customer.customerName : 'Unknown Customer';
  };

  return (
    <div>
      <h1>Work List</h1>
      {workItems.length > 0 ? (
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
              <th>Current Status</th>
              <th>Reminder</th>
              <th>Remark</th>
              <th>Date</th>
              <th>Modified Date</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((work) => (
              <tr key={work._id}>
                <td>{getCustomerNameById(work.customer._id) || '-'}</td>
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
                <td>{work.currentStatus || '-'}</td>
                <td>{work.reminder || 'No Reminder'}</td> {/* Display reminder */}
                <td>{work.remark || 'No Remark'}</td> {/* Display remark */}
                <td>{new Date(work.createdAt).toLocaleDateString()}</td> {/* Format created date */}
                <td>{work.updatedAt ? new Date(work.updatedAt).toLocaleDateString() : '-'}</td> {/* Format modified date */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No work items found.</p>
      )}
    </div>
  );
};

export default DisplayWork;
