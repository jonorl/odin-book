// routes/postRouter.js
import { Router } from "express";
import {
  formatPostsForFeedOptimized /* getTimeAgo, */,
} from "../services/feedService.js";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import queries from "../db/queries.js";

const postRouter = Router();

postRouter.get("/posts/:postId/details", async (req, res) => {
  try {
    const post = await queries.getPostDetails(req.params.postId);
    const postsUsers = await queries.getPostUsers(post.authorId);
    const favourites = await queries.countAllLikes(post.id);
    const commentCount = await queries.countAllComments(post.id);
    console.log("3", post.id);
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

postRouter.get("/posts/:postId/replies", async (req, res) => {
  try {
    const post = await queries.getPostDetails(req.params.postId);
    const postsComments = await queries.getPostsComments(post.id);
    console.log("postsComments", postsComments);
    const postsUsers = await queries.getPostUsers(
      postsComments.map((comment) => comment.authorId)
    );
    const favourites = await queries.countAllLikes(
      postsComments.map((comment) => comment.id)
    );
    const commentCount = await queries.countAllComments(
      postsComments.map((comment) => comment.id)
    );
    const retweetCount = await queries.countAllRetweets(
      postsComments.map((comment) => comment.id)
    );
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

postRouter.get("/posts", async (req, res) => {
  const page = req.query.page || 1;
  try {
    console.log("page", page);
    const posts = await queries.fetchAllPostsWithRetweets();
    const postsIdArray = posts.map((obj) => obj.id);
    const postsUserArray = posts.map((obj) => obj.authorId);

    // Add repost user IDs to user array
    posts.forEach((post) => {
      if (post.type === "repost" && post.repostUser) {
        postsUserArray.push(post.repostUser.id);
      }
    });

    const uniqueUserIds = [...new Set(postsUserArray)];
    const postsUsers = await queries.getPostUsers(uniqueUserIds);
    const favourites = await queries.countAllLikes(postsIdArray);
    const commentCount = await queries.countAllComments(postsIdArray);
    const retweetCount = await queries.countAllRetweets(postsIdArray);
    const retweetedByData = await queries.getAllRetweetData(postsIdArray);

    const postFeed = formatPostsForFeedOptimized(
      posts,
      postsUsers,
      favourites,
      commentCount,
      retweetCount,
      [],
      retweetedByData
    );
    const resolvedPostFeed = await postFeed;
    res.json({ postFeed: resolvedPostFeed });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

postRouter.get("/users/:specificUserId/posts", async (req, res) => {
  try {
    const posts = await queries.fetchAllPostsFromSpecificUserWithRetweets(
      req.params.specificUserId
    );
    const postsIdArray = posts.map((obj) => obj.id);
    const postsUserArray = posts.map((obj) => obj.authorId);

    // Add repost user IDs
    posts.forEach((post) => {
      if (post.type === "repost" && post.repostUser) {
        postsUserArray.push(post.repostUser.id);
      }
    });

    const replyToIds = posts
      .filter((post) => post.replyToId)
      .map((post) => post.replyToId);
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
    const uniqueUserIds = [...new Set(postsUserArray)];
    const postsUsers = await queries.getPostUsers(uniqueUserIds);
    const favourites = await queries.countAllLikes(postsIdArray);
    const commentCount = await queries.countAllComments(postsIdArray);
    console.log("2", postsIdArray);
    const retweetCount = await queries.countAllRetweets(postsIdArray);
    const retweetedByData = await queries.getAllRetweetData(postsIdArray);

    const postFeed = await formatPostsForFeedOptimized(
      posts,
      postsUsers,
      favourites,
      commentCount,
      retweetCount,
      originalPosts,
      retweetedByData
    );
    res.json({ postFeed });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

postRouter.post(
  "/posts",
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

postRouter.post(
  "/comments",
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

postRouter.post("/likes", async (req, res) => {
  const user = req.body.user.id;
  const postId = req.body.id;
  const postLiked = await queries.toggleLike(user, postId);
  res.json({ postLiked });
});

postRouter.delete("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await queries.deletePost(postId);
    res.json({ post });
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

postRouter.post("/retweets", async (req, res) => {
  try {
    const userId = req.body.user.id;
    const postId = req.body.id;

    if (!userId || !postId) {
      return res
        .status(400)
        .json({ message: "User ID and Post ID are required" });
    }

    const retweet = await queries.toggleRetweet(userId, postId);
    res.json({ retweet });
  } catch (err) {
    console.error("Failed to toggle retweet", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default postRouter;
