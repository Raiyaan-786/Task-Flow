import React, { useEffect, useState } from 'react';
import API from '../../api/api'; 
import { Avatar } from '@mui/material';  // Import MUI Avatar component
import PeopleIcon from '@mui/icons-material/People';  // Import MUI People icon

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
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

        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        console.log(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>User List</h1>
      {users.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Role</th>
              <th>Password</th> {/* New column for password */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.image ? (
                    <Avatar src={`data:image/jpeg;base64,${user.image}`} alt={user.name} />
                  ) : (
                    <Avatar>
                      <PeopleIcon />
                    </Avatar>
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.password}</td> {/* Display password (Not recommended for production) */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default DisplayUsers;
