import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export default function createApolloClient() {
  // Créer un lien HTTP avec support des cookies
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    // Activer l'envoi automatique des cookies avec les requêtes
    credentials: 'include',
    fetchOptions: {
      credentials: 'include',
    },
  });

  // Ajout d'un gestionnaire d'erreur
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Combiner les liens
  const link = from([errorLink, httpLink]);

  // Plus besoin d'ajouter manuellement le token dans les headers
  // Les cookies seront automatiquement envoyés avec chaque requête
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
