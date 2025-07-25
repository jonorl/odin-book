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

// Helper function to create user maps
const createUserMap = (users) => {
  const userMap = new Map();
  users.forEach((user) => {
    userMap.set(user.id, user);
  });
  return userMap;
};

// Helper function to format user data
const formatUserData = (user) => ({
  id: user.id,
  name: `${user.name} ${user.surname}`,
  username: user.handle,
  avatar: user.profilePicUrl,
});

// Helper function to create count maps
const createCountMaps = (favourites, retweetCount, commentCount) => {
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

  return { postLikesMap, retweetCountMap, commentCountMap };
};

// Optimized approach: Batch fetch all required users upfront
async function formatPostsForFeedOptimized(
  posts,
  users,
  favourites,
  commentCount,
  retweetCount,
  originalPosts = []
) {
  const postsArray = Array.isArray(posts) ? posts : [posts];
  
  // Create comprehensive user map
  const usersMap = createUserMap(users);
  
  // Create a map of all posts (both user posts and original posts they're replying to)
  const allPostsMap = new Map();
  postsArray.forEach((post) => {
    allPostsMap.set(post.id, post);
  });
  
  // Add original posts to the map
  originalPosts.forEach((post) => {
    allPostsMap.set(post.id, post);
  });

  // Create count maps
  const { postLikesMap, retweetCountMap, commentCountMap } = createCountMaps(
    favourites,
    retweetCount,
    commentCount
  );

  const formattedPosts = postsArray.map(post => {
    const user = usersMap.get(post.authorId);
    if (!user) {
      console.warn(`User not found for post ${post.id}, authorId: ${post.authorId}`);
      return null;
    }

    const likes = postLikesMap.get(post.id) || { count: 0, userIds: [] };
    const retweets = retweetCountMap.get(post.id) || 0;
    const replies = commentCountMap.get(post.id) || 0;
    
    // Get the original post if this is a reply
    let originalPostWithUser = null;
    if (post.replyToId) {
      const replyPost = allPostsMap.get(post.replyToId);
      if (replyPost) {
        const originalAuthor = usersMap.get(replyPost.authorId);
        if (originalAuthor) {
          originalPostWithUser = {
            id: replyPost.id,
            user: formatUserData(originalAuthor),
            content: replyPost.text,
            image: replyPost.imageUrl,
            timestamp: getTimeAgo(replyPost.createdAt),
            createdAt: replyPost.createdAt,
            replyToId: replyPost.replyToId,
            originalPost: {
              id: replyPost.id,
              authorId: replyPost.authorId,
              text: replyPost.text,
              imageUrl: replyPost.imageUrl,
              createdAt: replyPost.createdAt,
              replyToId: replyPost.replyToId,
              originalUser: formatUserData(originalAuthor),
            },
          };
        }
      }
    }

    return {
      id: post.id,
      user: formatUserData(user),
      content: post.text,
      image: post.imageUrl,
      timestamp: getTimeAgo(post.createdAt),
      likes: likes.count || 0,
      likedBy: { userIds: likes.userIds || [] },
      retweets: retweets,
      replies: replies,
      replyToId: post.replyToId,
      liked: false,
      retweeted: false,
      originalPost: originalPostWithUser,
    };
  }).filter(post => post !== null);

  return formattedPosts;
}

export { formatPostsForFeedOptimized, getTimeAgo };