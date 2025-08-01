// routes/followRouter.js
import { Router } from "express";
import {
  formatPostsForFeedOptimized,
} from "../services/feedService.js";
import queries from "../db/queries.js";

const followRouter = Router();

followRouter.post("/follow", async (req, res) => {
  const { userId, targetUserId } = req.body;
  const follow = await queries.toggleFollow(userId, targetUserId);
  res.json({ follow });
});

followRouter.post("/followers", async (req, res) => {
  try {
    const user = req.body.userData?.id || req.body.userData?.user?.id;
    const specificUser =
      req.body.specificUserData?.id || req.body.specificUserData?.user?.id;
    const { followingUsers, followerCount, followingCount } =
      await queries.getUserFollowersData(user, specificUser || null);
    res.json({ followingUsers, followerCount, followingCount });
  } catch (err) {
    console.error("failed to fetch followers", err);
    res.status(500).json({ message: "server error", err });
  }
});

followRouter.post("/followingposts", async (req, res) => {
  try {
    const followerJSON = req.body.followersData.followingUsers;
    const followerArray = followerJSON.map((user) => user.followingId);
    const posts = await queries.fetchAllPostsFromFollowingWithRetweets(followerArray);
    // ... rest of your existing logic with the new posts data
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error", err });
  }
});

export default followRouter;