import type { MutationResolvers } from "../../types/generated";
import { comparePasswords, generateToken, hashPassword } from "../../utils/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handlePrismaError,
  ErrorCode,
} from "../../utils/errorHandler";

// Fonction helper pour définir le cookie d'authentification
const setAuthCookie = (res: any, token: string) => {
  if (!res) return;
  
  // Définir le cookie avec une expiration et des options de sécurité
  const cookieOptions = [
    'auth_token=' + token,
    'Max-Age=' + (60 * 60 * 24 * 7), // 7 jours
    'Path=/',
    'HttpOnly', // Empêche l'accès via JavaScript côté client
    'SameSite=Strict', // Protection CSRF
  ];
  
  // Ajouter Secure en production
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.push('Secure');
  }
  
  res.setHeader('Set-Cookie', cookieOptions.join('; '));
};

export const userMutations: MutationResolvers = {
  signUp: async (_, { email, password, name }, context) => {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await context.prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      const token = generateToken(user.id);
      
      // Définir le cookie d'authentification
      setAuthCookie(context.res, token);
      
      return createSuccessResponse({ token, user });
    } catch (error) {
      return handlePrismaError(error);
    }
  },

  signIn: async (_, { email, password }, context) => {
    try {
      const user = await context.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return createErrorResponse(
          ErrorCode.UNAUTHENTICATED,
          "Invalid email or password"
        );
      }

      const passwordMatch = await comparePasswords(password, user.password);
      if (!passwordMatch) {
        return createErrorResponse(
          ErrorCode.UNAUTHENTICATED,
          "Invalid email or password"
        );
      }

      const token = generateToken(user.id);
      
      // Définir le cookie d'authentification
      setAuthCookie(context.res, token);
      
      return createSuccessResponse({ token, user });
    } catch (error) {
      return handlePrismaError(error);
    }
  },
  
  signOut: async (_: any, __: any, context: any) => {
    try {
      // Si l'utilisateur est connecté, effacer le cookie
      if (context.res) {
        context.res.setHeader('Set-Cookie', [
          'auth_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict'
        ]);
      }
      
      return createSuccessResponse({ message: "Successfully signed out" });
    } catch (error) {
      return handlePrismaError(error);
    }
  },
};
