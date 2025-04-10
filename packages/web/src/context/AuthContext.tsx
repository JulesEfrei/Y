"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useApolloClient, gql } from "@apollo/client";
import { gql as generatedGql } from "@/__generated__";

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
const ME_QUERY = generatedGql(`
  query Me {
    me {
      id
      name
      email
    }
  }
`);

// GraphQL mutation for signout
const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;

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
        errorPolicy: 'none', // Traitera les erreurs GraphQL comme des erreurs réseau
        // Ajout d'options pour améliorer la stabilité des requêtes
        context: {
          fetchOptions: {
            credentials: 'include', // S'assure que les cookies sont envoyés
          },
        },
      });

      if (data && data.me) {
        setUser(data.me);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      // Pas besoin de supprimer les tokens du localStorage comme avant
    } finally {
      setIsLoading(false);
    }
  };

  // Check for user session on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  // On prend toujours le token en paramètre pour garder la même interface que before,
  // mais on ne l'enregistre plus dans le localStorage car le cookie est défini par le backend
  const login = (token: string) => {
    fetchUser();
  };

  // Logout function - maintenant fait une requête au serveur pour invalider le cookie
  const logout = async () => {
    try {
      await client.mutate({
        mutation: SIGN_OUT_MUTATION,
      });
      setUser(null);
      // Reset Apollo cache
      client.resetStore();
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
