import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const CustomerGroupSummary = () => {
  const [customerGroupSummary, setCustomerGroupSummary] = useState([]);
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
      const response = await API.get('/customerdashboardbygroup', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerGroupSummary(response.data);
    } catch (err) {
      console.error('Error fetching customer group summary:', err);
      setError('Failed to fetch customer group summary. Please try again later.');
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
      <h1>Customer Group Summary</h1>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Total Works</th>
            <th>Works Done</th>
            <th>Assigned Works</th>
            <th>Picked Up Works</th>
            <th>Customer Verification Works</th>
            <th>Ready for Checking Works</th>
            <th>Hold Works</th>
            <th>EVC Pending Works</th>
            <th>Cancelled Works</th>
          </tr>
        </thead>
        <tbody>
          {customerGroupSummary.map((group) => (
            <tr key={group._id}>
              <td>{group.groupName}</td>
              <td>{group.totalWorks}</td>
              <td>{group.worksDone}</td>
              <td>{group.assignedWorks}</td>
              <td>{group.pickedUpWorks}</td>
              <td>{group.customerVerificationWorks}</td>
              <td>{group.readyForCheckingWorks}</td>
              <td>{group.holdWorks}</td>
              <td>{group.evcPendingWorks}</td>
              <td>{group.cancelledWorks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerGroupSummary;
