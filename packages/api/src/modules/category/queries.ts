import type { QueryResolvers } from "../../types/generated";
import { formatDates, formatPrismaResults } from "../utils/formatters";

export const categoryQueries: QueryResolvers = {
  categories: async (_, __, { prisma }) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return formatPrismaResults(categories);
  },

  category: async (_, { id }, { prisma }) => {
    const category = await prisma.category.findUnique({ where: { id } });
    return formatDates(category);
  },
};
