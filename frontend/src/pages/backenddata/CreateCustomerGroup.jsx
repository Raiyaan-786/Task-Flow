import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const CreateCustomerGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/getallcustomers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
          },
        });
        setCustomers(response.data.customers);
      } catch (err) {
        setError("An error occurred while fetching customers.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log("Group Name:", groupName); 
    console.log("Selected Customers:", selectedCustomers); 

    try {
        const response = await API.post('/creategroup', {
            groupName: groupName,
            customerIds: selectedCustomers,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        
        console.log("Response from API:", response.data); 
        setMessage("Group created successfully!");
        setGroupName(''); 
        setSelectedCustomers([]);
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError(err.response?.data?.error || "An error occurred while creating the group.");
    }
};

  const handleCustomerSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCustomers(value);
  };

  const addCustomerToSelected = (customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    }
  };

  const removeCustomerFromSelected = (customerId) => {
    setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Create a Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Customers:</label>
          <ul>
            {customers.map((customer) => (
              <li key={customer._id}>
                <span>{customer.customerName}</span>
                <button type="button" onClick={() => addCustomerToSelected(customer._id)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Selected Customers:</h3>
            <ul>
              {selectedCustomers.map((customerId) => {
                const customer = customers.find(c => c._id === customerId);
                return (
                  <li key={customerId}>
                    {customer ? customer.customerName : 'Unknown Customer'}
                    <button type="button" onClick={() => removeCustomerFromSelected(customerId)}>
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <button type="submit">Create Group</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default CreateCustomerGroup;
