// Express set-up
import Router from 'express'
import { formatPostsForFeed } from '../services/feedService.js'
const mainRouter = Router();

// Import database queries
import { fetchAllUsers, fetchAllPosts, fetchAllComments } from "../db/queries.js";

// GET routes

mainRouter.get("/api/v1/test/", async (req, res) => {
  const users = await fetchAllUsers();
  res.json({ users });
});

mainRouter.get("/api/v1/test2/", async (req, res) => {
  const posts = await fetchAllPosts();
  res.json({ posts });
});

mainRouter.get("/api/v1/test3/", async (req, res) => {
  const comments = await fetchAllComments("cmbjef3kp001fjl1l4v6gt6es");
  res.json({ comments });
});

mainRouter.get("/api/v1/getPosts/", async (req, res) => {
  const users = await fetchAllUsers();
  const posts = await fetchAllPosts();
  const postFeed = formatPostsForFeed(posts, users);
  res.json ({ postFeed })
});

export default mainRouter;
