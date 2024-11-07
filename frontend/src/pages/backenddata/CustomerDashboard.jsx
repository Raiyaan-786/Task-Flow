import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const CustomerSummary = () => {
  const [customerSummary, setCustomerSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.get('/customerdashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerSummary(response.data);
    } catch (err) {
      console.error('Error fetching customer summary:', err);
      setError('Failed to fetch customer summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Customer Summary</h1>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer Code</th>
            <th>Total Works</th>
            <th>Works Done</th>
            <th>Assigned Work</th>
            <th>Picked Up</th>
            <th>Customer Verification</th>
            <th>Ready for Checking</th>
            <th>Hold Work</th>
            <th>EVC Pending</th>
            <th>Cancelled</th>
          </tr>
        </thead>
        <tbody>
          {customerSummary.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.customerName}</td>
              <td>{customer.customerCode}</td>
              <td>{customer.workCounts?.total || 0}</td>
              <td>{customer.workCounts?.done || 0}</td>
              <td>{customer.workCounts?.assigned || 0}</td>
              <td>{customer.workCounts?.pickedUp || 0}</td>
              <td>{customer.workCounts?.customerVerification || 0}</td>
              <td>{customer.workCounts?.readyForChecking || 0}</td>
              <td>{customer.workCounts?.holdWork || 0}</td>
              <td>{customer.workCounts?.evcPending || 0}</td>
              <td>{customer.workCounts?.cancel || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSummary;
