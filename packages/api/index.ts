import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { verifyToken } from "./src/utils/auth";
import { resolvers } from "./src/resolvers";
import type { Context } from "./src/types/context";

const typeDefs = readFileSync("./src/schema.graphql", "utf-8");
const prisma = new PrismaClient();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1];
    const user = token ? verifyToken(token) : null;

    return {
      prisma,
      user,
    };
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
