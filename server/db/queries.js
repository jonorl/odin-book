import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({ take: 10 });
  return users;
}

async function fetchAllPosts() {
  const users = await prisma.post.findMany({ take: 10 });
  return users;
}

async function fetchAllComments(postId) {
  const users = await prisma.comment.findMany({ where: { postId } });
  return users;
}

async function countAllLikes() {
  const likes = await prisma.favourite.groupBy({
    by: ["postId"],
    _count: {
      _all: true,
    },
  });
  return likes;
}

async function countAllComments() {
  const commentCount = await prisma.comment.groupBy({
    by: ["postId"],
    _count: {
      id: true,
    },
  });
  return commentCount;
}

async function countAllRetweets() {
  const retweetCount = await prisma.repost.groupBy({
    by: ["postId"],
    _count: {
      id: true,
    },
  });
  return retweetCount;
}

export { fetchAllUsers, fetchAllPosts, fetchAllComments, countAllLikes, countAllComments, countAllRetweets };
