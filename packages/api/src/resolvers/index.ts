import type { Resolvers } from "../types/generated";

// Import all modular resolvers
import { userQueries, userMutations, userTypeResolvers } from "./user";
import {
  categoryQueries,
  categoryMutations,
  categoryTypeResolvers,
} from "./category";
import { postQueries, postMutations, postTypeResolvers } from "./post";
import {
  commentQueries,
  commentMutations,
  commentTypeResolvers,
} from "./comment";
import { likeTypeResolvers, commentLikeTypeResolvers } from "./like";

/**
 * Main resolvers object that combines all modular resolvers
 */
export const resolvers: Resolvers = {
  Query: {
    ...userQueries,
    ...categoryQueries,
    ...postQueries,
    ...commentQueries,
  },

  Mutation: {
    ...userMutations,
    ...categoryMutations,
    ...postMutations,
    ...commentMutations,
  },

  User: userTypeResolvers,
  Category: categoryTypeResolvers,
  Post: postTypeResolvers,
  Comment: commentTypeResolvers,
  Like: likeTypeResolvers,
  CommentLike: commentLikeTypeResolvers,
};
