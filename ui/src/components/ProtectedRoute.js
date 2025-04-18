import React from "react";
import { useAuth } from "../services/AuthProvider";
import Loading from "./elements/Loading";
import NoAccess from "./elements/NoAccess";

const ProtectedRoute = ({ children }) => {
  const { userInfo, loading } = useAuth();

  if (loading) return <Loading />;
  if (!userInfo.authenticated) return <NoAccess />;
  return children;
};

export default ProtectedRoute;
