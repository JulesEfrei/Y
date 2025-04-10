import { gql } from "@/__generated__";

// GraphQL query with pagination
export const GET_POSTS = gql(`
  query Posts($page: Int, $limit: Int) {
    posts(page: $page, limit: $limit) {
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
  }
`);

// Graphql query for getting post by id
export const GET_POST = gql(`
  query Post($postId: ID!) {
    post(id: $postId) {
      id
      title
      content
      createdAt
      likesCount
      category {
        name
      }
      author {
        id
        name
      }
      likes {
        user {
          id
        }
      }
      comments {
        id
        content
        createdAt
        author {
          name
        }
      }
    }
  }
`);

// GraphQL mutation for creating a post
export const CREATE_POST = gql(`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      code
      success
      message
      post {
        id
        title
      }
    }
  }
`);

// GraphQL mutation for creating a comment
export const COMMENT_POST = gql(`
  mutation CommentPost($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      code
      success
      message
      comment {
        id
        content
        createdAt
        author {
          name
        }
      }
    }
  }
  `);

// GraphQL mutation for toggling like
export const TOGGLE_LIKE = gql(`
  mutation ToggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      code
      success
      message
    }
  }
`);

// GraphQL mutation for sign in
export const SIGN_IN = gql(`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      code
      success
      message
      token
      user {
        id
        name
        email
      }
    }
  }
`);

// GraphQL mutation for user registration
export const SIGN_UP = gql(`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      code
      success
      message
      token
    }
  }
`);

// GraphQL mutation for updating a post
export const UPDATE_POST = gql(`
  mutation UpdatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      code
      success
      message
      post {
        id
        title
        content
      }
    }
  }
`);
