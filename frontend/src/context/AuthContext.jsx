import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save authentication details
  const saveAuth = (data) => {
    const token =
      data.token ||
      data.accessToken ||
      data.data?.token ||
      data.data?.accessToken;

    const loggedInUser = data.user || data.data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Invalid authentication response from server.");
    }

    localStorage.setItem("token", token);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return saveAuth(response.data);
  };

  // Register
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const data = response.data;

    const token =
      data.token ||
      data.accessToken ||
      data.data?.token ||
      data.data?.accessToken;

    const loggedInUser = data.user || data.data?.user;

    if (token && loggedInUser) {
      localStorage.setItem("token", token);
      setUser(loggedInUser);

      return loggedInUser;
    }

    return null;
  };

  // Get currently logged-in user
  const fetchCurrentUser = async () => {
    const response = await api.get("/auth/me");

    const currentUser =
      response.data.user ||
      response.data.data?.user ||
      response.data.data ||
      response.data;

    if (!currentUser || !currentUser._id) {
      throw new Error("Unable to retrieve user information.");
    }

    setUser(currentUser);

    return currentUser;
  };

  // Logout
  const logout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check existing login when application opens
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch (error) {
        disconnectSocket();
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Connect Socket.io whenever an authenticated user is available
  useEffect(() => {
    if (!user?._id) {
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
