import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  generates: {
    "./src/types/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "./context#Context",
        mappers: {
          User: "@prisma/client#User",
          Category: "@prisma/client#Category",
          Post: "@prisma/client#Post",
          Comment: "@prisma/client#Comment",
          Like: "@prisma/client#Like",
          CommentLike: "@prisma/client#CommentLike",
        },
      },
    },
  },
};

export default config;
