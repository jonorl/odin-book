function formatPostsForFeed(posts, users) {
  // Create a map of users for quick lookup by ID
  const usersMap = new Map();
  users.forEach((user) => {
    usersMap.set(user.id, user);
  });
  console.log("usersMap", usersMap)

  // Map over the posts to transform them
  const formattedPosts = posts.map((post) => {
    const user = usersMap.get(post.authorId); // Find the corresponding user
    const likes = Math.floor(Math.random() * 100); // Example: random likes
    const retweets = Math.floor(Math.random() * 20); // Example: random retweets
    const replies = Math.floor(Math.random() * 15); // Example: random replies
    const liked = false;
    const retweeted = false;

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

    return {
      id: post.id,
      user: {
        id: user.id,
        name: user.name + " " + user.surname ,
        username: user.handle,
        avatar: user.profilePicUrl,
      },
      content: post.text,
      timestamp: getTimeAgo(post.createdAt),
      likes: likes,
      retweets: retweets,
      replies: replies,
      liked: liked,
      retweeted: retweeted,
    };
  });

  console.log(formattedPosts.length)
  return  formattedPosts;
}

export { formatPostsForFeed };