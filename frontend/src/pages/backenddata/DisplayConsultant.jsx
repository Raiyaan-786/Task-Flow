import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Adjust the import path according to your project structure

const DisplayConsultants = () => {
  const [consultants, setConsultants] = useState([]); // State to hold the consultant data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to track error messages

  useEffect(() => {
    const fetchConsultants = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

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

        // Check if consultants data is defined and is an array
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

  if (loading) {
    return <p>Loading consultants...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  return (
    <div>
      <h1>Consultant List</h1>
      {consultants.length > 0 ? ( // Check if consultants are available
        <table border="1" cellPadding="10" cellSpacing="0">
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
                <td>{consultant.signature}</td>
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