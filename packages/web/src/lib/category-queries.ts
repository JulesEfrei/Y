import { gql } from "@/__generated__";

// GraphQL query for posts by category - with proper typing
export const POSTS_BY_CATEGORY = gql(`
  query PostsByCategory($categoryId: ID!, $page: Int, $limit: Int) {
    postsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {
      posts {
        id
        title
        createdAt
        likesCount
        category {
          name
        }
        author {
          id
          name
        }
      }
      totalCount
    }
  }
`);
