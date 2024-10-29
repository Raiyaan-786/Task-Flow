import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust this import based on your API setup

const UpdateCustomerGroup = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editGroupId, setEditGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await API.get('/allgroups', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
          },
        });
        setGroups(response.data.groups);
      } catch (err) {
        setError("An error occurred while fetching groups.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleUpdateGroupName = async (groupId) => {
    if (!newGroupName) {
      alert("Please enter a new group name.");
      return;
    }

    try {
      await API.put(`/group/${groupId}`, { groupName: newGroupName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
        },
      });
      setGroups(groups.map(group => 
        group._id === groupId ? { ...group, groupName: newGroupName } : group
      ));
      setNewGroupName('');
      setEditGroupId(null);
      alert("Group name updated successfully!");
    } catch (err) {
      setError("An error occurred while updating the group name.");
      console.error(err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await API.delete(`/deletegroup/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
          },
        });
        setGroups(groups.filter(group => group._id !== groupId));
        alert("Group deleted successfully!");
      } catch (err) {
        setError("An error occurred while deleting the group.");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>All Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            <span>{group.groupName}</span>
            {editGroupId === group._id ? (
              <div>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="New Group Name"
                />
                <button onClick={() => handleUpdateGroupName(group._id)}>Update</button>
                <button onClick={() => setEditGroupId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => { setEditGroupId(group._id); setNewGroupName(group.groupName); }}>
                  Edit Name
                </button>
                <button onClick={() => handleDeleteGroup(group._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateCustomerGroup;
