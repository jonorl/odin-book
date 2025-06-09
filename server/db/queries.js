import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({take: 10,});
  return users;
}

async function fetchAllPosts() {
  const users = await prisma.post.findMany({take: 10,});
  return users;
}

async function fetchAllComments(postId) {
  const users = await prisma.comment.findMany({ where: { postId } });
  return users;
}

export { fetchAllUsers, fetchAllPosts, fetchAllComments };
