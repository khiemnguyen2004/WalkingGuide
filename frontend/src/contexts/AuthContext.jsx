import React, { createContext, useState, useEffect, useContext } from "react";
import userApi from "../api/userApi";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [notificationRefreshTrigger, setNotificationRefreshTrigger] = useState(0);

  // Refresh user data from server if we have a token
  useEffect(() => {
    const refreshUserData = async () => {
      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          const response = await userApi.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
    };

    refreshUserData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const refreshNotifications = () => {
    console.log('[AuthContext] refreshNotifications function called');
    setNotificationRefreshTrigger(prev => {
      const next = prev + 1;
      console.log('[AuthContext] refreshNotifications called, new trigger:', next);
      return next;
    });
  };

  useEffect(() => {
    console.log('[AuthContext] notificationRefreshTrigger changed:', notificationRefreshTrigger);
  }, [notificationRefreshTrigger]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      notificationRefreshTrigger, 
      refreshNotifications 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
