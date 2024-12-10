import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const DisplayWork = () => {
  const [workItems, setWorkItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const customerData = response.data.customers || [];
        setCustomers(customerData);
        console.log("Fetched Customers:", customerData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers');
        console.log(err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchWorkItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const response = await API.get('/getallwork', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const workData = response.data.works || [];
        setWorkItems(workData);
        console.log("Fetched Work Items:", workData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch work items');
        console.log(err);
        setLoading(false);
      }
    };

    fetchWorkItems();
  }, []);

  if (loading) {
    return <p>Loading work items...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const getCustomerNameById = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    return customer ? customer.customerName : 'Unknown Customer';
  };

  const handleUpdate = (workId) => {
    console.log("Update clicked for work ID:", workId);
  };

  const handleShare = (workId) => {
    console.log("Share clicked for work ID:", workId);
    // Add your share logic here
  };

  const handleTemp = (workId) => {
    console.log("Temp clicked for work ID:", workId);
    // Add your temporary logic here
  };

  return (
    <div>
      <h1>Work List</h1>
      {workItems.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Customer Email</th>
              <th>Mobile No.</th>
              <th>Assigned Employee</th>
              <th>Employee Email</th>
              <th>Service</th>
              <th>Work Type</th>
              <th>Month</th>
              <th>Quarter</th>
              <th>Financial Year</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Current Status</th>
              <th>Reminder</th>
              <th>Remark</th>
              <th>Created Date</th>
              <th>Modified Date</th>
              <th>Status Actions</th> {/* New Status column */}
            </tr>
          </thead>
          <tbody>
            {workItems.map((work) => (
              <tr key={work._id}>
                <td>{getCustomerNameById(work.customer._id) || '-'}</td>
                <td>{work.customer?.email || '-'}</td>
                <td>{work.customer?.mobileNo || '-'}</td>
                <td>{work.assignedEmployee?.name || '-'}</td>
                <td>{work.assignedEmployee?.email || '-'}</td>
                <td>{work.service}</td>
                <td>{work.workType}</td>
                <td>{work.month}</td>
                <td>{work.quarter}</td>
                <td>{work.financialYear}</td>
                <td>{work.price}</td>
                <td>{work.quantity}</td>
                <td>{work.discount}</td>
                <td>{work.currentStatus || '-'}</td>
                <td>{work.reminder || 'No Reminder'}</td>
                <td>{work.remark || 'No Remark'}</td>
                <td>{new Date(work.createdAt).toLocaleDateString()}</td>
                <td>{work.updatedAt ? new Date(work.updatedAt).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleUpdate(work._id)}>Update</button>
                  <button onClick={() => handleShare(work._id)}>Share</button>
                  <button onClick={() => handleTemp(work._id)}>Temp</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No work items found.</p>
      )}
    </div>
  );
};

export default DisplayWork;
