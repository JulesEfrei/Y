"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useApolloClient } from "@apollo/client";
import { gql } from "@/__generated__";

// Add this to your AuthContext type
type User = {
  id: string;
  name: string;
  email: string;
};

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// GraphQL query to get the current user
const ME_QUERY = gql(`
  query Me {
    me {
      id
      name
      email
    }
  }
`);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();

  // Function to fetch the current user
  const fetchUser = async () => {
    try {
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: "network-only",
      });

      if (data.me) {
        setUser(data.me);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      // Clear token if there's an authentication error
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for token and fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = (token: string) => {
    localStorage.setItem("token", token);
    fetchUser();
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Reset Apollo cache
    client.resetStore();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
