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
    me: async (_, __, context) => {
      assertAuthenticated(context);
      return await context.prisma.user.findUnique({
        where: { id: context.user.id },
      });
    },
    users: async (_, __, { prisma }) => {
      return await prisma.user.findMany();
    },
    user: async (_, { id }, { prisma }) => {
      return await prisma.user.findUnique({ where: { id } });
    },
    categories: async (_, __, { prisma }) => {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    },
    category: async (_, { id }, { prisma }) => {
      return await prisma.category.findUnique({ where: { id } });
    },
    posts: async (_, { page = 1, limit = 20, offset = 0 }, { prisma }) => {
      const skip = (page - 1) * limit + offset;
      const posts = await prisma.post.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });
      const totalCount = await prisma.post.count();

      return {
        posts,
        totalCount,
      };
    },
    searchPosts: async (
      _,
      { search, page = 1, limit = 20, offset = 0 },
      { prisma }
    ) => {
      const skip = (page - 1) * limit + offset;

      const searchLower = search.toLowerCase();

      const searchCriteria = {
        OR: [
          { title: { contains: searchLower } },
          { content: { contains: searchLower } },
        ],
      };

      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where: searchCriteria,
          take: limit,
          skip: skip,
          orderBy: { createdAt: "desc" },
        }),
        prisma.post.count({
          where: searchCriteria,
        }),
      ]);
      return {
        posts,
        totalCount,
      };
    },
    postsByCategory: async (
      _,
      { categoryId, page = 1, limit = 20, offset = 0 },
      { prisma }
    ) => {
      const skip = (page - 1) * limit + offset;
      return await prisma.post.findMany({
        where: { categoryId },
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });
    },
    post: async (_, { id }, { prisma }) => {
      return await prisma.post.findUnique({ where: { id } });
    },
    postComments: async (_, { postId }, { prisma }) => {
      return await prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: "desc" },
      });
    },
    commentReplies: async (_, { commentId }, { prisma }) => {
      return await prisma.comment.findMany({
        where: { parentId: commentId },
        orderBy: { createdAt: "asc" },
      });
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

    createCategory: async (_, { name }, context) => {
      try {
        assertAuthenticated(context);

        const existingCategory = await context.prisma.category.findUnique({
          where: { name },
        });

        if (existingCategory) {
          return createSuccessResponse(
            { category: existingCategory },
            "Category already exists"
          );
        }

        const category = await context.prisma.category.create({
          data: { name },
        });

        return createSuccessResponse(
          { category },
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
          { category: updatedCategory },
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
          { category: deletedCategory },
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

        return createSuccessResponse({ comment }, "Reply added successfully");
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

    toggleCommentLike: async (_, { commentId }, context) => {
      try {
        assertAuthenticated(context);

        const comment = await context.prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          return createErrorResponse(ErrorCode.NOT_FOUND, "Comment not found");
        }

        const existingLike = await context.prisma.commentLike.findUnique({
          where: { userId_commentId: { userId: context.user.id, commentId } },
        });
        if (existingLike) {
          const [deletedLike, _] = await context.prisma.$transaction([
            context.prisma.commentLike.delete({
              where: {
                userId_commentId: { userId: context.user.id, commentId },
              },
            }),
            context.prisma.comment.update({
              where: { id: commentId },
              data: { likesCount: { decrement: 1 } },
            }),
          ]);

          return createSuccessResponse(
            { commentLike: null },
            "Comment like removed successfully"
          );
        } else {
          const [newLike, _] = await context.prisma.$transaction([
            context.prisma.commentLike.create({
              data: { userId: context.user.id, commentId },
            }),
            context.prisma.comment.update({
              where: { id: commentId },
              data: { likesCount: { increment: 1 } },
            }),
          ]);

          return createSuccessResponse(
            { commentLike: newLike },
            "Comment liked successfully"
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          return createErrorResponse(
            ErrorCode.UNAUTHENTICATED,
            "You must be logged in to like a comment"
          );
        }
        return handlePrismaError(error);
      }
    },
  },

  User: {
    posts: async ({ id }, _, { prisma }) => {
      return await prisma.post.findMany({ where: { authorId: id } });
    },
    comments: async ({ id }, _, { prisma }) => {
      return await prisma.comment.findMany({
        where: { authorId: id },
      });
    },
    likes: async ({ id }, _, { prisma }) => {
      return await prisma.like.findMany({ where: { userId: id } });
    },
    commentLikes: async ({ id }, _, { prisma }) => {
      return await prisma.commentLike.findMany({
        where: { userId: id },
      });
    },
  },

  Category: {
    posts: async ({ id }, _, { prisma }) => {
      return await prisma.post.findMany({ where: { categoryId: id } });
    },
  },

  Post: {
    author: async ({ authorId }, _, { prisma }) => {
      return await prisma.user.findUniqueOrThrow({
        where: { id: authorId },
      });
    },
    category: async ({ categoryId }, _, { prisma }) => {
      if (!categoryId) return null;
      return await prisma.category.findUniqueOrThrow({
        where: { id: categoryId },
      });
    },
    comments: async ({ id }, _, { prisma }) => {
      return await prisma.comment.findMany({ where: { postId: id } });
    },
    likes: async ({ id }, _, { prisma }) => {
      return await prisma.like.findMany({ where: { postId: id } });
    },
    likesCount: ({ id }, _, { prisma }) =>
      prisma.like.count({ where: { postId: id } }),
  },

  Comment: {
    author: async ({ authorId }, _, { prisma }) => {
      return await prisma.user.findUniqueOrThrow({
        where: { id: authorId },
      });
    },
    post: async ({ postId }, _, { prisma }) => {
      return await prisma.post.findUniqueOrThrow({
        where: { id: postId },
      });
    },
    parent: async ({ parentId }, _, { prisma }) => {
      if (!parentId) return null;
      return await prisma.comment.findUniqueOrThrow({
        where: { id: parentId },
      });
    },
    replies: async ({ id }, _, { prisma }) => {
      return await prisma.comment.findMany({
        where: { parentId: id },
        orderBy: { createdAt: "asc" },
      });
    },
    likes: async ({ id }, _, { prisma }) => {
      return await prisma.commentLike.findMany({
        where: { commentId: id },
      });
    },
    likesCount: ({ likesCount }, _, __) => likesCount,
  },

  Like: {
    user: async ({ userId }, _, { prisma }) => {
      return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
    },
    post: async ({ postId }, _, { prisma }) => {
      return await prisma.post.findUniqueOrThrow({
        where: { id: postId },
      });
    },
  },

  CommentLike: {
    user: async (parent, _, { prisma }) => {
      const userId = (parent as any).userId || (parent as any).user?.id;
      if (!userId) {
        throw new Error("User ID not found in CommentLike");
      }

      return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
    },
    comment: async (parent, _, { prisma }) => {
      const commentId =
        (parent as any).commentId || (parent as any).comment?.id;
      if (!commentId) {
        throw new Error("Comment ID not found in CommentLike");
      }

      return await prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
      });
    },
  },
};
