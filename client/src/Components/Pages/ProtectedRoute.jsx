import React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../context";
const ProtectedRoute = () => {
  const [user] = useContext(UserContext);

  if (user.loading) return <div></div>;

  return user.user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
