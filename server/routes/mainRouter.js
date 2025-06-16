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
  newLike,
  getPostsComments,
  getPostUsers,
} from "../db/queries.js";
import { body } from "express-validator";

// GET routes

mainRouter.get("/api/v1/getPosts/", async (req, res) => {
  const posts = await fetchAllPosts();
  const postsIdArray = posts.map(obj => obj.id);
  const postsComments = await getPostsComments(postsIdArray);
  const postsUserArray = posts.map(obj => obj.authorId);
  const postsUsers = await getPostUsers(postsUserArray);
  const users = await fetchAllUsers();
  const favourites = await countAllLikes(postsIdArray);
  const commentCount = await countAllComments(postsIdArray);
  const retweetCount = await countAllRetweets(postsIdArray);
  const postFeed = formatPostsForFeed(
    posts,
    postsUsers,
    favourites,
    commentCount,
    retweetCount
  );
  res.json({ postFeed });
});

// POST routes

mainRouter.post("/api/v1/newPost/", async (req, res) => {
  const placeHolderUser = "cmbjef3kg0000jl1l8kj2wprc"; // add user data later on
  const text = req.body.postText;
  const imageUrl = req.body.imageUrl || null;
  const post = await newPost(placeHolderUser, text);
  res.json({ post });
});

mainRouter.post("/api/v1/newLike", async (req, res) => {
  const placeHolderUser = "cmbjef3kg0000jl1l8kj2wprc"; // add user data later on
  const postId = req.body.id;
  const postLiked = await newLike(placeHolderUser, postId);
  res.json({ postLiked });
});

export default mainRouter;
