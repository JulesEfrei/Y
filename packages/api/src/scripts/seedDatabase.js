const { PrismaClient } = require("@prisma/client");
const fixtureData = require("./fixtures/data");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Seed users
  console.log("Seeding users...");
  for (const user of fixtureData.users) {
    await prisma.user.create({
      data: user,
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
