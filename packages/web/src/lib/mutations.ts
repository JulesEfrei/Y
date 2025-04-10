import { gql } from "@/__generated__";

// GraphQL mutation for creating a category
export const CREATE_CATEGORY = gql(`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      code
      success
      message
      category {
        id
        name
      }
    }
  }
`);
