import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const countries = [
    {
      code: "US",
      name: "미국 걸스카우트",
      subreddit: "girlscouts",
      description: "Girl Scouts of the USA - r/girlscouts",
    },
    {
      code: "KR",
      name: "한국 걸스카우트",
      subreddit: null,
      description: "걸스카우트연맹 - 향후 Reddit/커뮤니티 데이터 연동 예정",
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      create: country,
      update: country,
    });
  }

  console.log("Seed completed: countries initialized");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
