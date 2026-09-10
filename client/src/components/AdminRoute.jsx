import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/app?state=login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default AdminRoute;
