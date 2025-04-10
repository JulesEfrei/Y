import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import http from "http";
import { json } from "body-parser";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { verifyToken } from "./src/utils/auth";
import { resolvers } from "./src/modules";
import type { Context } from "./src/types/context";
import type { JwtPayload } from "jsonwebtoken";

const typeDefs = readFileSync("./src/schema.graphql", "utf-8");
const prisma = new PrismaClient();

async function startServer() {
  try {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
    });

    await server.start();

    app.use(
      "/graphql",
      cors({
        origin: ["http://localhost:3000"],
        credentials: true,
      }),
      json(),
      //@ts-ignore
      expressMiddleware(server, {
        context: async ({ req, res }) => {
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

          if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
              token = authHeader.substring(7);
            }
          }

          let user: (JwtPayload & { id: string }) | undefined = undefined;

          if (token) {
            try {
              const decoded = verifyToken(token);
              if (decoded) {
                user = decoded;
              }
            } catch (e) {}
          }

          return {
            prisma,
            user,
            res,
          };
        },
      })
    );

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
