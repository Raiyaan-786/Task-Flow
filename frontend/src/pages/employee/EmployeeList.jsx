import React, { useEffect, useState } from 'react'
import API from '../../api/api'; 
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/allusers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployees(response.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        console.log(err);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  console.log(employees)
  return (
    <div>EmployeeList</div>
  )
}

export default EmployeeList