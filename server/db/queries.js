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
  const [likes, favourites] = await Promise.all([
    prisma.favourite.groupBy({
      where: { postId: { in: postsIdArray } },
      by: ["postId"],
      _count: { _all: true },
    }),
    prisma.favourite.findMany({
      where: { postId: { in: postsIdArray } },
      select: { postId: true, userId: true }
    })
  ]);

  // Merge the results
  const result = likes.map(like => ({
    ...like,
    userIds: favourites
      .filter(fav => fav.postId === like.postId)
      .map(fav => fav.userId)
  }));

  console.log("likes", result);
  return result;
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

async function toggleLike(userId, postId) {
  const existingLike = await prisma.favourite.findUnique({
    where: {
      userId_postId: { 
        userId: userId,
        postId: postId
      }
    }
  });

  if (existingLike) {
    // Remove the like
    await prisma.favourite.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    return { action: 'removed', liked: false };
  } else {
    // Create the like
    const postLike = await prisma.favourite.create({
      data: { userId: userId, postId: postId }
    });
    return { action: 'created', liked: true, data: postLike };
  }
}

async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
}

async function createUser(handle, name, surname, email, hashedPassword) {
  const newUser = await prisma.user.create({
    data: {
      handle: handle,
      name: name,
      surname: surname,
      email: email,
      passwordHash: hashedPassword,
    },
  });
  return newUser;
}

async function getMe(user) {
  const users = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  return users;
}

async function getUserFromEmail(email) {
  const users = await prisma.user.findUnique({
    where: { email: email },
  });
  return users;
}

export default {
  fetchAllUsers,
  fetchAllPosts,
  fetchAllComments,
  countAllLikes,
  countAllComments,
  countAllRetweets,
  newPost,
  toggleLike,
  getPostsComments,
  getPostUsers,
  getUserByEmail,
  createUser,
  getMe,
  getUserFromEmail,
};
