import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seeds() {
  // Clean slate
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  const amountOfUsers = 50;
  const users = [];

  // Generate users
  for (let i = 0; i < amountOfUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = {
      email: faker.internet.email(firstName, lastName),
      name: firstName,
      surname: lastName,
      passwordHash: faker.internet.password(),
      handle: faker.internet.username(),
      profilePicUrl: faker.image.url(),
      createdAt: faker.date.past(),
    };

    users.push(user);
  }

  // Insert users and fetch their IDs
  await prisma.user.createMany({ data: users });
  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    // Create 1–5 posts per user
    const numPosts = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < numPosts; i++) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          text: faker.lorem.paragraph(),
          imageUrl: faker.image.url(),
          createdAt: faker.date.recent(),
        },
      });

      // Create 0–5 comments per post from random users
      const numComments = faker.number.int({ min: 0, max: 5 });

      for (let j = 0; j < numComments; j++) {
        const randomUser = faker.helpers.arrayElement(allUsers);

        await prisma.comment.create({
          data: {
            userId: randomUser.id,
            postId: post.id,
            text: faker.lorem.sentence(),
            imageUrl: faker.image.url(),
            createdAt: faker.date.recent(),
          },
        });
      }
    }
  }

  console.log("Seeding complete!");
}

export default seeds