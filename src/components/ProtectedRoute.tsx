import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ from: loc, message: "You must log in to continue." }}
        replace
      />
    );
  }


  return children;
};

export default ProtectedRoute;
