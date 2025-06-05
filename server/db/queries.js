import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({});
  return users;
}

async function fetchAllPosts() {
  const users = await prisma.post.findMany({});
  return users;
}

async function fetchAllComments(postId) {
  const users = await prisma.comment.findMany({ where: { postId } });
  return users;
}

export { fetchAllUsers, fetchAllPosts, fetchAllComments };
