import { Prisma } from "@prisma/client";

export enum ErrorCode {
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,

  BAD_USER_INPUT = 400,

  NOT_FOUND = 404,
  ALREADY_EXISTS = 409,

  INTERNAL_SERVER_ERROR = 500,
}

export interface ErrorResponse {
  code: number;
  success: boolean;
  message: string;
}

export function createErrorResponse(
  code: ErrorCode,
  message: string
): ErrorResponse {
  return {
    code,
    success: false,
    message,
  };
}

export function createSuccessResponse<T>(
  data: T,
  message = "Operation successful"
): T & ErrorResponse {
  return {
    ...data,
    code: 200,
    success: true,
    message,
  };
}

export function handlePrismaError(error: unknown): ErrorResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (error.code === "P2002") {
      console.log("HIT");

      const field = (error.meta?.target as string[]) || ["field"];
      return createErrorResponse(
        ErrorCode.ALREADY_EXISTS,
        `${field.join(", ")} already exists.`
      );
    }

    // Handle foreign key constraint violations
    if (error.code === "P2003") {
      return createErrorResponse(
        ErrorCode.BAD_USER_INPUT,
        "Related record not found."
      );
    }

    // Handle record not found
    if (error.code === "P2001" || error.code === "P2018") {
      return createErrorResponse(ErrorCode.NOT_FOUND, "Record not found.");
    }
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return createErrorResponse(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message || "An unexpected error occurred"
    );
  }

  return createErrorResponse(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred"
  );
}
