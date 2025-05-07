import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";

const AdminRoute = ( ) => {
  const { isAdminLoggedIn } = useContext(AdminAuthContext);

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
