import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, getRefreshToken } from "../utils/api";

export const ProtectedRoute = ({ children }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // ✅ Allow access if either token exists
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
