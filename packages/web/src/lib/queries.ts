import { gql } from "@/__generated__";

// GraphQL query with pagination
export const GET_POSTS = gql(`
  query Posts($page: Int, $limit: Int) {
    posts(page: $page, limit: $limit) {
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
        likesCount
        author {
          name
        }
        likes {
          user {
            id
          }
        }
        parent {
          id
        }
        replies {
          id
          content
          createdAt
          likesCount
          author {
            name
          }
          likes {
            user {
              id
            }
          }
        }
      }
    }
  }
`);

// GraphQL mutation for creating a post
export const CREATE_POST = gql(`
  mutation CreatePost($title: String!, $content: String!, $categoryName: String) {
    createPost(title: $title, content: $content, categoryName: $categoryName) {
      code
      success
      message
      post {
        id
        title
        category {
          name
        }
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
  mutation UpdatePost($id: ID!, $title: String, $content: String, $categoryName: String) {
    updatePost(id: $id, title: $title, content: $content, categoryName: $categoryName) {
      code
      success
      message
      post {
        id
        title
        content
        category {
          id
          name
        }
      }
    }
  }
`);

// GraphQL query for getting all categories
export const GET_CATEGORIES = gql(`
  query Categories {
    categories {
      id
      name
    }
  }
`);

// GraphQL query for searching posts
export const SEARCH_POSTS = gql(`
  query SearchPosts($search: String!, $page: Int, $limit: Int) {
    searchPosts(search: $search, page: $page, limit: $limit) {
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

// GraphQL query for posts by category
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

// GraphQL query for posts by user
export const POSTS_BY_USER = gql(`
  query PostsByUser($userId: ID!, $page: Int, $limit: Int) {
    postsByUser(userId: $userId, page: $page, limit: $limit) {
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

// GraphQL mutation for toggling comment like
export const TOGGLE_COMMENT_LIKE = gql(`
  mutation ToggleCommentLike($commentId: ID!) {
    toggleCommentLike(commentId: $commentId) {
      code
      success
      message
    }
  }
`);

// GraphQL mutation for replying to a comment
export const REPLY_TO_COMMENT = gql(`
  mutation ReplyToComment($commentId: ID!, $content: String!) {
    replyToComment(commentId: $commentId, content: $content) {
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
        parent {
          id
        }
      }
    }
  }
`);

// Query for current user
export const GET_CURRENT_USER = gql(`
  query Me {
    me {
      id
      name
      email
    }
  }
`);

// GraphQL mutation for signout
export const SIGN_OUT_MUTATION = gql(`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`);

// Add this to your existing queries
export const GET_POPULAR_POSTS = gql(`
  query GetPopularPosts($page: Int, $limit: Int) {
    popularPosts(page: $page, limit: $limit) {
      posts {
        id
        title
        content
        createdAt
        likesCount
        author {
          id
          name
        }
        category {
          id
          name
        }
      }
      totalCount
    }
  }
`);

// GraphQL mutation for deleting a post
export const DELETE_POST = gql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      code
      success
      message
      post {
        id
      }
    }
  }
`);
