import type { UserResolvers } from "../../types/generated";
import { formatPrismaResults } from "../utils/formatters";

export const userTypeResolvers: UserResolvers = {
  posts: async ({ id }, _, { prisma }) => {
    const posts = await prisma.post.findMany({ where: { authorId: id } });
    return formatPrismaResults(posts);
  },
  
  comments: async ({ id }, _, { prisma }) => {
    const comments = await prisma.comment.findMany({
      where: { authorId: id },
    });
    return formatPrismaResults(comments);
  },
  
  likes: async ({ id }, _, { prisma }) => {
    const likes = await prisma.like.findMany({ where: { userId: id } });
    return formatPrismaResults(likes);
  },
  
  commentLikes: async ({ id }, _, { prisma }) => {
    const commentLikes = await prisma.commentLike.findMany({
      where: { userId: id },
    });
    return formatPrismaResults(commentLikes);
  },
};
