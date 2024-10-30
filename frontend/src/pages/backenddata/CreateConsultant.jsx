import React, { useState } from 'react';
import API from '../../api/api'; 

const CreateConsultant = () => {
  const [newConsultant, setNewConsultant] = useState({
    consultantName: '',
    email: '',
    mobile: '',
    address: '',
    username: '',
    bankAccountNumber: '',
    bankIFSCCode: '',
    accountHolderName: '',
  });
  const [signatureFile, setSignatureFile] = useState(null); // State to hold the file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createConsultant = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData(); // Create FormData object

    // Append consultant details to formData
    for (const key in newConsultant) {
      formData.append(key, newConsultant[key]);
    }

    // Append the signature file to formData
    if (signatureFile) {
      formData.append('signature', signatureFile);
    }

    try {
      const response = await API.post('/createconsultant', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setNewConsultant({
        consultantName: '',
        email: '',
        mobile: '',
        address: '',
        username: '',
        bankAccountNumber: '',
        bankIFSCCode: '',
        accountHolderName: '',
      });
      setSignatureFile(null); // Reset signature file
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create consultant');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConsultant({ ...newConsultant, [name]: value });
  };

  const handleFileChange = (e) => {
    setSignatureFile(e.target.files[0]); // Set the selected file
  };

  return (
    <form onSubmit={createConsultant}>
      <h2>Create Consultant Data</h2>
      <input
        type="text"
        name="consultantName"
        placeholder="Consultant Name"
        value={newConsultant.consultantName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newConsultant.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={newConsultant.mobile}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newConsultant.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={newConsultant.username}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="bankAccountNumber"
        placeholder="Bank Account Number"
        value={newConsultant.bankAccountNumber}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="bankIFSCCode"
        placeholder="Bank IFSC Code"
        value={newConsultant.bankIFSCCode}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="accountHolderName"
        placeholder="Account Holder Name"
        value={newConsultant.accountHolderName}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="signature"
        onChange={handleFileChange} // Handle file input change
        required
      />
      <button type="submit">Create Consultant</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default CreateConsultant;
