const { v4: uuidv4 } = require("uuid");

// Fixture data for testing
const users = [
  {
    id: uuidv4(),
    username: "john_doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    username: "jane_smith",
    email: "jane@example.com",
    password: "password456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    username: "bob_johnson",
    email: "bob@example.com",
    password: "password789",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const posts = [
  {
    id: uuidv4(),
    title: "Getting Started with GraphQL",
    content:
      "GraphQL is a query language for your API, and a server-side runtime for executing queries...",
    authorId: users[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "React Hooks Tutorial",
    content:
      "Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class...",
    authorId: users[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Node.js Best Practices",
    content:
      "Here are some best practices for building scalable Node.js applications...",
    authorId: users[1].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Introduction to TypeScript",
    content:
      "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...",
    authorId: users[2].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const comments = [
  {
    id: uuidv4(),
    content: "Great article! Very helpful.",
    authorId: users[1].id,
    postId: posts[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "I have a question about this approach...",
    authorId: users[2].id,
    postId: posts[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Thanks for sharing this information!",
    authorId: users[0].id,
    postId: posts[2].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "I found this very useful for my project.",
    authorId: users[1].id,
    postId: posts[3].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

module.exports = {
  users,
  posts,
  comments,
};
