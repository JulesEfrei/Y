import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  await prisma.commentLike.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared. Creating new data...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demodemo", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@y.com",
      name: "demo",
      password: hashedPassword,
    },
  });
  console.log(`Created demo user: ${demoUser.name} (${demoUser.email})`);

  // Create additional users
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
      password: await bcrypt.hash("password123", 10),
    },
  });

  console.log(`Created additional users: ${user1.name}, ${user2.name}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Technology" },
    }),
    prisma.category.create({
      data: { name: "Science" },
    }),
    prisma.category.create({
      data: { name: "Art" },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create more categories
  const additionalCategories = await Promise.all([
    prisma.category.create({
      data: { name: "Business" },
    }),
    prisma.category.create({
      data: { name: "Health" },
    }),
    prisma.category.create({
      data: { name: "Education" },
    }),
  ]);

  console.log(`Created ${additionalCategories.length} additional categories`);

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with GraphQL",
      content:
        "GraphQL is a query language for your API, and a server-side runtime for executing queries.",
      authorId: demoUser.id,
      categoryId: categories[0].id, // Technology
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "The Future of AI",
      content:
        "Artificial Intelligence is transforming how we interact with technology.",
      authorId: user1.id,
      categoryId: categories[0].id, // Technology
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Latest Scientific Discoveries",
      content:
        "Recent breakthroughs in quantum physics are changing our understanding of the universe.",
      authorId: user2.id,
      categoryId: categories[1].id, // Science
    },
  });

  console.log(`Created ${3} posts`);

  // Create more posts
  const post4 = await prisma.post.create({
    data: {
      title: "The Importance of Mental Health",
      content:
        "Mental health is just as important as physical health for overall well-being.",
      authorId: demoUser.id,
      categoryId: additionalCategories[1].id, // Health
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: "Starting Your Own Business",
      content:
        "Entrepreneurship requires dedication, planning, and a willingness to take risks.",
      authorId: user1.id,
      categoryId: additionalCategories[0].id, // Business
    },
  });

  const post6 = await prisma.post.create({
    data: {
      title: "Online Learning Trends",
      content:
        "The rise of online education is transforming traditional learning methods.",
      authorId: user2.id,
      categoryId: additionalCategories[2].id, // Education
    },
  });

  console.log(`Created ${3} additional posts`);

  // Create comments
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great introduction to GraphQL!",
      authorId: user1.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "I found this very helpful.",
      authorId: user2.id,
      postId: post1.id,
    },
  });

  // Create a reply to a comment
  const reply1 = await prisma.comment.create({
    data: {
      content: "Thanks for your feedback!",
      authorId: demoUser.id,
      postId: post1.id,
      parentId: comment1.id,
    },
  });

  console.log(`Created ${3} comments (including 1 reply)`);

  // Create more comments
  const comment3 = await prisma.comment.create({
    data: {
      content: "This is an important topic that needs more attention.",
      authorId: demoUser.id,
      postId: post4.id,
    },
  });

  const comment4 = await prisma.comment.create({
    data: {
      content: "Great advice for aspiring entrepreneurs!",
      authorId: user2.id,
      postId: post5.id,
    },
  });

  const comment5 = await prisma.comment.create({
    data: {
      content: "Online learning has been a game changer for me.",
      authorId: user1.id,
      postId: post6.id,
    },
  });

  console.log(`Created ${3} additional comments`);

  // Create likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: demoUser.id,
      postId: post2.id,
    },
  });

  console.log(`Created ${3} post likes`);

  // Create more likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post4.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post5.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: demoUser.id,
      postId: post6.id,
    },
  });

  console.log(`Created ${3} additional post likes`);

  // Create comment likes
  await prisma.commentLike.create({
    data: {
      userId: demoUser.id,
      commentId: comment1.id,
    },
  });

  await prisma.commentLike.create({
    data: {
      userId: user1.id,
      commentId: comment2.id,
    },
  });

  console.log(`Created ${2} comment likes`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
