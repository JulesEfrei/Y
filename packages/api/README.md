# API Package - GraphQL Server

## Overview

The API package is a GraphQL server built with Apollo Server and Prisma. It provides the backend services for the Y application, handling data persistence, business logic, and API endpoints.

## Tech Stack

- **Apollo Server**: GraphQL server framework
- **Prisma**: Next-generation ORM for database access
- **Express**: Web server framework
- **TypeScript**: Type-safe JavaScript
- **JWT**: Authentication and authorization
- **Bun**: JavaScript runtime

## Installation

From the root of the monorepo:

```bash
bun install
```

Or from this package directory:

```bash
cd packages/api
bun install
```

## Usage

### Development Mode

To run the API server in development mode with hot reloading:

```bash
bun run dev
```

### GraphQL Code Generation

To generate TypeScript types from the GraphQL schema:

```bash
bun run codegen
```

## Project Structure

```
api/
├── prisma/          # Database schema and migrations
├── src/             # Server source code
│   ├── resolvers/   # GraphQL resolvers
│   ├── schema/      # GraphQL schema definitions
│   ├── models/      # Data models
│   ├── utils/       # Utility functions
│   └── middleware/  # Express middleware
├── codegen.ts       # GraphQL code generation config
├── index.ts         # Server entry point
└── package.json     # API package dependencies
```

## Features

### Core Features

- [x] **GraphQL API**: Strongly typed API with Apollo Server
- [x] **Database Integration**: Prisma ORM for database operations
- [x] **Authentication**: JWT-based authentication system
- [x] **Type Safety**: Full TypeScript support
- [x] **Hot Reloading**: Automatic server restart on code changes
- [x] **Code Generation**: Automatic TypeScript type generation from GraphQL schema

### API Endpoints

- [x] **User Management**
  - [x] User registration and login
  - [x] Profile management
  - [x] User relationships (follow/unfollow)
- [x] **Content Management**
  - [x] Post creation, editing, and deletion
  - [x] Comment management
  - [x] Like functionality
- [x] **Data Queries**
  - [x] Feed generation
  - [x] Search functionality
  - [x] Content filtering
