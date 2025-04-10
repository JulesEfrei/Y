/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Categories {\n    categories {\n      id\n      name\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      code\n      success\n      message\n      category {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $categoryName: String\n  ) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n": typeof types.CreatePostDocument,
    "\n  mutation SignOut {\n    signOut {\n      success\n      message\n    }\n  }\n": typeof types.SignOutDocument,
    "\n  query PostsByCategory($categoryId: ID!, $page: Int, $limit: Int) {\n    postsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.PostsByCategoryDocument,
    "\n  query Posts($page: Int, $limit: Int) {\n    posts(page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.PostsDocument,
    "\n  query Post($postId: ID!) {\n    post(id: $postId) {\n      id\n      title\n      content\n      createdAt\n      likesCount\n      category {\n        name\n      }\n      author {\n        id\n        name\n      }\n      likes {\n        user {\n          id\n        }\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n": typeof types.PostDocument,
    "\n  mutation CreatePost($title: String!, $content: String!, $categoryName: String) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n": typeof types.CreatePostDocument,
    "\n  mutation CommentPost($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      code\n      success\n      message\n      comment {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n  ": typeof types.CommentPostDocument,
    "\n  mutation ToggleLike($postId: ID!) {\n    toggleLike(postId: $postId) {\n      code\n      success\n      message\n    }\n  }\n": typeof types.ToggleLikeDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      code\n      success\n      message\n      token\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp($name: String!, $email: String!, $password: String!) {\n    signUp(name: $name, email: $email, password: $password) {\n      code\n      success\n      message\n      token\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation UpdatePost($id: ID!, $title: String, $content: String, $categoryName: String) {\n    updatePost(id: $id, title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        content\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.UpdatePostDocument,
    "\n  query SearchPosts($search: String!, $page: Int, $limit: Int) {\n    searchPosts(search: $search, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.SearchPostsDocument,
};
const documents: Documents = {
    "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n": types.MeDocument,
    "\n  query Categories {\n    categories {\n      id\n      name\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      code\n      success\n      message\n      category {\n        id\n        name\n      }\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $categoryName: String\n  ) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation SignOut {\n    signOut {\n      success\n      message\n    }\n  }\n": types.SignOutDocument,
    "\n  query PostsByCategory($categoryId: ID!, $page: Int, $limit: Int) {\n    postsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": types.PostsByCategoryDocument,
    "\n  query Posts($page: Int, $limit: Int) {\n    posts(page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": types.PostsDocument,
    "\n  query Post($postId: ID!) {\n    post(id: $postId) {\n      id\n      title\n      content\n      createdAt\n      likesCount\n      category {\n        name\n      }\n      author {\n        id\n        name\n      }\n      likes {\n        user {\n          id\n        }\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n": types.PostDocument,
    "\n  mutation CreatePost($title: String!, $content: String!, $categoryName: String) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation CommentPost($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      code\n      success\n      message\n      comment {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n  ": types.CommentPostDocument,
    "\n  mutation ToggleLike($postId: ID!) {\n    toggleLike(postId: $postId) {\n      code\n      success\n      message\n    }\n  }\n": types.ToggleLikeDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      code\n      success\n      message\n      token\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp($name: String!, $email: String!, $password: String!) {\n    signUp(name: $name, email: $email, password: $password) {\n      code\n      success\n      message\n      token\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation UpdatePost($id: ID!, $title: String, $content: String, $categoryName: String) {\n    updatePost(id: $id, title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        content\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.UpdatePostDocument,
    "\n  query SearchPosts($search: String!, $page: Int, $limit: Int) {\n    searchPosts(search: $search, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n": types.SearchPostsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Categories {\n    categories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query Categories {\n    categories {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      code\n      success\n      message\n      category {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      code\n      success\n      message\n      category {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $categoryName: String\n  ) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $categoryName: String\n  ) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignOut {\n    signOut {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation SignOut {\n    signOut {\n      success\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PostsByCategory($categoryId: ID!, $page: Int, $limit: Int) {\n    postsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query PostsByCategory($categoryId: ID!, $page: Int, $limit: Int) {\n    postsByCategory(categoryId: $categoryId, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Posts($page: Int, $limit: Int) {\n    posts(page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query Posts($page: Int, $limit: Int) {\n    posts(page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Post($postId: ID!) {\n    post(id: $postId) {\n      id\n      title\n      content\n      createdAt\n      likesCount\n      category {\n        name\n      }\n      author {\n        id\n        name\n      }\n      likes {\n        user {\n          id\n        }\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Post($postId: ID!) {\n    post(id: $postId) {\n      id\n      title\n      content\n      createdAt\n      likesCount\n      category {\n        name\n      }\n      author {\n        id\n        name\n      }\n      likes {\n        user {\n          id\n        }\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePost($title: String!, $content: String!, $categoryName: String) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($title: String!, $content: String!, $categoryName: String) {\n    createPost(title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        category {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CommentPost($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      code\n      success\n      message\n      comment {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n  "): (typeof documents)["\n  mutation CommentPost($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      code\n      success\n      message\n      comment {\n        id\n        content\n        createdAt\n        author {\n          name\n        }\n      }\n    }\n  }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ToggleLike($postId: ID!) {\n    toggleLike(postId: $postId) {\n      code\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleLike($postId: ID!) {\n    toggleLike(postId: $postId) {\n      code\n      success\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      code\n      success\n      message\n      token\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      code\n      success\n      message\n      token\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp($name: String!, $email: String!, $password: String!) {\n    signUp(name: $name, email: $email, password: $password) {\n      code\n      success\n      message\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($name: String!, $email: String!, $password: String!) {\n    signUp(name: $name, email: $email, password: $password) {\n      code\n      success\n      message\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePost($id: ID!, $title: String, $content: String, $categoryName: String) {\n    updatePost(id: $id, title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        content\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePost($id: ID!, $title: String, $content: String, $categoryName: String) {\n    updatePost(id: $id, title: $title, content: $content, categoryName: $categoryName) {\n      code\n      success\n      message\n      post {\n        id\n        title\n        content\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SearchPosts($search: String!, $page: Int, $limit: Int) {\n    searchPosts(search: $search, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query SearchPosts($search: String!, $page: Int, $limit: Int) {\n    searchPosts(search: $search, page: $page, limit: $limit) {\n      posts {\n        id\n        title\n        createdAt\n        likesCount\n        category {\n          name\n        }\n        author {\n          id\n          name\n        }\n      }\n      totalCount\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;