import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export default function createApolloClient() {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    // Activer l'envoi automatique des cookies avec les requêtes
    credentials: 'include',
  });

  // Plus besoin d'ajouter manuellement le token dans les headers
  // Les cookies seront automatiquement envoyés avec chaque requête
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}
