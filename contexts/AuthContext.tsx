"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the types for our context
type User = {
  id: string;
  email?: string;
} | null;

type UserData = {
  id: string;
  username: string;
  email: string;
  created_at: string;
} | null;

type AuthContextType = {
  user: User;
  userData: UserData;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

// Mock user data for demo purposes
const mockUser = {
  id: "user-123",
  email: "demo@example.com",
};

const mockUserData = {
  id: "user-123",
  username: "demouser",
  email: "demo@example.com",
  created_at: new Date().toISOString(),
};

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [userData, setUserData] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the current user
  const refreshUser = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demo, let's assume user is not logged in by default
      // In a real app, you would check local storage or cookies
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    setUserData(null);
    return { error: null };
  };

  // Simulate authentication state changes
  useEffect(() => {
    // Initial fetch of user
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);
