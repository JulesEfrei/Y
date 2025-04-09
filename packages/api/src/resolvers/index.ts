import type { Resolvers } from "../types/generated";
import { assertAuthenticated } from "../types/context";
import { comparePasswords, generateToken, hashPassword } from "../utils/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../utils/errorHandler";

const formatDates = (obj: any) => {
  if (!obj) return obj;

  const formatted = { ...obj };

  if (formatted.createdAt instanceof Date) {
    formatted.createdAt = formatted.createdAt.toISOString();
  }
  if (formatted.updatedAt instanceof Date) {
    formatted.updatedAt = formatted.updatedAt.toISOString();
  }

  return formatted;
};

const formatPrismaResults = (results: any | any[]) => {
  if (Array.isArray(results)) {
    return results.map(formatDates);
  }
  return formatDates(results);
};

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, context) => {
      assertAuthenticated(context);
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
    posts: async (_, { page = 1, limit = 20, offset = 0 }, { prisma }) => {
      const skip = (page - 1) * limit + offset;
      const posts = await prisma.post.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });
      return formatPrismaResults(posts);
    },
    postsByCategory: async (
      _,
      { categoryId, page = 1, limit = 20, offset = 0 },
      { prisma }
    ) => {
      const skip = (page - 1) * limit + offset;
      const posts = await prisma.post.findMany({
        where: { categoryId },
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });
      return formatPrismaResults(posts);
    },
    post: async (_, { id }, { prisma }) => {
      const post = await prisma.post.findUnique({ where: { id } });
      return formatDates(post);
    },
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
          { token, user: formatDates(user) },
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
        return createSuccessResponse(
          { token, user: formatDates(user) },
          "Login successful"
        );
      } catch (error) {
        return handlePrismaError(error);
      }
    },

    createCategory: async (_, { name }, context) => {
      try {
        assertAuthenticated(context);

        const existingCategory = await context.prisma.category.findUnique({
          where: { name },
        });

        if (existingCategory) {
          return createSuccessResponse(
            { category: formatDates(existingCategory) },
            "Category already exists"
          );
        }

        const category = await context.prisma.category.create({
          data: { name },
        });

        return createSuccessResponse(
          { category: formatDates(category) },
          "Category created successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to create a category"
          );
        }
        return handlePrismaError(error);
      }
    },

    updateCategory: async (_, { id, name }, context) => {
      try {
        assertAuthenticated(context);

        const existingCategory = await context.prisma.category.findUnique({
          where: { id },
        });

        if (!existingCategory) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Category not found");
        }

        const updatedCategory = await context.prisma.category.update({
          where: { id },
          data: { name },
        });

        return createSuccessResponse(
          { category: formatDates(updatedCategory) },
          "Category updated successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to update a category"
          );
        }
        return handlePrismaError(error);
      }
    },

    deleteCategory: async (_, { id }, context) => {
      try {
        assertAuthenticated(context);

        const existingCategory = await context.prisma.category.findUnique({
          where: { id },
        });

        if (!existingCategory) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Category not found");
        }

        await context.prisma.post.updateMany({
          where: { categoryId: id },
          data: { categoryId: null },
        });

        const deletedCategory = await context.prisma.category.delete({
          where: { id },
        });

        return createSuccessResponse(
          { category: formatDates(deletedCategory) },
          "Category deleted successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to delete a category"
          );
        }
        return handlePrismaError(error);
      }
    },

    createPost: async (_, { title, content, categoryName }, context) => {
      try {
        assertAuthenticated(context);

        const postData: any = {
          title,
          content,
          authorId: context.user.id,
        };

        if (categoryName) {
          let category = await context.prisma.category.findUnique({
            where: { name: categoryName },
          });

          if (!category) {
            category = await context.prisma.category.create({
              data: { name: categoryName },
            });
          }

          postData.categoryId = category.id;
        }

        const post = await context.prisma.post.create({
          data: postData,
          include: { category: true },
        });

        const formattedPost = formatDates(post);
        if (post.category) {
          formattedPost.category = formatDates(post.category);
        }

        return createSuccessResponse(
          { post: formattedPost },
          "Post created successfully"
        );
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

    updatePost: async (_, { id, title, content, categoryName }, context) => {
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

        const updateData: any = {
          ...(title && { title }),
          ...(content && { content }),
        };

        if (categoryName !== undefined) {
          if (categoryName === null || categoryName === "") {
            updateData.categoryId = null;
          } else {
            let category = await context.prisma.category.findUnique({
              where: { name: categoryName },
            });

            if (!category) {
              category = await context.prisma.category.create({
                data: { name: categoryName },
              });
            }

            updateData.categoryId = category.id;
          }
        }

        const updatedPost = await context.prisma.post.update({
          where: { id },
          data: updateData,
          include: { category: true },
        });

        const formattedPost = formatDates(updatedPost);
        if (updatedPost.category) {
          formattedPost.category = formatDates(updatedPost.category);
        }

        return createSuccessResponse(
          { post: formattedPost },
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

    createComment: async (_, { postId, content }, context) => {
      try {
        assertAuthenticated(context);
        const comment = await context.prisma.comment.create({
          data: { content, postId, authorId: context.user.id },
        });
        return createSuccessResponse(
          { comment: formatDates(comment) },
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

    replyToComment: async (_, { commentId, content }, context) => {
      try {
        assertAuthenticated(context);

        const parentComment = await context.prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!parentComment) {
          return createErrorResponse(
            ErrorCode.NOT_FOUND,
            "Parent comment not found"
          );
        }

        const comment = await context.prisma.comment.create({
          data: {
            content,
            authorId: context.user.id,
            postId: parentComment.postId,
            parentId: commentId,
          },
        });

        return createSuccessResponse(
          { comment: formatDates(comment) },
          "Reply added successfully"
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to reply to a comment"
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
          { comment: formatDates(updatedComment) },
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
          { comment: formatDates(deletedComment) },
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
        return createSuccessResponse(
          { like: formatDates(like) },
          "Post liked successfully"
        );
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
  },

  Category: {
    posts: async ({ id }, _, { prisma }) => {
      const posts = await prisma.post.findMany({ where: { categoryId: id } });
      return formatPrismaResults(posts);
    },
  },

  Post: {
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
  },

  Comment: {
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
  },

  Like: {
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
  },
};
