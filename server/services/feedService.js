import queries from "../db/queries.js";

// A simple function to calculate a "time ago" string
const getTimeAgo = (timestamp) => {
  const postDate = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - postDate) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

async function getUsersHelperFunction(authorId) {
  const users = await queries.getPostUsers(authorId);
  return users;
}

async function formatPostsForFeed(
  posts,
  users,
  favourites,
  commentCount,
  retweetCount,
  postReplies
) {
  // Create a map of users for quick lookup by ID
  const usersMap = new Map();
  users.forEach((user) => {
    usersMap.set(user.id, user);
  });

  // Create a map of post likes for quick lookup by postId
  const postLikesMap = new Map();
  favourites.forEach((fav) => {
    postLikesMap.set(fav.postId, {
      count: fav._count._all,
      userIds: fav.userIds,
    });
  });

  const retweetCountMap = new Map();
  retweetCount.forEach((retweet) => {
    retweetCountMap.set(retweet.postId, retweet._count.id);
  });

  const commentCountMap = new Map();
  commentCount.forEach((com) => {
    commentCountMap.set(com.id, com._count.replies);
  });

  const postsArray = Array.isArray(posts) ? posts : [posts];
  const isinglePost = !Array.isArray(posts);

  const allPostsMap = new Map();
  postsArray.forEach((post) => {
    allPostsMap.set(post.id, post);
  });

  let postRepliesMap = new Map();
  console.log("postReplies", postReplies);
  postReplies &&
    postReplies.forEach((reply) => {
      postRepliesMap.set(reply.id, reply);
    });

  console.log("postLikesMap", postLikesMap);

  // Map over the posts to transform them
  const formattedPosts = postsArray.map((post) => {
    const user = usersMap.get(post.authorId); // Find the corresponding user
    const likes = postLikesMap.get(post.id) || 0;
    const retweets = retweetCountMap.get(post.id) || 0;
    const replies = commentCountMap.get(post.id) || 0;
    const liked = false;
    const retweeted = false;
    const replyPost = allPostsMap.get(post.replyToId) || null;

    // Get the original post's author data if it's a reply
    let originalPostWithUser = null;
    if (replyPost) {
      const originalUser = getUsersHelperFunction(replyPost.authorId);
      const originalUserMap = new Map();
      originalUser.forEach((OriginalUserData) => {
        originalUserMap.set(replyPost.authorId, OriginalUserData);
      });
      const originalAuthor = originalUserMap.get(replyPost.authorId);
      originalPostWithUser = {
        id: replyPost.id,
        user: {
          id: user.id,
          name: user.name + " " + user.surname,
          username: user.handle,
          avatar: user.profilePicUrl,
        },
        content: replyPost.text,
        image: replyPost.imageUrl,
        timestamp: getTimeAgo(replyPost.createdAt),
        createdAt: replyPost.createdAt,
        replyToId: replyPost.replyToId,
        originalPost: replyPost
          ? {
              id: replyPost.id,
              authorId: replyPost.authorId,
              text: replyPost.text,
              imageUrl: replyPost.imageUrl,
              createdAt: replyPost.createdAt,
              replyToId: replyPost.replyToId,
              originalUser: {
                id: originalAuthor.id,
                name: originalAuthor.name + " " + originalAuthor.surname,
                username: originalAuthor.handle,
                avatar: originalAuthor.profilePicUrl,
              },
            }
          : null,
      };
    }

    return {
      id: post.id,
      user: {
        id: user.id,
        name: user.name + " " + user.surname,
        username: user.handle,
        avatar: user.profilePicUrl,
      },
      content: post.text,
      image: post.imageUrl,
      timestamp: getTimeAgo(post.createdAt),
      likes: likes.count || 0,
      likedBy: { userIds: likes.userIds },
      retweets: retweets,
      replies: replies,
      replyToId: post.replyToId,
      liked: liked,
      retweeted: retweeted,
      originalPost: originalPostWithUser, // Now includes full user data
    };
  });

  console.log("formattedPosts", formattedPosts);
  return formattedPosts;
}

export { formatPostsForFeed, getTimeAgo };
