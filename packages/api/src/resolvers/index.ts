import type { Resolvers } from "../types/generated";
import { assertAuthenticated } from "../types/context";
import { comparePasswords, generateToken, hashPassword } from "../utils/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../utils/errorHandler";

export const resolvers: Resolvers = {
  Query: {
    me: (_, __, context) => {
      assertAuthenticated(context);
      return context.prisma.user.findUnique({ where: { id: context.user.id } });
    },
    users: (_, __, { prisma }) => prisma.user.findMany(),
    user: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
    posts: async (_, { page = 1, limit = 20, offset = 0 }, { prisma }) => {
      const skip = (page - 1) * limit + offset;
      return prisma.post.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });
    },
    post: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
    postComments: (_, { postId }, { prisma }) =>
      prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
      }),
  },

  Mutation: {
    signUp: async (_, { email, password, name }, { prisma }) => {
      try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
          data: { email, password: hashedPassword, name },
        });
        const token = generateToken(user.id);
        return createSuccessResponse(
          { token, user },
          "User created successfully"
        );
      } catch (error) {
        return handlePrismaError(error);
      }
    },

    signIn: async (_, { email, password }, { prisma }) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return createErrorResponse(
            ErrorCode.BAD_USER_INPUT,
            "No user found with this email"
          );
        }

        const valid = await comparePasswords(password, user.password);
        if (!valid) {
          return createErrorResponse(
            ErrorCode.BAD_USER_INPUT,
            "Invalid password"
          );
        }

        const token = generateToken(user.id);
        return createSuccessResponse({ token, user }, "Login successful");
      } catch (error) {
        return handlePrismaError(error);
      }
    },

    createPost: async (_, { title, content }, context) => {
      try {
        assertAuthenticated(context);
        const post = await context.prisma.post.create({
          data: { title, content, authorId: context.user.id },
        });
        return createSuccessResponse({ post }, "Post created successfully");
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to create a post"
          );
        }
        return handlePrismaError(error);
      }
    },

    updatePost: async (_, { id, title, content }, context) => {
      try {
        assertAuthenticated(context);
        const post = await context.prisma.post.findUnique({ where: { id } });
        if (!post) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Post not found");
        }
        if (post.authorId !== context.user.id) {
          return createErrorResponse(
            ErrorCode.UNAUTHORIZED,
            "You are not authorized to update this post"
          );
        }

        const updatedPost = await context.prisma.post.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(content && { content }),
          },
        });
        return createSuccessResponse(
          { post: updatedPost },
          "Post updated successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to update a post"
          );
        }
        return handlePrismaError(error);
      }
    },

    deletePost: async (_, { id }, context) => {
      try {
        assertAuthenticated(context);
        const post = await context.prisma.post.findUnique({ where: { id } });
        if (!post) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Post not found");
        }
        if (post.authorId !== context.user.id) {
          return createErrorResponse(
            ErrorCode.UNAUTHORIZED,
            "You are not authorized to delete this post"
          );
        }

        const deletedPost = await context.prisma.post.delete({ where: { id } });
        return createSuccessResponse(
          { post: deletedPost },
          "Post deleted successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to delete a post"
          );
        }
        return handlePrismaError(error);
      }
    },

    createComment: async (_, { postId, content }, context) => {
      try {
        assertAuthenticated(context);
        const comment = await context.prisma.comment.create({
          data: { content, postId, authorId: context.user.id },
        });
        return createSuccessResponse(
          { comment },
          "Comment created successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to create a comment"
          );
        }
        return handlePrismaError(error);
      }
    },

    updateComment: async (_, { id, content }, context) => {
      try {
        assertAuthenticated(context);
        const comment = await context.prisma.comment.findUnique({
          where: { id },
        });
        if (!comment) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
        }
        if (comment.authorId !== context.user.id) {
          return createErrorResponse(
            ErrorCode.UNAUTHORIZED,
            "You are not authorized to update this comment"
          );
        }

        const updatedComment = await context.prisma.comment.update({
          where: { id },
          data: { content },
        });
        return createSuccessResponse(
          { comment: updatedComment },
          "Comment updated successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to update a comment"
          );
        }
        return handlePrismaError(error);
      }
    },

    deleteComment: async (_, { id }, context) => {
      try {
        assertAuthenticated(context);
        const comment = await context.prisma.comment.findUnique({
          where: { id },
        });
        if (!comment) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
        }
        if (comment.authorId !== context.user.id) {
          return createErrorResponse(
            ErrorCode.UNAUTHORIZED,
            "You are not authorized to delete this comment"
          );
        }

        const deletedComment = await context.prisma.comment.delete({
          where: { id },
        });
        return createSuccessResponse(
          { comment: deletedComment },
          "Comment deleted successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to delete a comment"
          );
        }
        return handlePrismaError(error);
      }
    },

    toggleLike: async (_, { postId }, context) => {
      try {
        assertAuthenticated(context);
        const existingLike = await context.prisma.like.findUnique({
          where: { userId_postId: { userId: context.user.id, postId } },
        });

        if (existingLike) {
          await context.prisma.like.delete({
            where: { userId_postId: { userId: context.user.id, postId } },
          });
          return createSuccessResponse(
            { like: null },
            "Like removed successfully"
          );
        }

        const like = await context.prisma.like.create({
          data: { userId: context.user.id, postId },
        });
        return createSuccessResponse({ like }, "Post liked successfully");
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to like a post"
          );
        }
        return handlePrismaError(error);
      }
    },
  },

  User: {
    posts: ({ id }, _, { prisma }) =>
      prisma.post.findMany({ where: { authorId: id } }),
    comments: ({ id }, _, { prisma }) =>
      prisma.comment.findMany({ where: { authorId: id } }),
    likes: ({ id }, _, { prisma }) =>
      prisma.like.findMany({ where: { userId: id } }),
  },

  Post: {
    author: ({ authorId }, _, { prisma }) =>
      prisma.user.findUniqueOrThrow({ where: { id: authorId } }),
    comments: ({ id }, _, { prisma }) =>
      prisma.comment.findMany({ where: { postId: id } }),
    likes: ({ id }, _, { prisma }) =>
      prisma.like.findMany({ where: { postId: id } }),
    likesCount: ({ id }, _, { prisma }) =>
      prisma.like.count({ where: { postId: id } }),
  },

  Comment: {
    author: ({ authorId }, _, { prisma }) =>
      prisma.user.findUniqueOrThrow({ where: { id: authorId } }),
    post: ({ postId }, _, { prisma }) =>
      prisma.post.findUniqueOrThrow({ where: { id: postId } }),
  },

  Like: {
    user: ({ userId }, _, { prisma }) =>
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    post: ({ postId }, _, { prisma }) =>
      prisma.post.findUniqueOrThrow({ where: { id: postId } }),
  },
};
