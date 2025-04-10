import type {
  LikeResolvers,
  CommentLikeResolvers,
} from "../../types/generated";
import { formatDates } from "../utils/formatters";

export const likeTypeResolvers: LikeResolvers = {
  user: async ({ userId }, _, { prisma }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return formatDates(user);
  },

  post: async ({ postId }, _, { prisma }) => {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
    });
    return formatDates(post);
  },
};

export const commentLikeTypeResolvers: CommentLikeResolvers = {
  user: async (parent, _, { prisma }) => {
    const userId = (parent as any).userId || (parent as any).user?.id;
    if (!userId) {
      throw new Error("User ID not found in CommentLike");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return formatDates(user);
  },

  comment: async (parent, _, { prisma }) => {
    const commentId = (parent as any).commentId || (parent as any).comment?.id;
    if (!commentId) {
      throw new Error("Comment ID not found in CommentLike");
    }

    const comment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
    });
    return formatDates(comment);
  },
};
