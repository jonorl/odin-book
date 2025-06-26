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

function formatPostsForFeed(
  posts,
  users,
  favourites,
  commentCount,
  retweetCount
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

  // Map over the posts to transform them
  const formattedPosts = posts.map((post) => {
    const user = usersMap.get(post.authorId); // Find the corresponding user
    const likes = postLikesMap.get(post.id) || 0;
    const retweets = retweetCountMap.get(post.id) || 0;
    const replies = commentCountMap.get(post.id) || 0;
    const liked = false;
    const retweeted = false;

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
      liked: liked,
      retweeted: retweeted,
    };
  });

  return formattedPosts;
}

export { formatPostsForFeed, getTimeAgo };
