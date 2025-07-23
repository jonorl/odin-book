import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({
    /* take: 10 */
  });
  return users;
}

async function getPostsComments(postIdOrArray) {
  const comments = await prisma.post.findMany({
    where: {
      replyToId: Array.isArray(postIdOrArray)
        ? { in: postIdOrArray } // If it's an array, use the 'in' filter
        : postIdOrArray, // If it's not an array, use the direct value
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return comments;
}

async function getPostUsers(postUsersArray) {
  const whereClause = Array.isArray(postUsersArray)
    ? { id: { in: postUsersArray } }
    : { id: postUsersArray };

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      surname: true,
      handle: true,
      profilePicUrl: true,
    },
  });

  return users;
}

async function getPostUser(post) {
  const user = await prisma.user.findUnique({
    where: { id: post.authorId },
  });
  return user;
}

async function fetchAllPosts() {
  const users = await prisma.post.findMany({
    take: 10,
    where: { replyToId: null },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return users;
}

async function fetchAllPostsFromFollowing(usersArray) {
  const users = await prisma.post.findMany({
    take: 10,
    where: {
      replyToId: null,
      authorId: {
        in: usersArray,
      },
    },

    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return users;
}

async function fetchAllPostsFromSpecificUser(id) {
  const posts = await prisma.post.findMany({
    take: 10,
    where: { authorId: id },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return posts;
}

async function fetchAllPostRepliesFromSpecificUser(postsArray) {
  const postIds = postsArray.map((post) => post.id);
  const posts = await prisma.post.findMany({
    where: { replyToId: { in: postIds } },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return posts;
}

async function countAllLikes(postsIdArray) {
  const [likes, favourites] = await Promise.all([
    prisma.favourite.groupBy({
      where: {
        postId: Array.isArray(postsIdArray)
          ? { in: postsIdArray }
          : postsIdArray,
      },
      by: ["postId"],
      _count: { _all: true },
    }),
    prisma.favourite.findMany({
      where: {
        postId: Array.isArray(postsIdArray)
          ? { in: postsIdArray }
          : postsIdArray,
      },
      select: { postId: true, userId: true },
    }),
  ]);

  // Merge the results
  const result = likes.map((like) => ({
    ...like,
    userIds: favourites
      .filter((fav) => fav.postId === like.postId)
      .map((fav) => fav.userId),
  }));

  return result;
}

async function countAllComments(postsIdArray) {
  const commentCount = await prisma.post.findMany({
    where: {
      id: Array.isArray(postsIdArray) ? { in: postsIdArray } : postsIdArray,
    },
    include: {
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return commentCount;
}

async function countAllRetweets(postsIdArray) {
  const retweetCount = await prisma.repost.groupBy({
    where: {
      postId: Array.isArray(postsIdArray) ? { in: postsIdArray } : postsIdArray,
    },
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
        postId: postId,
      },
    },
  });

  if (existingLike) {
    // Remove the like
    await prisma.favourite.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
    return { action: "removed", liked: false };
  } else {
    // Create the like
    const postLike = await prisma.favourite.create({
      data: { userId: userId, postId: postId },
    });
    return { action: "created", liked: true, data: postLike };
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

async function getPostDetails(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  return post;
}

async function getUserDetails(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

async function getUniqueUserDetailsByHandle(handle) {
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });
}

async function getUserDetailsByHandle(handle) {
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  const postCount = await prisma.post.count({
    where: {
      authorId: user.id, // Fixed: use user.id instead of user.authorId
      replyToId: null, // Fixed: use replyToId instead of replyTo
    },
  });

  const replyCount = await prisma.post.count({
    where: {
      authorId: user.id, // Fixed: use user.id instead of user.authorId
      replyToId: { not: null }, // Fixed: use replyToId instead of replyTo
    },
  });

  const userWithPostCount = {
    ...user,
    postCount: postCount,
    replyCount: replyCount,
  };
  return userWithPostCount;
}

async function newComment(userId, text, imageUrl, originalPostId) {
  const newPost = await prisma.post.create({
    data: {
      authorId: userId,
      text: text,
      imageUrl: imageUrl || null,
      replyToId: originalPostId,
    },
  });
  return newPost;
}

async function fetchSpecificPost(id) {
  const post = await prisma.post.findUnique({
    where: { id: id },
  });
  return post;
}

async function updateUser(id, updateData) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      handle: true,
      profilePicUrl: true,
      createdAt: true,
      // Exclude passwordHash from response
    },
  });
  return updatedUser;
}

async function toggleFollow(userId, targetUserId) {
  // 1. Try to find an existing follow entry
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        // Assuming you have a composite unique constraint on these fields
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    // 2. If it exists, delete it
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          // Use the same unique constraint for deletion
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });
    console.log(`Unfollowed: User ${userId} unfollowed User ${targetUserId}`);
    return { action: "deleted", follow: existingFollow };
  } else {
    // 3. If it doesn't exist, create it
    const newFollowEntry = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
    console.log(`Followed: User ${userId} followed User ${targetUserId}`);
    return { action: "created", follow: newFollowEntry };
  }
}

async function getUserFollowersData(userid, targetId) {
  // Get all the data in parallel
  const [followingUsers, followerCount, followingCount] = await Promise.all([
    // People the user is following
    prisma.follow.findMany({
      where: { followerId: userid },
      select: { followingId: true },
    }),
    // Count of people who follow this user
    targetId !== null
      ? prisma.follow.count({
          where: { followingId: targetId },
        })
      : Promise.resolve(0),
    // Count of people this user follows
    targetId !== null
      ? prisma.follow.count({
          where: { followerId: targetId },
        })
      : Promise.resolve(0),
  ]);

  return {
    followingUsers,
    followerCount,
    followingCount,
  };
}

export default {
  fetchAllUsers,
  fetchAllPosts,
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
  getPostDetails,
  getUserDetails,
  newComment,
  fetchSpecificPost,
  getUserDetailsByHandle,
  fetchAllPostsFromSpecificUser,
  fetchAllPostRepliesFromSpecificUser,
  getPostUser,
  updateUser,
  getUniqueUserDetailsByHandle,
  toggleFollow,
  getUserFollowersData,
  fetchAllPostsFromFollowing,
};
