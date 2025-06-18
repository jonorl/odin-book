// Express set-up
import Router from "express";
import { formatPostsForFeed } from "../services/feedService.js";
import validateUser from "../controllers/formValidation.js";
import { authenticateToken, signToken } from "../controllers/authentication.js";
import upload from "../controllers/multer.js";
import bcrypt from "bcrypt";
const mainRouter = Router();

// Import database queries
import queries from "../db/queries.js";
import { body } from "express-validator";

// GET routes

mainRouter.get("/api/v1/getPosts/", async (req, res) => {
  const posts = await queries.fetchAllPosts();
  const postsIdArray = posts.map((obj) => obj.id);
  const postsComments = await queries.getPostsComments(postsIdArray);
  const postsUserArray = posts.map((obj) => obj.authorId);
  const postsUsers = await queries.getPostUsers(postsUserArray);
  const favourites = await queries.countAllLikes(postsIdArray);
  const commentCount = await queries.countAllComments(postsIdArray);
  const retweetCount = await queries.countAllRetweets(postsIdArray);
  const postFeed = formatPostsForFeed(
    posts,
    postsUsers,
    favourites,
    commentCount,
    retweetCount
  );
  res.json({ postFeed });
});

mainRouter.get("/api/v1/me", authenticateToken, async (req, res) => {
  try {
    const user = await queries.getMe(req.user);
    res.json({ user });
  } catch (err) {
    console.error("Failed to get user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST routes

mainRouter.post("/api/v1/newPost/", async (req, res) => {
  const placeHolderUser = "cmbjef3kg0000jl1l8kj2wprc"; // add user data later on
  const text = req.body.postText;
  const imageUrl = req.body.imageUrl || null;
  const post = await queries.newPost(placeHolderUser, text);
  res.json({ post });
});

mainRouter.post("/api/v1/newLike", async (req, res) => {
  const placeHolderUser = "cmbjef3kg0000jl1l8kj2wprc"; // add user data later on
  const postId = req.body.id;
  const postLiked = await queries.newLike(placeHolderUser, postId);
  res.json({ postLiked });
});

mainRouter.post(
  "/api/v1/signup/",
  validateUser,
  async (req, res, next) => {
    try {
      const { handle, name, surname, email, password } = req.body;

      const existingUser = await queries.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await queries.createUser(
        handle,
        name,
        surname,
        email,
        hashedPassword
      );
      req.newUser = newUser;
      next();
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  signToken
);

mainRouter.post(
  "/api/v1/login",
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await queries.getUserFromEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.newUser = user;
      next();
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  signToken
);

export default mainRouter;
