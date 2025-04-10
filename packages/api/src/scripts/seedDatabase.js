import { PrismaClient } from "@prisma/client";
import fixtureData from "./fixtures/data.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean existing database
  console.log("Cleaning existing database...");

  // Delete in reverse order to avoid foreign key constraints
  console.log("Deleting comment likes...");
  await prisma.commentLike.deleteMany({});

  console.log("Deleting likes...");
  await prisma.like.deleteMany({});

  console.log("Deleting comments...");
  await prisma.comment.deleteMany({});

  console.log("Deleting posts...");
  await prisma.post.deleteMany({});

  console.log("Deleting categories...");
  await prisma.category.deleteMany({});

  console.log("Deleting users...");
  await prisma.user.deleteMany({});

  // Seed users
  console.log("Seeding users...");
  for (const user of fixtureData.users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Seed categories
  console.log("Seeding categories...");
  for (const category of fixtureData.categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Seed posts
  console.log("Seeding posts...");
  for (const post of fixtureData.posts) {
    await prisma.post.create({
      data: post,
    });
  }

  // Seed comments
  console.log("Seeding comments...");
  for (const comment of fixtureData.comments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  // Seed likes
  console.log("Seeding likes...");
  for (const like of fixtureData.likes) {
    await prisma.like.create({
      data: like,
    });
  }

  // Seed comment likes
  console.log("Seeding comment likes...");
  for (const commentLike of fixtureData.commentLikes) {
    await prisma.commentLike.create({
      data: commentLike,
    });
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
