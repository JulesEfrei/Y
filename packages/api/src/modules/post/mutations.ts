import type { MutationResolvers } from "../../types/generated";
import { assertAuthenticated } from "../../types/context";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../../utils/errorHandler";

export const postMutations: MutationResolvers = {
  createPost: async (_, { title, content, categoryName }, context) => {
    try {
      assertAuthenticated(context);

      const postData: any = {
        title,
        content,
        author: {
          connect: { id: context.user.id },
        },
      };

      if (categoryName) {
        try {
          // Normaliser le nom de la catégorie (trim et lowercase)
          const normalizedCategoryName = categoryName.trim().toLowerCase();

          // Rechercher la catégorie de manière plus robuste
          let category = await context.prisma.category.findFirst({
            where: {
              name: {
                equals: normalizedCategoryName,
              },
            },
          });

          if (!category) {
            try {
              category = await context.prisma.category.create({
                data: { name: normalizedCategoryName },
              });
            } catch (categoryError: any) {
              if (categoryError.code === "P2002") {
                category = await context.prisma.category.findFirst({
                  where: {
                    name: {
                      equals: normalizedCategoryName,
                    },
                  },
                });

                // Si on ne trouve toujours pas la catégorie, propager l'erreur
                if (!category) {
                  throw categoryError;
                }
              } else {
                // Pour toute autre erreur, la propager
                throw categoryError;
              }
            }
          }

          // Connecter le post à la catégorie
          postData.category = {
            connect: { id: category.id },
          };
        } catch (error) {
          // En cas d'erreur dans la gestion de la catégorie, créer le post sans catégorie
          console.error("Erreur lors de la gestion de la catégorie:", error);
        }
      }

      const post = await context.prisma.post.create({
        data: postData,
        include: {
          category: true,
        },
      });

      return createSuccessResponse({ post });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  updatePost: async (_, { id, title, content, categoryName }, context) => {
    try {
      assertAuthenticated(context);

      const existingPost = await context.prisma.post.findUnique({
        where: { id },
        include: { author: true, category: true },
      });

      if (!existingPost) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Post not found");
      }

      if (existingPost.author.id !== context.user.id) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "You can only update your own posts"
        );
      }

      const updateData: any = {};

      if (title !== undefined) {
        updateData.title = title;
      }

      if (content !== undefined) {
        updateData.content = content;
      }
      if (categoryName !== undefined) {
        if (categoryName === null || categoryName === "") {
          updateData.category = { disconnect: true };
        } else {
          const currentCategoryName =
            existingPost.category?.name?.toLowerCase();
          const newCategoryName = categoryName.toLowerCase();

          if (currentCategoryName !== newCategoryName) {
            let category = await context.prisma.category.findFirst({
              where: { name: { equals: newCategoryName } },
            });

            if (!category) {
              category = await context.prisma.category.create({
                data: { name: categoryName },
              });
            }
            updateData.category = { connect: { id: category.id } };
          }
        }
      }

      const updatedPost = await context.prisma.post.update({
        where: { id },
        data: updateData,
        include: { category: true },
      });

      return createSuccessResponse({ post: updatedPost });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  toggleLike: async (_, { postId }, context) => {
    try {
      assertAuthenticated(context);

      const post = await context.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Post not found");
      }

      const existingLike = await context.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: context.user.id,
            postId,
          },
        },
      });

      if (existingLike) {
        await context.prisma.like.delete({
          where: {
            userId_postId: {
              userId: context.user.id,
              postId,
            },
          },
        });
        return createSuccessResponse({ message: "Post unliked successfully" });
      } else {
        await context.prisma.like.create({
          data: {
            user: { connect: { id: context.user.id } },
            post: { connect: { id: postId } },
          },
        });
        return createSuccessResponse({ message: "Post liked successfully" });
      }
    } catch (error) {
      return handlePrismaError(error);
    }
  },
};
