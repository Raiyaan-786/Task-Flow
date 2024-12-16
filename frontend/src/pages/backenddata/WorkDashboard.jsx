import React, { useEffect, useState } from 'react';
// import './WorkDashboard.css'; // Import the CSS file
import API from '../../api/api';

const WorkSummary = () => {
  const [workSummary, setWorkSummary] = useState([]);
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
      const workResponse = await API.get('/workdashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkSummary(workResponse.data);
    } catch (err) {
      console.error('Error fetching work summary:', err);
      setError('Failed to fetch work summary. Please try again later.');
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
      <h1>Work Summary</h1>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Work Type</th>
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
          {workSummary.map((item) => (
            <tr key={item.workType}>
              <td>{item.workType}</td>
              <td>{item.totalWorks}</td>
              <td>{item.worksDone}</td>
              <td>{item.assignedWork}</td>
              <td>{item.pickedUp}</td>
              <td>{item.customerVerification}</td>
              <td>{item.readyForChecking}</td>
              <td>{item.holdWork}</td>
              <td>{item.evcPending}</td>
              <td>{item.cancel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkSummary;
