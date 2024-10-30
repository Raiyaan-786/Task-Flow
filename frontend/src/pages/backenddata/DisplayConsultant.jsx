import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure
import './DiplayConsultant.css'; // Import the CSS file

const DisplayConsultants = () => {
  const [consultants, setConsultants] = useState([]); // State to hold the consultant data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to track error messages

  useEffect(() => {
    const fetchConsultants = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallconsultants', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });

        const consultantsData = response.data.consultants || []; // Fallback to empty array
        setConsultants(consultantsData); // Set the consultants state
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch consultants'); // Handle error
        console.log(err);
        setLoading(false); // Set loading to false
      }
    };

    fetchConsultants(); // Fetch consultants on component mount
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!window.confirm('Are you sure you want to delete this consultant?')) {
      return; // Exit if the user cancels the deletion
    }

    try {
      await API.delete(`/consultant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
        },
      });

      // Remove deleted consultant from the state
      setConsultants(consultants.filter(consultant => consultant._id !== id));
      alert('Consultant deleted successfully!'); // Show success message
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete consultant'); // Handle error
    }
  };

  const handleUpdate = (consultant) => {
    console.log('Update consultant:', consultant); // Replace this with your update logic
  };

  if (loading) {
    return <p className="loading">Loading consultants...</p>; // Show loading message
  }

  if (error) {
    return <p className="error">Error: {error}</p>; // Show error message
  }

  return (
    <div className="container">
      <h1>Consultant List</h1>
      {consultants.length > 0 ? ( // Check if consultants are available
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Username</th>
              <th>Bank Account Number</th>
              <th>Bank IFSC Code</th>
              <th>Account Holder Name</th>
              <th>Signature</th>
              <th>Actions</th> {/* Ensure Actions column is here */}
            </tr>
          </thead>
          <tbody>
            {consultants.map((consultant) => (
              <tr key={consultant._id}>
                <td>{consultant.consultantName}</td>
                <td>{consultant.email}</td>
                <td>{consultant.mobile}</td>
                <td>{consultant.address}</td>
                <td>{consultant.username}</td>
                <td>{consultant.bankAccountNumber}</td>
                <td>{consultant.bankIFSCCode}</td>
                <td>{consultant.accountHolderName}</td>
                <td>
                  {consultant.signature ? (
                    <img
                      src={consultant.signature}
                      alt="Signature"
                      style={{ width: '50px', height: 'auto', borderRadius: '5px' }} // Small picture style
                    />
                  ) : (
                    <span>No signature available</span>
                  )}
                </td>
                <td className="actions">
                  <button onClick={() => handleUpdate(consultant)}>Update</button> {/* Update button */}
                  <button onClick={() => handleDelete(consultant._id)}>Delete</button> {/* Delete button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No consultants found.</p> // Message if no consultants are available
      )}
    </div>
  );
};

export default DisplayConsultants;
