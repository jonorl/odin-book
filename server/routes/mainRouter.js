// Express set-up
import Router from "express";
import {
  formatPostsForFeedOptimized,
  getTimeAgo,
} from "../services/feedService.js";
import validateUser from "../controllers/formValidation.js";
import generateGuestCredentials from "../utils/generateGuestUser.js";
import {
  authenticateToken,
  signToken,
  signGithubToken,
} from "../controllers/authentication.js";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
const mainRouter = Router();

// Import database queries
import queries from "../db/queries.js";

// Environment variables (use .env file in production)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// GET routes

mainRouter.get("/api/v1/getPosts/", async (req, res) => {
  const posts = await queries.fetchAllPosts();
  const postsIdArray = posts.map((obj) => obj.id);
  const postsUserArray = posts.map((obj) => obj.authorId);
  const postsUsers = await queries.getPostUsers(postsUserArray);
  const favourites = await queries.countAllLikes(postsIdArray);
  const commentCount = await queries.countAllComments(postsIdArray);
  const retweetCount = await queries.countAllRetweets(postsIdArray);
  const postFeed = formatPostsForFeedOptimized(
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
  const post = await queries.fetchSpecificPost(req.params.id);
  const postUser = await queries.getPostUser(post);
  post.user = postUser;
  post.timestamp = getTimeAgo(post.createdAt);
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

mainRouter.get("/api/v1/auth/github", (req, res) => {
  // Generate a random state parameter for security
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent("user:email")}&` +
    `state=${state}`;

  res.redirect(githubAuthUrl);
});

mainRouter.get(
  "/api/v1/auth/github/callback",
  async (req, res) => {
    try {
      const { code, state } = req.query;

      // Verify state parameter to prevent CSRF attacks
      if (state !== req.session.oauthState) {
        console.log("State mismatch in GitHub callback");
        return res.status(400).json({ error: "Invalid state parameter" });
      }
      delete req.session.oauthState;

      if (!code) {
        console.log("No authorization code provided");
        return res
          .status(400)
          .json({ error: "Authorization code not provided" });
      }

      // Validate environment variables
      const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
      const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
      const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

      if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        console.error("Missing GitHub OAuth environment variables");
        return res.status(500).json({ error: "Server configuration error" });
      }

      // Exchange code for access token
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
          }),
        }
      );

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error(
          "GitHub token exchange failed:",
          tokenResponse.status,
          errorText
        );
        return res.status(tokenResponse.status).json({
          error: "Failed to obtain access token from GitHub",
          details: errorText,
        });
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        console.error("Access token missing from GitHub response:", tokenData);
        return res.status(400).json({
          error: "Failed to obtain access token: token missing from response",
        });
      }

      // Fetch user profile
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error(
          "GitHub user fetch failed:",
          userResponse.status,
          errorText
        );
        return res.status(userResponse.status).json({
          error: "Failed to fetch user data from GitHub",
          details: errorText,
        });
      }

      const userData = await userResponse.json();

      // Fetch user emails
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(
          "GitHub email fetch failed:",
          emailResponse.status,
          errorText
        );
        return res.status(emailResponse.status).json({
          error: "Failed to fetch user emails from GitHub",
          details: errorText,
        });
      }

      const emailData = await emailResponse.json();
      const primaryEmail = Array.isArray(emailData)
        ? emailData.find((email) => email.primary)?.email
        : null;

      // Prepare user data for database
      const githubUser = {
        githubId: userData.id.toString(),
        handle: userData.login,
        name: userData.name?.split(" ")[0] || userData.login,
        surname: userData.name?.split(" ")[1] || "",
        email:
          primaryEmail ||
          userData.email ||
          `${userData.id}+${userData.login}@users.noreply.github.com`,
        profilePicUrl: userData.avatar_url || null,
      };

      // Check if user exists
      let user = await queries.getUserByGithubId(githubUser.githubId);
      if (!user) {
        user = await queries.getUserByEmail(githubUser.email);
      }

      // Create or update user
      if (!user) {
        user = await queries.createGithubUser(githubUser);
        console.log("New user created:", user.id);
      } else {
        console.log("Existing user logged in:", user.id);
      }

      // Generate JWT token
      req.newUser = user;
      const token = signGithubToken(req, res);
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    } catch (error) {
      console.error("Error in GitHub OAuth callback:", error);
      res.status(500).json({
        error: "Authentication failed",
        details: error.message,
      });
    }
  },
  signToken
);

// Google OAuth initiation route
mainRouter.get("/api/v1/auth/google", (req, res) => {
  // Generate a random state parameter for security
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent("openid email profile")}&` +
    `state=${state}`;

  res.redirect(googleAuthUrl);
});

// Google OAuth callback route
mainRouter.get("/api/v1/auth/google/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
      console.log("Google OAuth error:", error);
      return res.status(400).json({ error: `OAuth error: ${error}` });
    }

    // Verify state parameter to prevent CSRF attacks
    if (state !== req.session.oauthState) {
      console.log("State mismatch in Google callback");
      return res.status(400).json({ error: "Invalid state parameter" });
    }
    delete req.session.oauthState;

    if (!code) {
      console.log("No authorization code provided");
      return res.status(400).json({ error: "Authorization code not provided" });
    }

    // Validate environment variables
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      console.error("Missing Google OAuth environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        "Google token exchange failed:",
        tokenResponse.status,
        errorText
      );
      return res.status(tokenResponse.status).json({
        error: "Failed to obtain access token from Google",
        details: errorText,
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("Access token missing from Google response:", tokenData);
      return res.status(400).json({
        error: "Failed to obtain access token: token missing from response",
      });
    }

    // Fetch user profile from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error(
        "Google user fetch failed:",
        userResponse.status,
        errorText
      );
      return res.status(userResponse.status).json({
        error: "Failed to fetch user data from Google",
        details: errorText,
      });
    }

    const userData = await userResponse.json();

    console.log("userData", userData);

    // Prepare user data for database
    const googleUser = {
      googleId: userData.id.toString(),
      handle: userData.email.split("@")[0], // Use email prefix as initial handle
      name: userData.given_name || userData.name?.split(" ")[0] || "User",
      surname: userData.family_name || userData.name?.split(" ")[1] || "",
      email: userData.email,
      profilePicUrl: userData.picture || null,
    };

    // Check if user exists by Google ID or email
    let user = await queries.getUserByGoogleId(googleUser.googleId);
    if (!user) {
      user = await queries.getUserByEmail(googleUser.email);
    }

    console.log("user", user);

    // Create or update user
    if (!user) {
      // Check if handle is already taken and make it unique if needed
      let uniqueHandle = googleUser.handle;
      let handleExists =
        await queries.getUniqueUserDetailsByHandle(uniqueHandle);
      let counter = 1;

      while (handleExists) {
        uniqueHandle = `${googleUser.handle}${counter}`;
        handleExists = await queries.getUserDetailsByHandle(uniqueHandle);
        counter++;
      }

      googleUser.handle = uniqueHandle;
      user = await queries.createGoogleUser(googleUser);
      console.log("New Google user created:", user.id);
    } else {
      console.log("Existing user logged in via Google:", user.id);
    }

    // Generate JWT token
    req.newUser = user;
    const token = signGithubToken(req, res); // Reuse the same token signing function
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    res.status(500).json({
      error: "Authentication failed",
      details: error.message,
    });
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
  parser.single("profilePic"),
  processCloudinaryUpload,
  async (req, res, next) => {
    try {
      const { handle, name, surname, email, password } = req.body;
      const imageUrl = req.imageUrl;

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
        hashedPassword,
        imageUrl
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

mainRouter.post("/api/v1/newFollow/", async (req, res) => {
  const { userId, targetUserId } = req.body;
  const follow = await queries.toggleFollow(userId, targetUserId);
  res.json({ follow });
});

mainRouter.post("/api/v1/followers/", async (req, res) => {
  try {
    const user = req.body.userData?.id || req.body.userData?.user?.id;
    const specificUser =
      req.body.specificUserData?.id || req.body.specificUserData?.user?.id;
    const { followingUsers, followerCount, followingCount } =
      await queries.getUserFollowersData(user, specificUser || null);
    res.json({ followingUsers, followerCount, followingCount });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error", err });
  }
});

mainRouter.post("/api/v1/followingposts", async (req, res) => {
  try {
    const followerJSON = req.body.followersData.followingUsers;
    const followerArray = followerJSON.map((user) => user.followingId);
    const posts = await queries.fetchAllPostsFromFollowing(followerArray);
    const postsIdArray = posts.map((obj) => obj.id);
    const postsComments = await queries.getPostsComments(postsIdArray);
    const postsUserArray = posts.map((obj) => obj.authorId);
    const postsUsers = await queries.getPostUsers(postsUserArray);
    const favourites = await queries.countAllLikes(postsIdArray);
    const commentCount = await queries.countAllComments(postsIdArray);
    const retweetCount = await queries.countAllRetweets(postsIdArray);
    const postFeed = formatPostsForFeedOptimized(
      posts,
      postsUsers,
      favourites,
      commentCount,
      retweetCount
    );
    const resolvedPostFeed = await postFeed;
    res.json({ postFeed: resolvedPostFeed });
  } catch (err) {
    console.error("failed to fetch post", err);
    res.status(500).json({ message: "server error", err });
  }
});

mainRouter.post(
  "/api/v1/guest",
  validateUser,
  async (req, res, next) => {
    try {
      const { handle, name, surname, email, password, profilePicUrl } =
        generateGuestCredentials();
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
        hashedPassword,
        profilePicUrl
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

// PUT routes
mainRouter.put(
  "/api/v1/updateUser",
  parser.single("imageFile"),
  processCloudinaryUpload,
  async (req, res) => {
    try {
      const { user, name, surname, handle, email, password } = req.body;
      const id = user.id;
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

        if (handleExists && handleExists.id !== id) {
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
        profilePicUrl: imageUrl || existingUser.profilePicUrl,
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
  }
);

// DELETE routes

mainRouter.delete("/api/v1/deletepost/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await queries.deletePost(postId);
    res.json({ post });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

mainRouter.delete("/api/v1/deleteuser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await queries.deleteUser(userId);
    res.json({ user });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default mainRouter;
