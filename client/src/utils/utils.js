import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Mock data
const mockPosts = [
  {
    id: 1,
    user: { name: "John Doe", username: "johndoe", avatar: "👨‍💻" },
    content:
      "Just finished building my first React component! The feeling when everything clicks is amazing. #coding #react",
    timestamp: "2h",
    likes: 12,
    retweets: 3,
    replies: 5,
    liked: false,
    retweeted: false,
  },
  {
    id: 2,
    user: { name: "Jane Smith", username: "janesmith", avatar: "👩‍🎨" },
    content:
      "Beautiful sunset today! Sometimes you need to step away from the code and appreciate the world around you. 🌅",
    timestamp: "4h",
    likes: 28,
    retweets: 7,
    replies: 12,
    liked: true,
    retweeted: false,
  },
  {
    id: 3,
    user: { name: "Dev Community", username: "devcommunity", avatar: "💻" },
    content:
      "Pro tip: Always write tests for your code. Your future self will thank you! What's your favorite testing framework?",
    timestamp: "6h",
    likes: 45,
    retweets: 15,
    replies: 23,
    liked: false,
    retweeted: true,
  },
];

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


export { mockPosts, formatPostsForFeed };
