"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

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

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [userData, setUserData] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the current user
  const refreshUser = async () => {
    setLoading(true);
    try {
      const { user, userData } = await getCurrentUser();
      setUser(user);
      setUserData(userData);
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
    const { error } = await signOut();
    if (!error) {
      setUser(null);
      setUserData(null);
    } else {
      console.error("Error signing out:", error);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await refreshUser();
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    // Initial fetch of user
    refreshUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
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
