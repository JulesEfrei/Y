import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import http from "http";
import { json } from "body-parser";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { verifyToken } from "./src/utils/auth";
import { resolvers } from "./src/resolvers";
import type { Context } from "./src/types/context";
import type { JwtPayload } from "jsonwebtoken";

const typeDefs = readFileSync("./src/schema.graphql", "utf-8");
const prisma = new PrismaClient();

async function startServer() {
  // Arrêter tout serveur existant potentiellement sur le port 4000
  try {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
    });

    await server.start();

    // CORS simplifié avec une assertion de type pour éviter l'erreur TypeScript
    app.use(
      "/graphql",
      // @ts-ignore - Ignorer l'erreur de type pour cors
      cors({
        origin: ["http://localhost:3000"],
        credentials: true,
      }),
      json(),
      // @ts-ignore - Ignorer l'erreur de type pour expressMiddleware
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          // Extraire le token du cookie
          let token: string | undefined;

          if (req.headers.cookie) {
            const cookies = req.headers.cookie
              .split("; ")
              .reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                if (key && value) acc[key] = value;
                return acc;
              }, {} as Record<string, string>);

            token = cookies.auth_token;
          }

          // Vérifier le token d'Authorization si pas de cookie
          if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
              token = authHeader.substring(7);
            }
          }

          // Vérifier le token
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
      })
    );

    // Démarrage du serveur avec gestion d'erreur
    await new Promise<void>((resolve) => {
      httpServer.once("error", (err) => {
        console.error("Erreur lors du démarrage du serveur:", err);
        process.exit(1);
      });

      httpServer.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000/graphql`);
        resolve();
      });
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur Apollo:", error);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
