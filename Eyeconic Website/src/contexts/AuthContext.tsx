// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest, logoutRequest } from "../api/auth";

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  joinedDate: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("eyeconic_user");
      const accessToken = localStorage.getItem("access_token");

      if (storedUser && accessToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log("User authenticated from localStorage:", userData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("eyeconic_user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login for:", username);
      const response = await loginRequest(username, password);
      console.log("Login response:", response);

      // Create user data with all available information
      const userData: User = {
        id: response.user?.id || Date.now().toString(),
        username: response.user?.username || username,
        email: response.user?.email || "",
        firstName: response.user?.first_name || "",
        lastName: response.user?.last_name || "",
        avatar: response.user?.avatar || null,
        joinedDate: response.user?.date_joined || new Date().toISOString(),
        isNewUser: true, // Mark as new user on login
      };

      // Store user data and tokens
      setUser(userData);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem("eyeconic_user", JSON.stringify(userData));
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      console.log("User data saved:", userData);
      console.log(
        "LocalStorage eyeconic_user:",
        localStorage.getItem("eyeconic_user")
      );
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.detail || error.message || "Login failed"
      );
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      console.log("Attempting registration for:", {
        username,
        email,
        firstName,
        lastName,
      });

      const response = await registerRequest(
        username,
        email,
        password,
        firstName,
        lastName
      );
      console.log("Registration successful:", response);

      // Create user data immediately after registration
      const userData: User = {
        id: response.user?.id || Date.now().toString(),
        username: username,
        email: email,
        firstName: firstName || "",
        lastName: lastName || "",
        avatar: null,
        joinedDate: new Date().toISOString(),
        isNewUser: true, // Mark as new user on registration
      };

      // If registration includes tokens, use them
      if (response.access && response.refresh) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("eyeconic_user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        console.log("User registered and logged in:", userData);
      } else {
        // Otherwise, do auto-login
        await login(username, password);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      await logoutRequest();
      console.log("Logout request successful");
    } catch (error) {
      console.warn("Logout request failed, clearing local data anyway:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("eyeconic_user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.log("User logged out and local data cleared");
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("eyeconic_user", JSON.stringify(updatedUser));
      console.log("Profile updated:", updatedUser);
    }
  };

  const markUserAsExperienced = () => {
    if (user) {
      const updatedUser = { ...user, isNewUser: false };
      setUser(updatedUser);
      localStorage.setItem("eyeconic_user", JSON.stringify(updatedUser));
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        markUserAsExperienced,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
