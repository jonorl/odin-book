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

export { mockPosts };
