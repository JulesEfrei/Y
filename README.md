# Y - GraphQL Monorepo Project

## Project Overview

Y is a modern full-stack GraphQL application built as a monorepo using Bun as the JavaScript runtime. The project consists of two main packages:

- **API**: A GraphQL server built with Apollo Server and Prisma
- **Web**: A Next.js frontend application with Apollo Client

## Tech Stack

### Global

- **Bun**: Fast JavaScript runtime and package manager
- **TypeScript**: Type-safe JavaScript
- **GraphQL**: API query language
- **Workspaces**: Monorepo structure for managing multiple packages

## Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

This will install dependencies for all packages in the monorepo.

## Usage

### Development

To run all packages in development mode:

```bash
bun run dev
```

This will start both the API server and the web application in development mode with hot reloading.
You can connect with the following demo account:

- **Email**: demo@y.com
- **Password**: demodemo

### GraphQL Code Generation

To generate TypeScript types from GraphQL schema:

```bash
bun run codegen
```

## Project Structure

```
Y/
├── packages/
│   ├── api/                 # GraphQL server package
│   │   ├── prisma/          # Database schema and migrations
│   │   ├── src/             # Server source code
│   │   ├── codegen.ts       # GraphQL code generation config
│   │   ├── index.ts         # Server entry point
│   │   └── package.json     # API package dependencies
│   │
│   └── web/                 # Next.js frontend package
│       ├── public/          # Static assets
│       ├── src/             # Frontend source code
│       ├── apollo-client.ts # Apollo Client configuration
│       ├── codegen.ts       # GraphQL code generation config
│       └── package.json     # Web package dependencies
│
├── package.json            # Root package.json for workspaces
├── tsconfig.json           # Base TypeScript configuration
└── README.md               # Project documentation
```

## Features

### Core Infrastructure

- [x] **Monorepo Structure**: Efficient code sharing and management between packages
- [x] **Type Safety**: Full TypeScript support across the entire application
- [x] **GraphQL API**: Strongly typed API with code generation
- [x] **Modern Frontend**: Next.js with React 19 and Tailwind CSS
- [x] **Authentication**: JWT-based authentication system
- [x] **Database Integration**: Prisma ORM for database operations

### User Features

- [x] **User Management**
  - [x] User registration and authentication
  - [x] Profile creation and customization
  - [x] Follow/unfollow other users

### Content Features

- [x] **Posts**
  - [x] Create, edit, and delete posts
  - [x] Rich text formatting and media embedding
  - [x] Post visibility controls (public/private)

### Engagement Features

- [x] **Interactions**
  - [x] Like/unlike posts
  - [x] Comment on posts
  - [x] Reply to comments
  - [x] Share posts

### Discovery Features

- [x] **Content Discovery**
  - [x] Personalized feed based on interests and connections
  - [x] Search functionality for users and content
  - [x] Trending topics and hashtags

## Packages

- [API Package](./packages/api/README.md): GraphQL server with Apollo and Prisma
- [Web Package](./packages/web/README.md): Next.js frontend application

Refer to each package's README for more specific information.
