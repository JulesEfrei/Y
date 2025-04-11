# Web Package - Next.js Frontend

## Overview

The Web package is a modern frontend application built with Next.js and Apollo Client. It provides the user interface for the Y application, connecting to the GraphQL API to fetch and manipulate data.

## Tech Stack

- **Next.js**: React framework for production
- **React**: UI library (v19)
- **Apollo Client**: GraphQL client for data fetching
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Radix UI**: Accessible UI components
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## Installation

From the root of the monorepo:

```bash
bun install
```

Or from this package directory:

```bash
cd packages/web
bun install
```

## Usage

### Development Mode

To run the web application in development mode with hot reloading:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

To build the application for production:

```bash
bun run build
```

### Start Production Server

To start the production server:

```bash
bun run start
```

### GraphQL Code Generation

To generate TypeScript types from GraphQL operations:

```bash
bun run codegen
```

## Project Structure

```
web/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app router
│   ├── components/  # Reusable UI components
│   ├── lib/         # Utility functions and hooks
│   ├── graphql/     # GraphQL operations and types
│   └── styles/      # Global styles
├── apollo-client.ts # Apollo Client configuration
├── codegen.ts       # GraphQL code generation config
└── package.json     # Web package dependencies
```

## Features

### Core Features

- [x] **Modern UI**: Clean and responsive user interface
- [x] **GraphQL Integration**: Apollo Client for data fetching
- [x] **Authentication**: JWT-based authentication with secure storage
- [x] **Type Safety**: Full TypeScript support
- [x] **Component Library**: Reusable UI components with Radix UI
- [x] **Form Handling**: Efficient form management with React Hook Form and Zod
- [x] **Theming**: Light and dark mode support with next-themes
- [x] **Code Generation**: Automatic TypeScript type generation from GraphQL operations

### User Interface

- [x] **Authentication Screens**
  - [x] Login and registration forms
  - [x] Password recovery
  - [x] Profile management
- [x] **Content Creation**
  - [x] Post editor with rich text formatting
  - [x] Media upload and embedding
  - [x] Draft saving and publishing
- [x] **Social Features**
  - [x] Interactive feed with infinite scrolling
  - [x] Comment threads and replies
  - [x] Like and share functionality
- [x] **Discovery**
  - [x] Search interface
  - [x] Trending content section
  - [x] User recommendations
