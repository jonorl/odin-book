import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, ArrowLeft } from "lucide-react";
import PostComposer from "./PostComposer";
import Post from "./Post";

const PostMainFeed = ({ HOST, darkMode, user, post, postUser, isLoading }) => {
  const [liked, setLiked] = useState(post.liked);
  const [retweeted, setRetweeted] = useState(post.retweeted);
  const [likes, setLikes] = useState(post.likes);
  const [retweets, setRetweets] = useState(post.retweets);
  const [postReplies, setPostReplies] = useState(null);

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

  useEffect(() => {
    const fetchFormattedPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/postReplies/${post.id}/`, {});
        const data = await res.json();
        setPostReplies(data.postFeed || []);
        return data;
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    };
    fetchFormattedPosts();
  }, [HOST, post.id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    postLike();
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  return (
    <div
      className={`flex-1 border  ${darkMode ? "border-gray-800" : "border-gray-200"
        }`}
    >
      <div id="backButton" className="flex flex-col bg-black text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={() => history.back()}
            className="cursor-pointer text-white hover:bg-gray-800 rounded-full p-2"
          >
            <ArrowLeft
              size={32}
              className="cursor-pointer hover:bg-gray-900 rounded-full p-1"
            />
          </button>
        </div>

        {/* Post Content */}{/* {console.log("posteo", post)}{console.log("dale loco", post.id, post.user.id)} */}
        {isLoading ? (
          <div className="spinner spinner-container"></div>
        ) : (
          <div
            className="flex space-x-3 border-b p-4 cursor-pointer transition-colors border-gray-800 hover:bg-gray-950"
            onClick={() => {
              console.log("jodeme que era aca")
              /* navigate(`/profile/${post.user.username}`) */
              navigate(`/${post.user.id}/${post.id}`);
            }}
          >
            <img
              className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
              src={postUser.profilePicUrl}
            ></img>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <a
                  className={`hover:underline font-bold ${darkMode ? "text-white" : "text-black"
                    }`}
                  onClick={() => {
                    navigate(`/profile/${post.user.username}`);
                  }}
                >
                  {postUser.name} {postUser.surname}
                </a>
                <span className="text-gray-500">@{postUser.handle}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{post.timestamp}</span>
                <div className="ml-auto"></div>
              </div>

              <div className="mb-3">
                <p className={darkMode ? "text-gray-200" : "text-gray-900"}>
                  {post.content}
                </p>
                {post.image !== null && (
                  <img
                    className="rounded-xl max-h-80"
                    src={post.image}
                    alt="posted image"
                  ></img>
                )}
              </div>

              <div className="flex justify-between max-w-md">
                <button
                  className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
                      ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                      : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.replies}</span>
                </button>

                <button
                  onClick={handleRetweet}
                  className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${retweeted
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
                  className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${liked
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
                  className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
                      ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                      : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                >
                  <Share size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {user !== null && (
          <PostComposer
            darkMode={darkMode}
            HOST={HOST}
            user={user}
            originalPostId={post.id}
            redirected="true"
          />
        )}
      </div>

      {post.replies > 0 &&
        postReplies &&
        postReplies.map((post) => (
          <Post key={post.id} user={user} HOST={HOST} post={post} darkMode={darkMode} />
        ))}
    </div>
  );
};

export default PostMainFeed;
