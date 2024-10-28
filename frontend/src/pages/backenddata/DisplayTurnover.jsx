import React, { useState, useEffect } from 'react';
import './DisplayTurnover.css'; 
import API from '../../api/api';

const DisplayTurnover = () => {
  const [turnovers, setTurnovers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTurnovers = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.get('/getallturnovers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response:', response.data);
      if (response.data.turnovers) {
        setTurnovers(response.data.turnovers);
      } else {
        setError('No turnover data found.');
      }
    } catch (err) {
      console.error('Error fetching turnovers:', err);
      setError('Failed to fetch turnover data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnovers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="turnover-display-container">
      <h1>Turnover Entries</h1>
      <table className="turnover-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Company/Firm Name</th>
            <th>Name</th>
            <th>Code</th>
            <th>PAN</th>
            <th>Address</th>
            <th>Types</th>
            <th>Financial Year</th>
            <th>Turnover</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {turnovers.map((turnover) => (
            <tr key={turnover._id}>
              <td>{turnover.customer.customerName}</td> 
              <td>{turnover.companyName}</td>
              <td>{turnover.name}</td>
              <td>{turnover.code}</td>
              <td>{turnover.pan}</td>
              <td>{turnover.address}</td>
              <td>{turnover.types}</td>
              <td>{turnover.financialYear}</td>
              <td>{turnover.turnover}</td>
              <td>{turnover.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayTurnover;
