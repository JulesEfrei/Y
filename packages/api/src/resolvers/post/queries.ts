import type { QueryResolvers } from "../../types/generated";
import { formatDates, formatPrismaResults } from "../utils/formatters";

export const postQueries: QueryResolvers = {
  posts: async (_, { page = 1, limit = 20, offset = 0 }, { prisma }) => {
    const skip = (page - 1) * limit + offset;
    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    return formatPrismaResults(posts);
  },

  searchPosts: async (
    _,
    { search, page = 1, limit = 20, offset = 0 },
    { prisma }
  ) => {
    const skip = (page - 1) * limit + offset;

    const searchLower = search.toLowerCase();

    const searchCriteria = {
      OR: [
        { title: { contains: searchLower } },
        { content: { contains: searchLower } },
      ],
    };

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: searchCriteria,
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({
        where: searchCriteria,
      }),
    ]);

    return {
      posts: formatPrismaResults(posts),
      totalCount,
    };
  },

  postsByCategory: async (
    _,
    { categoryId, page = 1, limit = 20, offset = 0 },
    { prisma }
  ) => {
    const skip = (page - 1) * limit + offset;
    const posts = await prisma.post.findMany({
      where: { categoryId },
      take: limit,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    return formatPrismaResults(posts);
  },

  popularPosts: async (_, { page = 1, limit = 20, offset = 0 }, { prisma }) => {
    const skip = (page - 1) * limit + offset;

    const postsWithLikes = await prisma.post.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    const sortedPosts = postsWithLikes
      .sort((a, b) => b._count.likes - a._count.likes)
      .slice(skip, skip + limit);

    const totalCount = postsWithLikes.length;

    return {
      posts: formatPrismaResults(sortedPosts),
      totalCount,
    };
  },

  post: async (_, { id }, { prisma }) => {
    const post = await prisma.post.findUnique({ where: { id } });
    return formatDates(post);
  },
};
