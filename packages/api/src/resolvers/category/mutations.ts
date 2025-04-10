import type { MutationResolvers } from "../../types/generated";
import { assertAuthenticated } from "../../types/context";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../../utils/errorHandler";

export const categoryMutations: MutationResolvers = {
  createCategory: async (_, { name }, context) => {
    try {
      assertAuthenticated(context);

      const existingCategory = await context.prisma.category.findFirst({
        where: {
          name: {
            equals: name.toLowerCase(),
          },
        },
      });

      if (existingCategory) {
        return createErrorResponse(
          ErrorCode.BAD_USER_INPUT,
          "Category already exists"
        );
      }

      const category = await context.prisma.category.create({
        data: { name },
      });

      return createSuccessResponse({ category });
    } catch (error) {
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

      return createSuccessResponse({ category: updatedCategory });
    } catch (error) {
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

      await context.prisma.category.delete({
        where: { id },
      });

      return createSuccessResponse({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return handlePrismaError(error);
    }
  },
};
