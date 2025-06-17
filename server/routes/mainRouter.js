// Express set-up
import Router from "express";
import { formatPostsForFeed } from "../services/feedService.js";
import validateUser from "../controllers/formValidation.js";
import authenticateToken from "../controllers/authentication.js";
import upload from "../controllers/multer.js";
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
    const user = await db.getMe(req.user);
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

mainRouter.post("/api/v1/signup/", validateUser, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await queries.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await queries.createUser(name, email, hashedPassword);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default mainRouter;
