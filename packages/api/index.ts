import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { verifyToken } from "./src/utils/auth";
import { resolvers } from "./src/resolvers";
import type { Context } from "./src/types/context";
import type { JwtPayload } from "jsonwebtoken";

const typeDefs = readFileSync("./src/schema.graphql", "utf-8");
const prisma = new PrismaClient();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    // Extraire le token du cookie au lieu du header Authorization
    const cookies = req.headers.cookie?.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie?.split('=') || [];
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>) || {};
    
    const token = cookies.auth_token || req.headers.authorization?.split(" ")[1];
    
    // Le verifyToken renvoie un objet avec un ID ou undefined en cas d'échec
    let user: (JwtPayload & { id: string }) | undefined = undefined;
    
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded) {
          user = decoded;
        }
      } catch (e) {
        // Token invalide, on garde user undefined
      }
    }

    return {
      prisma,
      user,
      res,
    };
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
