import type { PostResolvers } from "../../types/generated";
import { formatDates, formatPrismaResults } from "../utils/formatters";

export const postTypeResolvers: PostResolvers = {
  author: async ({ authorId }, _, { prisma }) => {
    const author = await prisma.user.findUniqueOrThrow({
      where: { id: authorId },
    });
    return formatDates(author);
  },

  category: async ({ categoryId }, _, { prisma }) => {
    if (!categoryId) return null;
    const category = await prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
    });
    return formatDates(category);
  },

  comments: async ({ id }, _, { prisma }) => {
    const comments = await prisma.comment.findMany({ where: { postId: id } });
    return formatPrismaResults(comments);
  },

  likes: async ({ id }, _, { prisma }) => {
    const likes = await prisma.like.findMany({ where: { postId: id } });
    return formatPrismaResults(likes);
  },

  likesCount: ({ id }, _, { prisma }) =>
    prisma.like.count({ where: { postId: id } }),
};
