import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const DisplayCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null); // State to hold customer being edited

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/getallcustomers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data.customers || []);
        console.log(response.data.customers)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Function to handle updating customer
  const handleUpdate = async (customerId) => {
    try {
      const response = await API.put(`/customer/${customerId}`, editingCustomer, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert(response.data.message);
      setCustomers((prev) => prev.map((cust) => (cust._id === customerId ? response.data.customer : cust)));
      setEditingCustomer(null); 
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Customer List</h1>
      {customers.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th>Billing Name</th>
              <th>Company/Firm Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>WhatsApp No</th>
              <th>PAN</th>
              <th>Address</th>
              <th>Contact Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  {editingCustomer?._id === customer._id ? (
                    <input
                      value={editingCustomer.customerName}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, customerName: e.target.value })}
                    />
                  ) : (
                    customer.customerName
                  )}
                </td>
                {/* Repeat for other fields */}
                <td>{customer.customerCode}</td>
                <td>{customer.billingName}</td>
                <td>{customer.companyName || '-'}</td>
                <td>{customer.email}</td>
                <td>{customer.mobileNo}</td>
                <td>{customer.whatsappNo || '-'}</td>
                <td>{customer.PAN}</td>
                <td>{customer.address}</td>
                <td>{customer.contactPerson || '-'}</td>
                <td>
                  {editingCustomer?._id === customer._id ? (
                    <>
                      <button onClick={() => handleUpdate(customer._id)}>Save</button>
                      <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setEditingCustomer(customer)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
};

export default DisplayCustomers;
