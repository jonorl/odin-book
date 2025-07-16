// Express set-up
import Router from "express";
import {
  formatPostsForFeed,
  formatPostsForFeedOptimized,
  getTimeAgo,
} from "../services/feedService.js";
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

mainRouter.get("/api/v1/getSpecificPost/:id", async (req, res) => {
  console.log("req.params.id", req.params.id);
  const post = await queries.fetchSpecificPost(req.params.id);
  const postUser = await queries.getPostUser(post);
  post.user = postUser;
  post.timestamp = getTimeAgo(post.createdAt);
  console.log("postUser", postUser);
  console.log("post", post);
  res.json({ postFeed: post });
});

mainRouter.get(
  "/api/v1/getPostsFromSpecificUser/:specificUserId",
  async (req, res) => {
    try {
      // Get all posts from the user (both original posts and replies)
      const posts = await queries.fetchAllPostsFromSpecificUser(
        req.params.specificUserId
      );

      // Get all the post IDs for fetching counts
      const postsIdArray = posts.map((obj) => obj.id);

      // Get all unique author IDs (for both posts and their reply targets)
      const postsUserArray = posts.map((obj) => obj.authorId);

      // Add author IDs of posts that are being replied to
      const replyToIds = posts
        .filter((post) => post.replyToId)
        .map((post) => post.replyToId);

      // Fetch the original posts that are being replied to
      const originalPosts = [];
      if (replyToIds.length > 0) {
        for (const replyToId of replyToIds) {
          const originalPost = await queries.getPostDetails(replyToId);
          if (originalPost) {
            originalPosts.push(originalPost);
            postsUserArray.push(originalPost.authorId);
          }
        }
      }

      // Get all users (both post authors and original post authors)
      const uniqueUserIds = [...new Set(postsUserArray)];
      const postsUsers = await queries.getPostUsers(uniqueUserIds);

      // Get counts for all posts
      const favourites = await queries.countAllLikes(postsIdArray);
      const commentCount = await queries.countAllComments(postsIdArray);
      const retweetCount = await queries.countAllRetweets(postsIdArray);

      // Use the optimized formatter that handles replies better
      const postFeed = await formatPostsForFeedOptimized(
        posts,
        postsUsers,
        favourites,
        commentCount,
        retweetCount,
        originalPosts
      );

      res.json({ postFeed });
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Server error" });
    }
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
    const postFeed = formatPostsForFeedOptimized(
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
    const postFeed = formatPostsForFeedOptimized(
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
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
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

// PUT routes
mainRouter.put("/api/v1/updateUser", parser.single("imageFile"), processCloudinaryUpload, async (req, res) => {
  try {
    const { user, name, surname, handle, email, password } =
      req.body;
      const id = user.id
      const imageUrl = req.imageUrl;

    // Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!name || !surname || !handle || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, surname, handle, and email are required",
      });
    }

    // Check if user exists
    const existingUser = await queries.getUserDetails(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailExists = await queries.getUserByEmail(email);
      if (emailExists && emailExists.id !== id) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    // Check if handle is already taken by another user
    if (handle !== existingUser.handle) {
      const handleExists = await queries.getUniqueUserDetailsByHandle(handle);

      if (handleExists  && handleExists.id !== id) {
        return res.status(400).json({
          success: false,
          message: "Handle is already taken",
        });
      }
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      surname: surname.trim(),
      handle: handle.trim(),
      email: email.trim().toLowerCase(),
      profilePicUrl: imageUrl  || existingUser.profilePicUrl,
    };

    // Only hash and update password if provided
    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    // Update user in database
    const updatedUser = await queries.updateUser(id, updateData);
    res.json({
      success: true,
      message: "User settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes("email")) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
      if (target?.includes("handle")) {
        return res.status(400).json({
          success: false,
          message: "Handle is already taken",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default mainRouter;
