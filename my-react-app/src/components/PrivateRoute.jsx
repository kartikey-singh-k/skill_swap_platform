// src/components/PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth"; // Make sure to import this

function PrivateRoute({ children }) {
  const { user } = useAuth(); // Use the hook to get the real user object

  if (!user) {
    // If there is no user, redirect to the /login page
    return <Navigate to="/login" replace />;
  }

  return children; // If there is a user, render the component
}

export default PrivateRoute;