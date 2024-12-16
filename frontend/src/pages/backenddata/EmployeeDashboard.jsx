import React, { useState, useEffect } from 'react';
import API from '../../api/api'; 
// import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [workSummary, setWorkSummary] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWorks, setSelectedWorks] = useState([]); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedWorkDetails, setSelectedWorkDetails] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const workResponse = await API.get('/employeedashboard');
        setWorkSummary(workResponse.data);
        
        const userResponse = await API.get('/auth/allusers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userResponse.data.users);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleWork = async (employeeId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const response = await API.get(`/employee-works/${employeeId}?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedWorks(response.data.works);
      console.log(response.data.works)
      setSelectedStatus(status); 
      setModalOpen(true); 
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch works');
      console.error('Error fetching works:', err);
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="work-summary-container">
      <table className="work-summary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Access Level</th>
            <th>Total Works</th>
            <th>Works Done</th>
            <th>Assigned Work</th>
            <th>Picked Up</th>
            <th>Customer Verification</th>
            <th>Ready for Checking</th>
            <th>Hold Work</th>
            <th>EVC Pending</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {workSummary.map((work) => {
            const user = users.find((u) => u._id === work._id);
            return (
              <tr key={work._id}>
                <td>
                  <div className="user-info">
                    <img src={user?.avatar || '/default-avatar.png'} alt={user?.name} className="avatar" />
                    <span>{user?.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`role ${user?.role.toLowerCase()}`}>
                    {user?.role}
                  </span>
                </td>
                <td onClick={() => handleWork(user._id, 'Total Works')}>{work.workCounts.total}</td>
                <td onClick={() => handleWork(user._id, 'Completed')}>{work.workCounts.done}</td>
                <td onClick={() => handleWork(user._id, 'Assigned')}>{work.workCounts.assigned}</td>
                <td onClick={() => handleWork(user._id, 'Picked Up')}>{work.workCounts.pickedUp}</td>
                <td onClick={() => handleWork(user._id, 'Customer Verification')}>{work.workCounts.customerVerification}</td>
                <td onClick={() => handleWork(work._id, 'Ready for Checking')}>{work.workCounts.readyForChecking}</td>
                <td onClick={() => handleWork(work._id, 'Hold Work')}>{work.workCounts.holdWork}</td>
                <td onClick={() => handleWork(work._id, 'EVC Pending')}>{work.workCounts.evcPending}</td>
                <td onClick={() => handleWork(work._id, 'Cancel')}>{work.workCounts.cancel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;
