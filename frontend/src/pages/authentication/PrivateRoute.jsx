import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // const token = localStorage.getItem('token'); 
  // if(token) setIsAuthenticated(true);
  // console.log(isAuthenticated)   
  return isAuthenticated ? children:<Navigate to='/login'/>;
}
export default PrivateRoute