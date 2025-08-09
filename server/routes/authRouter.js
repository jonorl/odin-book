// routes/authRouter.js
import { Router } from "express";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import validateUser from "../controllers/formValidation.js";
import {
  authenticateToken,
  signToken,
  signGithubToken,
} from "../controllers/authentication.js";
import generateGuestCredentials from "../utils/generateGuestUser.js";
import queries from "../db/queries.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const authRouter = Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

authRouter.get("/github", (req, res) => {
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

authRouter.get(
  "/github/callback",
  async (req, res) => {
    try {
      const { code, state } = req.query;
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
      if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        console.error("Missing GitHub OAuth environment variables");
        return res.status(500).json({ error: "Server configuration error" });
      }
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
      const { password } = generateGuestCredentials();
      const passwordHash = password
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
      let user = await queries.getUserByGithubId(githubUser.githubId);
      if (!user) {
        user = await queries.getUserByEmail(githubUser.email);
      }
      if (!user) {
        user = await queries.createUser(
          githubUser.handle,
          githubUser.name,
          githubUser.surname,
          githubUser.email,
          passwordHash,
          githubUser.profilePicUrl
        );
        console.log("New user created:", user.id);
      } else {
        console.log("Existing user logged in:", user.id);
      }
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

authRouter.get("/google", (req, res) => {
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

authRouter.get("/google/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) {
      console.log("Google OAuth error:", error);
      return res.status(400).json({ error: `OAuth error: ${error}` });
    }
    if (state !== req.session.oauthState) {
      console.log("State mismatch in Google callback");
      return res.status(400).json({ error: "Invalid state parameter" });
    }
    delete req.session.oauthState;
    if (!code) {
      console.log("No authorization code provided");
      return res.status(400).json({ error: "Authorization code not provided" });
    }
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      console.error("Missing Google OAuth environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }
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
    const { password } = generateGuestCredentials();
    const hashedPassword = password
    const googleUser = {
      googleId: userData.id.toString(),
      handle: userData.email.split("@")[0],
      name: userData.given_name || userData.name?.split(" ")[0] || "User",
      surname: userData.family_name || userData.name?.split(" ")[1] || "",
      email: userData.email,
      profilePicUrl: userData.picture || null,
    };
    let user = await queries.getUserByGoogleId(googleUser.googleId);
    if (!user) {
      user = await queries.getUserByEmail(googleUser.email);
    }
    if (!user) {
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
      user = await queries.createUser(
        googleUser.handle,
        googleUser.name,
        googleUser.surname,
        googleUser.email,
        hashedPassword,
        googleUser.profilePicUrl
      );
      console.log("New Google user created:", user.id);
    } else {
      console.log("Existing user logged in via Google:", user.id);
    }
    req.newUser = user;
    const token = signGithubToken(req, res);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    res.status(500).json({
      error: "Authentication failed",
      details: error.message,
    });
  }
});

authRouter.post(
  "/signup",
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

authRouter.post(
  "/login",
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

authRouter.post(
  "/guest",
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

export default authRouter;
