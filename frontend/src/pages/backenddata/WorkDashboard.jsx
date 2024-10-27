import React, { useState, useEffect } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure


const WorkSummary = () => {
  const [workSummary, setWorkSummary] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch work summary data
        const workResponse = await API.get('/workdashboard');
        setWorkSummary(workResponse.data);

        // Fetch users data
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
                <td>{work.workCounts.total}</td>
                <td>{work.workCounts.done}</td>
                <td>{work.workCounts.assigned}</td>
                <td>{work.workCounts.pickedUp}</td>
                <td>{work.workCounts.customerVerification}</td>
                <td>{work.workCounts.readyForChecking}</td>
                <td>{work.workCounts.holdWork}</td>
                <td>{work.workCounts.evcPending}</td>
                <td>{work.workCounts.cancel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WorkSummary;
