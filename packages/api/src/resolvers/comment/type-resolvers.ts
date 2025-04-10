import type { CommentResolvers } from "../../types/generated";
import { formatDates, formatPrismaResults } from "../utils/formatters";

export const commentTypeResolvers: CommentResolvers = {
  author: async ({ authorId }, _, { prisma }) => {
    const author = await prisma.user.findUniqueOrThrow({
      where: { id: authorId },
    });
    return formatDates(author);
  },

  post: async ({ postId }, _, { prisma }) => {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
    });
    return formatDates(post);
  },

  parent: async ({ parentId }, _, { prisma }) => {
    if (!parentId) return null;
    const parent = await prisma.comment.findUniqueOrThrow({
      where: { id: parentId },
    });
    return formatDates(parent);
  },

  replies: async ({ id }, _, { prisma }) => {
    const replies = await prisma.comment.findMany({
      where: { parentId: id },
      orderBy: { createdAt: "asc" },
    });
    return formatPrismaResults(replies);
  },

  likes: async ({ id }, _, { prisma }) => {
    const likes = await prisma.commentLike.findMany({
      where: { commentId: id },
    });
    return formatPrismaResults(likes);
  },

  likesCount: ({ likesCount }, _, __) => likesCount,
};
