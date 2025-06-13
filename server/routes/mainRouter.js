// Express set-up
import Router from "express";
import { formatPostsForFeed } from "../services/feedService.js";
const mainRouter = Router();

// Import database queries
import {
  fetchAllUsers,
  fetchAllPosts,
  fetchAllComments,
  countAllLikes,
  countAllComments,
  countAllRetweets,
  newPost,
} from "../db/queries.js";

// GET routes

mainRouter.get("/api/v1/getPosts/", async (req, res) => {
  const users = await fetchAllUsers();
  const posts = await fetchAllPosts();
  const favourites = await countAllLikes();
  const commentCount = await countAllComments();
  const retweetCount = await countAllRetweets();
  const postFeed = formatPostsForFeed(
    posts,
    users,
    favourites,
    commentCount,
    retweetCount
  );
  res.json({ postFeed });
});

// POST routes

mainRouter.post("/api/v1/newPost/", async (req, res) => {
  const placeHolderUser = "cmbjef3kg0000jl1l8kj2wprc"; // add user data later on
  const text = req.body.postText
  const imageUrl = req.body.imageUrl || null
  const post = await newPost(placeHolderUser, text);
  res.json({ post });
});

export default mainRouter;
