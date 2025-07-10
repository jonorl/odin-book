// Express set-up
import Router from "express";
import { formatPostsForFeed, getTimeAgo } from "../services/feedService.js";
import validateUser from "../controllers/formValidation.js";
import { authenticateToken, signToken } from "../controllers/authentication.js";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import bcrypt from "bcrypt";
const mainRouter = Router();

// Import database queries
import queries from "../db/queries.js";

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
  const resolvedPostFeed = await postFeed;
  res.json({ postFeed: resolvedPostFeed });
});

mainRouter.get("/api/v1/getSpecificPost/", async (req, res) => {
  const posts = await queries.fetchSpecificPost(req.body.id);
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
  const resolvedPostFeed = await postFeed;
  res.json({ postFeed: resolvedPostFeed });
});

mainRouter.get(
  "/api/v1/getPostsFromSpecificUser/:specificUserId",
  async (req, res) => {
    const posts = await queries.fetchAllPostsFromSpecificUser(
      req.params.specificUserId
    );
    const postReplies =
      await queries.fetchAllPostRepliesFromSpecificUser(posts);
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
      retweetCount,
      postReplies
    );
    const resolvedPostFeed = await postFeed;
    res.json({ postFeed: resolvedPostFeed });
  }
);

mainRouter.get("/api/v1/checkOwnLike", async (req, res) => {
  let check = false;
  const likeCheck = await queries.likeCheck(req.body.user.id);
  if (likeCheck !== null) check = true;
  res.json({ check });
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

mainRouter.get("/api/v1/postDetails/:postId", async (req, res) => {
  try {
    const post = await queries.getPostDetails(req.params.postId);
    // const postsIdArray = post.map((obj) => obj.id);
    const postsComments = await queries.getPostsComments(post.id);
    // const postsUserArray = post.map((obj) => obj.authorId);
    const postsUsers = await queries.getPostUsers(post.authorId);
    const favourites = await queries.countAllLikes(post.id);
    const commentCount = await queries.countAllComments(post.id);
    const retweetCount = await queries.countAllRetweets(post.id);
    const postFeed = formatPostsForFeed(
      post,
      postsUsers,
      favourites,
      commentCount,
      retweetCount
    );
    const resolvedPostFeed = await postFeed;
    res.json({ postFeed: resolvedPostFeed });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error" });
  }
});

mainRouter.get("/api/v1/postReplies/:postId", async (req, res) => {
  try {
    const post = await queries.getPostDetails(req.params.postId);
    // const postsIdArray = post.map((obj) => obj.id);
    const postsComments = await queries.getPostsComments(post.id);
    // const postsUserArray = post.map((obj) => obj.authorId);
    const postsUsers = await queries.getPostUsers(postsComments.authorId);
    const favourites = await queries.countAllLikes(postsComments.id);
    const commentCount = await queries.countAllComments(postsComments.id);
    const retweetCount = await queries.countAllRetweets(postsComments.id);
    const postFeed = formatPostsForFeed(
      postsComments,
      postsUsers,
      favourites,
      commentCount,
      retweetCount
    );
    const resolvedPostFeed = await postFeed;
    res.json({ postFeed: resolvedPostFeed });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error" });
  }
});

mainRouter.get("/api/v1/userDetails/:userId", async (req, res) => {
  try {
    const user = await queries.getUserDetails(req.params.userId);
    res.json({ user });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error" });
  }
});

mainRouter.get("/api/v1/userHandle/:handle", async (req, res) => {
  try {
    const user = await queries.getUserDetailsByHandle(req.params.handle);
    res.json({ user });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error" });
  }
});

// POST routes

mainRouter.post(
  "/api/v1/newPost/",
  parser.single("imageFile"),
  processCloudinaryUpload,
  async (req, res) => {
    const user = req.body.user.id;
    const text = req.body.postText;
    const imageUrl = req.imageUrl;

    const post = await queries.newPost(user, text, imageUrl);
    res.json({ post });
  }
);

mainRouter.post(
  "/api/v1/newComment/",
  parser.single("imageFile"),
  processCloudinaryUpload,
  async (req, res) => {
    const user = req.body.user.id;
    const text = req.body.postText;
    const imageUrl = req.imageUrl;
    const originalPostId = req.body.originalPostId;

    const post = await queries.newComment(user, text, imageUrl, originalPostId);
    res.json({ post });
  }
);

mainRouter.post("/api/v1/newLike", async (req, res) => {
  const user = req.body.user.id;
  const postId = req.body.id;
  const postLiked = await queries.toggleLike(user, postId);
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
