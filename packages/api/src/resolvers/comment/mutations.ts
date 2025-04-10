import type { MutationResolvers } from "../../types/generated";
import { assertAuthenticated } from "../../types/context";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../../utils/errorHandler";

export const commentMutations: MutationResolvers = {
  createComment: async (_, { postId, content }, context) => {
    try {
      assertAuthenticated(context);

      const comment = await context.prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: context.user.id } },
        },
      });

      return createSuccessResponse({ comment });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  replyToComment: async (_, { commentId, content }, context) => {
    try {
      assertAuthenticated(context);

      // Verify parent comment exists
      const parentComment = await context.prisma.comment.findUnique({
        where: { id: commentId },
        include: { post: true },
      });

      if (!parentComment) {
        return createErrorResponse(
          ErrorCode.NOT_FOUND,
          "Parent comment not found"
        );
      }

      // Create the reply
      const reply = await context.prisma.comment.create({
        data: {
          content,
          post: { connect: { id: parentComment.post.id } },
          author: { connect: { id: context.user.id } },
          parent: { connect: { id: commentId } },
        },
        include: {
          author: true,
          post: true,
          parent: true,
        },
      });

      return createSuccessResponse({ comment: reply });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  updateComment: async (_, { id, content }, context) => {
    try {
      assertAuthenticated(context);

      // Verify the comment exists and belongs to the user
      const existingComment = await context.prisma.comment.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!existingComment) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
      }

      if (existingComment.author.id !== context.user.id) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "You can only update your own comments"
        );
      }

      // Update the comment
      const updatedComment = await context.prisma.comment.update({
        where: { id },
        data: { content },
      });

      return createSuccessResponse({ comment: updatedComment });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  deleteComment: async (_, { id }, context) => {
    try {
      assertAuthenticated(context);

      // Verify the comment exists and belongs to the user
      const existingComment = await context.prisma.comment.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!existingComment) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
      }

      if (existingComment.author.id !== context.user.id) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "You can only delete your own comments"
        );
      }

      // Delete the comment
      await context.prisma.comment.delete({
        where: { id },
      });

      return createSuccessResponse({ message: "Comment deleted successfully" });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  toggleCommentLike: async (_, { commentId }, context) => {
    try {
      assertAuthenticated(context);

      // Check if the comment exists
      const comment = await context.prisma.comment.findUnique({
        where: { id: commentId },
        include: { likes: true },
      });

      if (!comment) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
      }

      // Check if the user has already liked the comment
      const existingLike = await context.prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: context.user.id,
            commentId,
          },
        },
      });

      if (existingLike) {
        // Unlike: Delete the like
        await context.prisma.commentLike.delete({
          where: {
            userId_commentId: {
              userId: context.user.id,
              commentId,
            },
          },
        });

        // Update likesCount on the comment
        await context.prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } },
        });

        return createSuccessResponse({
          message: "Comment unliked successfully",
        });
      } else {
        // Like: Create a new like
        await context.prisma.commentLike.create({
          data: {
            user: { connect: { id: context.user.id } },
            comment: { connect: { id: commentId } },
          },
        });

        // Update likesCount on the comment
        await context.prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { increment: 1 } },
        });

        return createSuccessResponse({ message: "Comment liked successfully" });
      }
    } catch (error) {
      return handlePrismaError(error);
    }
  },
};
