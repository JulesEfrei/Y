import { formatDates, formatPrismaResults } from "../utils/formatters";
import { assertAuthenticated } from "../../types/context";
import type { QueryResolvers } from "../../types/generated";

export const userQueries: QueryResolvers = {
  me: async (_, __, context) => {
    if (!context.user) {
      return null; // Retourne null si l'utilisateur n'est pas connecté au lieu de lever une erreur
    }

    const user = await context.prisma.user.findUnique({
      where: { id: context.user.id },
    });
    return formatDates(user);
  },

  users: async (_, __, { prisma }) => {
    const users = await prisma.user.findMany();
    return formatPrismaResults(users);
  },

  user: async (_, { id }, { prisma }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    return formatDates(user);
  },
};
