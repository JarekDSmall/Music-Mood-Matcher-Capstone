import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const PrivateRouteWrapper = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  console.log("PrivateRouteWrapper isAuthenticated:", isAuthenticated); // Logging for debugging
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRouteWrapper;
