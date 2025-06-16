import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({
    /* take: 10 */
  });
  return users;
}

async function getPostsComments(postIdArray) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: {
        in: postIdArray,
      },
    },
  });
  return comments;
}

async function getPostUsers(postUsersArray) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: postUsersArray,
      },
    },
  });
  return users;
}

async function fetchAllPosts() {
  const users = await prisma.post.findMany({
    take: 10,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return users;
}

async function fetchAllComments(postId) {
  const users = await prisma.comment.findMany({
    where: { postId },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return users;
}

async function countAllLikes(postsIdArray) {
  const likes = await prisma.favourite.groupBy({
    where: { postId: { in: postsIdArray } },
    by: ["postId"],
    _count: {
      _all: true,
    },
  });
  return likes;
}

async function countAllComments(postsIdArray) {
  const commentCount = await prisma.comment.groupBy({
    where: { postId: { in: postsIdArray } },
    by: ["postId"],
    _count: {
      id: true,
    },
  });
  return commentCount;
}

async function countAllRetweets(postsIdArray) {
  const retweetCount = await prisma.repost.groupBy({
    where: { postId: { in: postsIdArray } },
    by: ["postId"],
    _count: {
      id: true,
    },
  });
  return retweetCount;
}

async function newPost(userId, text, imageUrl) {
  const newPost = await prisma.post.create({
    data: {
      authorId: userId,
      text: text,
      imageUrl: imageUrl || null,
    },
  });
  return newPost;
}

async function newLike(userId, postId) {
  const postLike = await prisma.favourite.create({
    data: { userId: userId, postId: postId },
  });
  return postLike;
}

export {
  fetchAllUsers,
  fetchAllPosts,
  fetchAllComments,
  countAllLikes,
  countAllComments,
  countAllRetweets,
  newPost,
  newLike,
  getPostsComments,
  getPostUsers,
};
