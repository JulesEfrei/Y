import type { QueryResolvers } from "../../types/generated";
import { formatPrismaResults } from "../utils/formatters";

export const commentQueries: QueryResolvers = {
  postComments: async (_, { postId }, { prisma }) => {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "desc" },
    });
    return formatPrismaResults(comments);
  },

  commentReplies: async (_, { commentId }, { prisma }) => {
    const replies = await prisma.comment.findMany({
      where: { parentId: commentId },
      orderBy: { createdAt: "asc" },
    });
    return formatPrismaResults(replies);
  },
};
