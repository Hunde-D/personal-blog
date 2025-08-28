import { PrismaClient } from "@prisma/client";
import slug from "slug";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  const me = await prisma.user.findUnique({
    where: { email: "user@example.com" },
  });

  if (!me) {
    throw new Error("❌ User not found in DB");
  }

  // 2. Blog posts
  const posts = [
    {
      title: "About Me - Hunde’s Developer Journey",
      excerpt:
        "Learn more about my journey as a full-stack developer with a passion for React, Next.js, Flutter, and clean architecture.",
      content: `
Hi, I'm Hunde! I'm a passionate full-stack developer working with React, Next.js, Vue, Express, and Flutter.
I enjoy building modern, scalable applications while exploring clean architecture and best practices.
Outside coding, I love exploring new technologies and documenting my learning journey to help others.
      `,
    },
    {
      title: "Frontend vs Backend: My Perspective",
      excerpt:
        "Exploring frontend frameworks like React, Next.js, Vue, and backend tools like Express and Prisma.",
      content: `
When working on projects, I often switch between frontend (React, Next.js, Vue) and backend (Express, Prisma, Supabase).
Each side comes with its own challenges — frontend focuses on UI/UX while backend ensures data consistency and performance.
Combining both is what makes full-stack development exciting for me.
      `,
    },
    {
      title: "Clean Architecture in Flutter",
      excerpt: "How I structure my Flutter apps for scalability and testing.",
      content: `
Clean architecture in Flutter has helped me separate UI, state management, and business logic.
This makes testing easier and keeps the app flexible for future changes. In my habit-tracking app, I used this approach
for features like custom habits, mood tracking, streaks, and even clubs.
      `,
    },
  ];

  // 3. Seed posts (skip duplicates if already exist)
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: slug(post.title) },
      update: {},
      create: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        slug: slug(post.title),
        readTimeMin: Math.ceil(post.content.split(/\s+/).length / 200), // auto-calc read time
        author: { connect: { id: me.id } }, // ✅ fixed: use me.id
      },
    });
  }

  console.log("✅ Database seeded successfully with your real data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
