import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fetchAllUsers() {
  const users = await prisma.user.findMany({
    take: 10
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
    take: 20,
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
    take: 20,
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
    take: 20,
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

const countAllRetweets = async (postIds) => {
  try {
    const postIdsArray = Array.isArray(postIds) ? postIds : [postIds];

    const retweetCounts = await prisma.repost.groupBy({
      by: ["postId"],
      where: {
        postId: {
          in: postIdsArray,
        },
      },
      _count: {
        userId: true,
      },
    });

    return retweetCounts.map((count) => ({
      postId: count.postId,
      _count: { userId: count._count.userId },
    }));
  } catch (error) {
    console.error("Error counting retweets:", error);
    throw error;
  }
};

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

async function createUser(
  handle,
  name,
  surname,
  email,
  hashedPassword,
  profilePicUrl
) {
  const newUser = await prisma.user.create({
    data: {
      handle: handle,
      name: name,
      surname: surname,
      email: email,
      passwordHash: hashedPassword,
      profilePicUrl: profilePicUrl || null,
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
  const [followingUsers, followerCount, followingCount] = await Promise.all([
    // People the user is following
    userid !== null
      ? prisma.follow.findMany({
          where: { followerId: userid },
          select: { followingId: true },
        })
      : Promise.resolve([]),
    // Count of people who follow this user
    targetId !== null
      ? prisma.follow.count({ where: { followingId: targetId } })
      : userid !== null
      ? prisma.follow.count({ where: { followingId: userid } })
      : Promise.resolve(0),
    // Count of people this user follows
    userid !== null
      ? prisma.follow.count({ where: { followerId: userid } })
      : Promise.resolve(0),
  ]);

  return {
    followingUsers,
    followerCount,
    followingCount,
  };
}

async function getUserByGithubId(githubId) {
  try {
    const user = await prisma.user.findFirst({
      where: { githubId },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by GitHub ID:", error);
    throw error;
  }
}

async function createGithubUser({
  githubId,
  handle,
  name,
  surname,
  email,
  profilePicUrl,
}) {
  try {
    const user = await prisma.user.create({
      data: {
        githubId,
        handle,
        name,
        surname,
        email,
        profilePicUrl,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating GitHub user:", error);
    throw error;
  }
}

// Get user by Google ID
const getUserByGoogleId = async (googleId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { googleId: googleId },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by Google ID:", error);
    throw error;
  }
};

// Create new user from Google OAuth
const createGoogleUser = async (googleUser) => {
  try {
    const user = await prisma.user.create({
      data: {
        googleId: googleUser.googleId,
        handle: googleUser.handle,
        name: googleUser.name,
        surname: googleUser.surname,
        email: googleUser.email,
        profilePicUrl: googleUser.profilePicUrl,
        // Note: No password hash for OAuth users
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating Google user:", error);
    throw error;
  }
};

async function deletePost(id) {
  const post = await prisma.post.delete({
    where: { id: id },
  });
  return post;
}

async function deleteUser(id) {
  const user = await prisma.user.delete({
    where: { id: id },
  });
  return user;
}

const toggleRetweet = async (userId, postId) => {
  try {
    // Check if user already retweeted this post
    const existingRetweet = await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (existingRetweet) {
      // Remove retweet
      await prisma.repost.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
      return { action: "removed", retweeted: false };
    } else {
      // Add retweet
      await prisma.repost.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      return { action: "added", retweeted: true };
    }
  } catch (error) {
    console.error("Error toggling retweet:", error);
    throw error;
  }
};

// Fetch all posts including retweets for main feed
const fetchAllPostsWithRetweets = async () => {
  try {
    // Get original posts
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Limit for performance
    });

    // Get reposts (retweets)
    const reposts = await prisma.repost.findMany({
      include: {
        post: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Combine and sort by creation date
    const combined = [
      ...posts.map((post) => ({ ...post, type: "post" })),
      ...reposts.map((repost) => ({
        ...repost.post,
        type: "repost",
        repostUser: repost.user,
        repostCreatedAt: repost.createdAt,
        repostComment: repost.comment,
        repostId: repost.id,
      })),
    ];

    // Sort by creation date (original post date for posts, repost date for reposts)
    combined.sort((a, b) => {
      const dateA =
        a.type === "repost"
          ? new Date(a.repostCreatedAt)
          : new Date(a.createdAt);
      const dateB =
        b.type === "repost"
          ? new Date(b.repostCreatedAt)
          : new Date(b.createdAt);
      return dateB - dateA;
    });

    return combined.slice(0, 50); // Return top 50 after sorting
  } catch (error) {
    console.error("Error fetching posts with retweets:", error);
    throw error;
  }
};

// Fetch posts from specific user including their retweets
const fetchAllPostsFromSpecificUserWithRetweets = async (userId) => {
  try {
    // Get user's original posts
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Get user's reposts
    const reposts = await prisma.repost.findMany({
      where: { userId: userId },
      include: {
        post: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Combine and sort
    const combined = [
      ...posts.map((post) => ({ ...post, type: "post" })),
      ...reposts.map((repost) => ({
        ...repost.post,
        type: "repost",
        repostUser: repost.user,
        repostCreatedAt: repost.createdAt,
        repostComment: repost.comment,
        repostId: repost.id,
      })),
    ];

    combined.sort((a, b) => {
      const dateA =
        a.type === "repost"
          ? new Date(a.repostCreatedAt)
          : new Date(a.createdAt);
      const dateB =
        b.type === "repost"
          ? new Date(b.repostCreatedAt)
          : new Date(b.createdAt);
      return dateB - dateA;
    });

    return combined;
  } catch (error) {
    console.error("Error fetching user posts with retweets:", error);
    throw error;
  }
};

// Fetch posts from following users including their retweets
const fetchAllPostsFromFollowingWithRetweets = async (followingUserIds) => {
  try {
    // Get posts from following users
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingUserIds,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Get reposts from following users
    const reposts = await prisma.repost.findMany({
      where: {
        userId: {
          in: followingUserIds,
        },
      },
      include: {
        post: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Combine and sort
    const combined = [
      ...posts.map((post) => ({ ...post, type: "post" })),
      ...reposts.map((repost) => ({
        ...repost.post,
        type: "repost",
        repostUser: repost.user,
        repostCreatedAt: repost.repostCreatedAt,
        repostComment: repost.comment,
        repostId: repost.id,
      })),
    ];

    combined.sort((a, b) => {
      const dateA =
        a.type === "repost"
          ? new Date(a.repostCreatedAt)
          : new Date(a.createdAt);
      const dateB =
        b.type === "repost"
          ? new Date(b.repostCreatedAt)
          : new Date(b.createdAt);
      return dateB - dateA;
    });

    return combined.slice(0, 50);
  } catch (error) {
    console.error("Error fetching following posts with retweets:", error);
    throw error;
  }
};

const getAllRetweetData = async (postIds) => {
  try {
    const retweetData = await prisma.repost.groupBy({
      by: ["postId"],
      where: {
        postId: {
          in: postIds,
        },
      },
      _count: {
        userId: true,
      },
    });

    // Get individual user IDs who retweeted each post
    const detailedRetweetData = await Promise.all(
      postIds.map(async (postId) => {
        const retweets = await prisma.repost.findMany({
          where: { postId },
          select: { userId: true },
        });

        return {
          postId,
          userIds: retweets.map((r) => r.userId),
          _count: { userId: retweets.length },
        };
      })
    );

    return detailedRetweetData;
  } catch (error) {
    console.error("Error getting retweet data:", error);
    throw error;
  }
};

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
  getUserByGithubId,
  createGithubUser,
  getUserByGoogleId,
  createGoogleUser,
  deletePost,
  deleteUser,
  toggleRetweet,
  fetchAllPostsWithRetweets,
  fetchAllPostsFromSpecificUserWithRetweets,
  fetchAllPostsFromFollowingWithRetweets,
  getAllRetweetData,
};
