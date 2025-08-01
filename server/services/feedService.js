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
    retweetCountMap.set(retweet.postId, retweet._count.userId || retweet._count.id);
  });

  const commentCountMap = new Map();
  commentCount.forEach((com) => {
    commentCountMap.set(com.id, com._count.replies);
  });

  return { postLikesMap, retweetCountMap, commentCountMap };
};

// Updated formatPostsForFeedOptimized to handle retweets
async function formatPostsForFeedOptimized(
  posts,
  users,
  favourites,
  commentCount,
  retweetCount,
  originalPosts = [],
  retweetedByData = []
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

  // Create retweeted by map
  const retweetedByMap = new Map();
  retweetedByData.forEach((retweet) => {
    retweetedByMap.set(retweet.postId, {
      userIds: retweet.userIds || []
    });
  });

  const formattedPosts = postsArray.map(post => {
    const isRepost = post.type === 'repost';
    const originalAuthor = usersMap.get(post.authorId);
    
    if (!originalAuthor) {
      console.warn(`User not found for post ${post.id}, authorId: ${post.authorId}`);
      return null;
    }

    const likes = postLikesMap.get(post.id) || { count: 0, userIds: [] };
    const retweets = retweetCountMap.get(post.id) || 0;
    const replies = commentCountMap.get(post.id) || 0;
    const retweetedBy = retweetedByMap.get(post.id) || { userIds: [] };
    
    // Get the original post if this is a reply
    let originalPostWithUser = null;
    if (post.replyToId) {
      const replyPost = allPostsMap.get(post.replyToId);
      if (replyPost) {
        const replyAuthor = usersMap.get(replyPost.authorId);
        if (replyAuthor) {
          originalPostWithUser = {
            id: replyPost.id,
            user: formatUserData(replyAuthor),
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
              originalUser: formatUserData(replyAuthor),
            },
          };
        }
      }
    }

    const basePost = {
      id: post.id,
      user: formatUserData(originalAuthor),
      content: post.text,
      image: post.imageUrl,
      timestamp: getTimeAgo(post.createdAt),
      likes: likes.count || 0,
      likedBy: { userIds: likes.userIds || [] },
      retweetedBy: { userIds: retweetedBy.userIds },
      retweets: retweets,
      replies: replies,
      replyToId: post.replyToId,
      liked: false,
      retweeted: false,
      originalPost: originalPostWithUser,
    };

    // If this is a repost, add repost metadata
    if (isRepost) {
      const repostUser = usersMap.get(post.repostUser.id) || post.repostUser;
      return {
        ...basePost,
        isRepost: true,
        repostUser: formatUserData(repostUser),
        repostTimestamp: getTimeAgo(post.repostCreatedAt),
        repostComment: post.repostComment,
        repostId: post.repostId,
        // Use repost timestamp for sorting, but keep original post timestamp for display
        sortTimestamp: post.repostCreatedAt
      };
    }

    return basePost;
  }).filter(post => post !== null);

  return formattedPosts;
}

export { formatPostsForFeedOptimized, getTimeAgo };