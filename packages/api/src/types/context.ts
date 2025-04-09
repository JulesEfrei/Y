import { PrismaClient } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";

export interface Context {
  prisma: PrismaClient;
  user?: JwtPayload & { id: string };
}

export interface AuthContext extends Context {
  user: JwtPayload & { id: string };
}

export function assertAuthenticated(
  context: Context
): asserts context is AuthContext {
  if (!context.user) {
    throw new Error("Not authenticated");
  }
}

// This function can be used in resolvers to handle authentication errors
// in a way that's consistent with our error handling system
export function withAuth<T>(
  context: Context,
  callback: (ctx: AuthContext) => Promise<T>
) {
  try {
    assertAuthenticated(context);
    return callback(context as AuthContext);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      throw error; // Let the resolver handle this specific error
    }
    throw error; // Re-throw other errors
  }
}
