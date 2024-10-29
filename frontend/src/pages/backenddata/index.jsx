import React from 'react'
import CreateUser from './CreateUser'
import DisplayUsers from './DisplayUser'
import CreateConsultant from './CreateConsultant'
import DisplayConsultants from './DisplayConsultant'
import CreateCustomer from './CreateCustomer'
import DisplayCustomers from './DisplayCustomer'
import CreateWork from './CreateWork'
import DisplayWork from './DisplayWork'
import EmployeeDashboard from './EmployeeDashboard'
import WorkDashboard from './WorkDashboard'
import CreateTurnover from './CreateTurnover'
import DisplayTurnover from './DisplayTurnover'
import DisplayIndividualWork from './DisplayIndividualWork'
import CreateCustomerGroup from './CreateCustomerGroup'

const Backend = () => {
  return (
    <div>
      {/* <CreateUser/> */}
      {/* <DisplayUsers/> */}
      {/* <CreateConsultant/> */}
      {/* <DisplayConsultants/> */}
      {/* <CreateCustomer/> */}
      {/* <DisplayCustomers/> */}
      {/* <CreateWork/> */}
      {/* <DisplayWork/> */}
      {/* <EmployeeDashboard/> */}
      {/* <WorkDashboard/> */}
      {/* <CreateTurnover/> */}
      {/* <DisplayTurnover/> */}
      {/* <DisplayIndividualWork/> */}
      <CreateCustomerGroup/>
    </div>
  )
}

export default Backend

// import React, { useEffect, useState } from 'react'
// import API from '../../api/api';

// const BackendData = () => {
//   const [users, setUsers] = useState([]);   
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');   

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem('token');  
//       console.log(token)

//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         return;
//       }
//  Changes done
//       try {
//         const response = await API.get('/auth/users', {
//           headers: {
//             Authorization: `Bearer ${token}`  
//           },
//         });

//         setUsers(response.data.users);  
//         setLoading(false);  
//       } catch (err) {
        
//         setError(err.response?.data?.error || 'Failed to fetch users');
//         console.log(err)
//         setLoading(false);
//       }
//     };

//     fetchUsers();  
//   }, []);  


//   if (loading) {
//     return <p>Loading users...</p>;
//   }
//   if (error) {
//     return <p>Error: {error}</p>;
//   }
//   console.log(users)
//   return (
//     <div>
//       <h1>User List</h1>
//       <table border="1" cellPadding="10" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           { users.map((user) => (
//             <tr key={user._id}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default BackendData

// import React, { useState } from 'react';
// import API from '../../api/api';

// const CreateUser = () => {
//   const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const createUser = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       const response = await API.post('/auth/users', newUser, {
//         headers: {
//           Authorization: `Bearer ${token}`, 
//         },
//       });
//       setSuccess(response.data.message);
//       setNewUser({ name: '', email: '', password: '', role: '' }); 
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to create user');
//       setSuccess('');
//     }
//   };

//   return (
//     <div>
//       <h2>Create User</h2>
//       <form onSubmit={createUser}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={newUser.name}
//           onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={newUser.email}
//           onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={newUser.password}
//           onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//           required
//         />
//         <select
//           value={newUser.role}
//           onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//           required
//         >
//           <option value="" disabled>Select Role</option>
//           <option value="Admin">Admin</option>
//           <option value="Manager">Manager</option>
//           <option value="User">User</option>
//         </select>
//         <button type="submit">Create User</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//     </div>
//   );
// };

// export default CreateUser;

// import React, { useState, useEffect } from 'react';
// import API from '../../api/api'; // Make sure to have your API instance set up correctly

// const CreateTask = () => {
//   const [task, setTask] = useState({ title: '', description: '', assignedTo: '' });
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     // Fetch users to populate the dropdown
//     const fetchUsers = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await API.get('/auth/users', {
//           headers: {
//             Authorization: `Bearer ${token}`, // Attach token for authentication
//           },
//         });
//         setUsers(response.data.users);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch users');
//       }
//     };

//     fetchUsers();
//   }, []);

//   const createTask = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       const response = await API.post('/tasks', task, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Attach token for authentication
//         },
//       });
//       setSuccess(response.data.message);
//       setTask({ title: '', description: '', assignedTo: '' }); // Clear form fields
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to create task');
//       setSuccess('');
//     }
//   };

//   return (
//     <div>
//       <h2>Create Task</h2>
//       <form onSubmit={createTask}>
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={task.title}
//           onChange={(e) => setTask({ ...task, title: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="Task Description"
//           value={task.description}
//           onChange={(e) => setTask({ ...task, description: e.target.value })}
//           required
//         ></textarea>
//         <select
//           value={task.assignedTo}
//           onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
//           required
//         >
//           <option value="" disabled>Select User to Assign</option>
//           {users.map((user) => (
//             <option key={user._id} value={user._id}>
//               {user.name} ({user.email})
//             </option>
//           ))}
//         </select>
//         <button type="submit">Create Task</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//     </div>
//   );
// };

// export default CreateTask;

/// src/components/DisplayTasks.jsx
// import React, { useEffect, useState } from 'react';
// import API from '../../api/api'; // Make sure to have your API instance set up correctly

// const DisplayTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await API.get('/tasks', {
//           headers: {
//             Authorization: `Bearer ${token}`, // Attach token for authentication
//           },
//         });
//         setTasks(response.data.tasks); // Assuming tasks are returned in this structure
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch tasks');
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   if (loading) {
//     return <p>Loading tasks...</p>;
//   }
//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h1>Task List</h1>
//       <table border="1" cellPadding="10" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Assigned To</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task) => (
//             <tr key={task._id}>
//               <td>{task.title}</td>
//               <td>{task.description}</td>
//               <td>{task.assignedTo?.name} ({task.assignedTo?.email})</td> {/* Optional chaining to prevent errors */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DisplayTasks;