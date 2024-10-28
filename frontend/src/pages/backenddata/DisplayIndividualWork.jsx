import React, { useEffect, useState } from 'react';
import {
  fetchTotalWorks,
  fetchCompletedWorks,
  fetchAssignedWorks,
  fetchUnassignedWorks,
  fetchHoldWorks,
  fetchCanceledWorks,
  fetchAllEmployees,
} from './IndividualWork'; 

const DisplayIndividualWork = () => {
  const [works, setWorks] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workType, setWorkType] = useState(''); 

  const fetchWorks = async (fetchFunction) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    setLoading(true);

    try {
      const workData = await fetchFunction(token);
      console.log('Fetched Work Data:', workData); 
      setWorks(workData); 
      setWorkType(fetchFunction.name.replace('fetch', '').replace('Works', '')); 
    } catch (err) {
      console.error('Error fetching work data:', err);
      setError('Failed to fetch work data. Please try again later.');
    } finally {
      setLoading(false); 
    }
  };

  const fetchEmployeesData = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    try {
      const employeeData = await fetchAllEmployees(token); 
      console.log('Fetched Employees:', employeeData);
      setEmployees(employeeData); 
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employee data. Please try again later.');
    }
  };

  const getEmployeeName = (employeeId) => {
    console.log('Fetching name for Employee ID:', employeeId); 
    if (!employeeId) return 'Not Assigned'; 
    if (!Array.isArray(employees)) return 'Not Assigned'; 
    const employee = employees.find(emp => emp._id === employeeId);
    console.log('Found Employee:', employee); 
    return employee ? employee.name : 'Not Assigned'; 
  };

  const renderTable = () => (
    <table className="works-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Billing Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>PAN</th>
          <th>Address</th>
          <th>Service</th>
          <th>Work Type</th>
          <th>Assigned Employee</th>
          <th>Month</th>
          <th>Quarter</th>
          <th>Financial Year</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Discount</th>
          <th>Current Status</th>
        </tr>
      </thead>
      <tbody>
        {works.map((work) => (
          <tr key={work._id}>
            <td>{work.customer ? work.customer.customerName : 'N/A'}</td> 
            <td>{work.billingName || 'N/A'}</td> 
            <td>{work.email || 'N/A'}</td> 
            <td>{work.mobile || 'N/A'}</td> 
            <td>{work.pan || 'N/A'}</td> 
            <td>{work.address || 'N/A'}</td> 
            <td>{work.service || 'N/A'}</td> 
            <td>{work.workType || 'N/A'}</td> 
            <td>{getEmployeeName(work.assignedEmployee)}</td> 
            <td>{work.month || 'N/A'}</td> 
            <td>{work.quarter || 'N/A'}</td> 
            <td>{work.financialYear || 'N/A'}</td> 
            <td>{work.price || 'N/A'}</td> 
            <td>{work.quantity || 'N/A'}</td> 
            <td>{work.discount || 'N/A'}</td> 
            <td>{work.currentStatus || 'N/A'}</td> 
          </tr>
        ))}
      </tbody>
    </table>
  );

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="work-statistics-container">
      <h1>Work Statistics</h1>

      <div className="buttons-container">
        <button onClick={() => fetchWorks(fetchTotalWorks)}>Total Works</button>
        <button onClick={() => fetchWorks(fetchCompletedWorks)}>Completed Works</button>
        <button onClick={() => fetchWorks(fetchAssignedWorks)}>Assigned Works</button>
        <button onClick={() => fetchWorks(fetchUnassignedWorks)}>Unassigned Works</button>
        <button onClick={() => fetchWorks(fetchHoldWorks)}>Hold Works</button>
        <button onClick={() => fetchWorks(fetchCanceledWorks)}>Canceled Works</button>
      </div>

      {workType && <h2>{workType.charAt(0).toUpperCase() + workType.slice(1)} Works</h2>}
      {works.length > 0 && renderTable()}
    </div>
  );
};

export default DisplayIndividualWork;
