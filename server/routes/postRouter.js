// routes/postRouter.js
import { Router } from "express";
import { formatPostsForFeedOptimized, /* getTimeAgo, */} from "../services/feedService.js";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import queries from "../db/queries.js";

const postRouter = Router();

postRouter.get("/posts", async (req, res) => {
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

// postRouter.get("/posts/:id", async (req, res) => {
//   const post = await queries.fetchSpecificPost(req.params.id);
//   const postUser = await queries.getPostUser(post);
//   post.user = postUser;
//   post.timestamp = getTimeAgo(post.createdAt);
//   res.json({ postFeed: post });
// });

postRouter.get("/users/:specificUserId/posts", async (req, res) => {
  try {
    const posts = await queries.fetchAllPostsFromSpecificUser(
      req.params.specificUserId
    );
    const postsIdArray = posts.map((obj) => obj.id);
    const postsUserArray = posts.map((obj) => obj.authorId);
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
    const retweetCount = await queries.countAllRetweets(postsIdArray);
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
});

postRouter.get("/posts/:postId/details", async (req, res) => {
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

postRouter.get("/posts/:postId/replies", async (req, res) => {
  try {
    const post = await queries.getPostDetails(req.params.postId);
    const postsComments = await queries.getPostsComments(post.id);
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

export default postRouter;