import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Post = ({ user, post, darkMode, HOST }) => {
  const [liked, setLiked] = useState((post && post.liked) || false);
  const [retweeted, setRetweeted] = useState((post && post.retweeted) || false);
  const [likes, setLikes] = useState(post && post.likes);
  const [retweets, setRetweets] = useState(post && post.retweets);

  const navigate = useNavigate();

  const postLike = async () => {
    const id = post.id;
    try {
      const res = await fetch(`${HOST}/api/v1/newLike/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    }
  };

  const postDetailsRedirect = (userId, postId) => {
    navigate(`/${userId}/${postId}`);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    postLike();
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  // Helper function to render a single post content (for reply posts only)
  const renderPostContent = (postData) => (
    <div className="flex space-x-3">
      <img
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${postData.user.username}`);
        }}
        className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
        src={(postData && postData.user && postData.user.avatar) || null}
        alt="avatar"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <a
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${postData.user.username}`);
            }}
            className={`hover:underline font-bold cursor-pointer ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {postData && postData.user && postData.user.name}
          </a>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            @{postData && postData.user && postData.user.username}
          </span>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            ·
          </span>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            {postData && postData.timestamp}
          </span>
        </div>

        <div className="mb-3">
          <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            {postData && (postData.content || postData.text)}
          </p>
          {postData && (postData.image || postData.imageUrl) && (
            <img
              className="rounded-xl max-w-full"
              onClick={(e) => e.stopPropagation()}
              src={postData.image || postData.imageUrl}
              alt="posted image"
            />
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-between max-w-md"
        >
          <button
            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <MessageCircle size={18} />
            <span className="text-sm">{postData && postData.replies}</span>
          </button>

          <button
            onClick={handleRetweet}
            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              retweeted
                ? darkMode
                  ? "text-green-400"
                  : "text-green-500"
                : darkMode
                ? "text-gray-400 hover:text-green-400 hover:bg-green-900/20"
                : "text-gray-500 hover:text-green-500 hover:bg-green-50"
            }`}
          >
            <Repeat2 size={18} />
            <span className="text-sm">{retweets}</span>
          </button>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              liked
                ? darkMode
                  ? "text-red-400"
                  : "text-red-500"
                : darkMode
                ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart
              size={18}
              fill={
                user &&
                post &&
                post.likedBy &&
                post.likedBy.userIds &&
                post.likedBy.userIds.includes(user.id)
                  ? "currentColor"
                  : "none"
              }
            />
            <span className="text-sm">{likes}</span>
          </button>

          <button
            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <Share size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  // If this is a reply with an original post, show the threaded view
  if (post && post.originalPost) {
    return (
      <div
        className={`border-b p-4 cursor-pointer transition-colors ${
          darkMode
            ? "border-gray-800 hover:bg-gray-950"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div onClick={() => postDetailsRedirect(post.user.id, post.id)}>
          {/* Original Post */}
          <div className="relative">
            <div className="flex space-x-3">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  if (post.originalPost.user) {
                    navigate(`/profile/${post.originalPost.user.username}`);
                  }
                }}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
                src={post.originalPost.user?.avatar || null}
                alt="avatar"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      if (post.originalPost.user) {
                        navigate(`/profile/${post.originalPost.user.username}`);
                      }
                    }}
                    className={`hover:underline font-bold cursor-pointer ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {post.originalPost.user?.name || "Unknown User"}
                  </a>
                  <span className="text-gray-500">
                    @{post.originalPost.user?.username || "unknown"}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">
                    {post.originalPost.timestamp}
                  </span>
                </div>

                <div className="mb-3">
                  <p
                    className={`mb-3 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {post.originalPost.content}
                  </p>
                  {post.originalPost.image && (
                    <img
                      className="rounded-xl max-w-full"
                      onClick={(e) => e.stopPropagation()}
                      src={post.originalPost.image}
                      alt="posted image"
                    />
                  )}
                </div>
                {/* No interaction buttons for original post */}
              </div>
            </div>

            {/* Connecting Line */}
            <div
              className={`absolute left-6 top-16 w-0.5 h-8 ${
                darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
          </div>

          {/* Reply Post */}
          <div className="mt-2">{renderPostContent(post)}</div>
        </div>
      </div>
    );
  }

  // Regular single post view
  return (
    <div
      className={`border-b p-4 cursor-pointer transition-colors ${
        darkMode
          ? "border-gray-800 hover:bg-gray-950"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div onClick={() => postDetailsRedirect(post.user.id, post.id)}>
        {renderPostContent(post)}
      </div>
    </div>
  );
};

export default Post;
