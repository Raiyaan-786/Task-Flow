import React, { useEffect, useState } from 'react';
import API from '../../api/api'; 
import { Avatar } from '@mui/material';  
import PeopleIcon from '@mui/icons-material/People';  
import { Button } from '@mui/material';  

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
        // const response = await API.get('/auth/muteusers', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        setUsers(response.data.users);
        console.log(response.data.users)
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        console.log(err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
      console.log(err);
    }
  };
  
  const handleUpdate = (userId) => {
    console.log('Update user with id:', userId);
  };
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
              <th>Status</th>
              <th>Password</th>
              <th>Actions</th> 
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
                <td>{user.status}</td>
                <td>{user.password}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(user._id)}
                    style={{ marginRight: '10px' }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
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
