import React, { useEffect, useState } from 'react';
import API from '../../api/api'; 
// import './DiplayConsultant.css'; 

const DisplayConsultants = () => {
  const [consultants, setConsultants] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

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
            Authorization: `Bearer ${token}`, 
          },
        });
        const consultantsData = response.data.consultants || []; 
        setConsultants(consultantsData); 
        setLoading(false); 
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch consultants'); 
        setLoading(false); 
      }
    };
    fetchConsultants(); 
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); 

    if (!window.confirm('Are you sure you want to delete this consultant?')) {
      return; 
    }
    try {
      await API.delete(`/consultant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setConsultants(consultants.filter(consultant => consultant._id !== id));
      alert('Consultant deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete consultant'); 
    }
  };

  const handleUpdate = (consultant) => {
    console.log('Update consultant:', consultant); 
  };

  const displaySignature = (signatureBase64) => {
    if (signatureBase64) {
      return (
        <img
          src={`data:image/png;base64,${signatureBase64}`}
          alt="Consultant Signature"
          style={{ width: '50px', height: 'auto', borderRadius: '5px' }} 
        />
      );
    }
    return <span>No signature available</span>;
  };

  if (loading) {
    return <p className="loading">Loading consultants...</p>; 
  }
  if (error) {
    return <p className="error">Error: {error}</p>; 
  }

  return (
    <div className="container">
      <h1>Consultant List</h1>
      {consultants.length > 0 ? ( 
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
              <th>Actions</th>
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
                <td>{displaySignature(consultant.signature)}</td> 
                <td className="actions">
                  <button onClick={() => handleUpdate(consultant)}>Update</button>
                  <button onClick={() => handleDelete(consultant._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No consultants found.</p>
      )}
    </div>
  );
};

export default DisplayConsultants;
