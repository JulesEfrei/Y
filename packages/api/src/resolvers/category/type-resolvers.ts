import type { CategoryResolvers } from "../../types/generated";
import { formatPrismaResults } from "../utils/formatters";

export const categoryTypeResolvers: CategoryResolvers = {
  posts: async ({ id }, _, { prisma }) => {
    const posts = await prisma.post.findMany({ where: { categoryId: id } });
    return formatPrismaResults(posts);
  },
};
