import { useState, useEffect } from "react";
import { getAccessToken, getRefreshToken } from "../utils/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // ✅ User is authenticated if either access or refresh token exists
    // (refresh token means user can still auto-refresh)
    const authenticated = !!accessToken || !!refreshToken;

    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
  };
};
