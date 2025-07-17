import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Post = ({ user, postId, darkMode, HOST, reply }) => {
  const [liked, setLiked] = useState(null);
  const [retweeted, setRetweeted] = useState(null);
  const [likes, setLikes] = useState(null);
  const [retweets, setRetweets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedPost, setFormattedPost] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormattedPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/getSpecificPost/${postId}`, {
        });
        const data = await res.json();
        setFormattedPost(data.postFeed || []);
        setIsLoading(false);
        return data;
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    };
    fetchFormattedPosts();
  }, [postId, HOST]);

  const postLike = async () => {
    const id = postId;
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
  return (
    <div onClick={() => { console.log("acaa"); console.log("queonda>?", formattedPost); postDetailsRedirect(formattedPost.user.id, formattedPost.id) }}
      id="replies" className={`border-b cursor-pointer transition-colors ${darkMode
        ? "border-gray-800 hover:bg-gray-950"
        : "border-gray-200 hover:bg-gray-50"
        } relative p-4 flex space-x-3`}>
      {reply && <div
        className={`absolute left-10 top-16 w-0.5 ${darkMode ? "bg-gray-600" : "bg-gray-400"
          }`}
        style={{ height: 'calc(100% - 4rem + 1rem)' }}
      />}
      <img
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${formattedPost.user.handle}`);
        }}
        className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
        src={(formattedPost && formattedPost.user && formattedPost.user.profilePicUrl) || null}
        alt="avatar"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <a
            onClick={(e) => {
              console.log(e, "acaaaaa")
              e.stopPropagation();
              navigate(`/profile/${formattedPost.user.handle}`);
            }}
            className={`hover:underline font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"
              }`}
          >
            {formattedPost && formattedPost.user && formattedPost.user.name} {formattedPost && formattedPost.user && formattedPost.user.surname}
          </a>
          <span /* onClick={(e) => e.stopPropagation()} */ className="text-gray-500">
            @{formattedPost && formattedPost.user && formattedPost.user.handle}
          </span>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            ·
          </span>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            {formattedPost && formattedPost.timestamp}
          </span>{user && console.log("user", user)}
          {(formattedPost && formattedPost.user && user && formattedPost.user.id !== user.id && <button
            className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode
              ? 'bg-[rgb(239,243,244)] text-black'
              : 'bg-black text-white'
              }`}

            onClick={(e) => e.stopPropagation()}
          >
            Follow
          </button>)}
        </div>

        <div className="mb-3">
          <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            {formattedPost && (formattedPost.content || formattedPost.text)}
          </p>
          {formattedPost && (formattedPost.image || formattedPost.imageUrl) && (
            <img
              className="rounded-xl max-w-full max-h-80"
              onClick={(e) => e.stopPropagation()}
              src={formattedPost.image || formattedPost.imageUrl}
              alt="posted image"
            />
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-between max-w-md"
        >
          <button
            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
              ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
              : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
          >
            <MessageCircle size={18} />
            <span className="text-sm">{formattedPost && formattedPost.replies}</span>
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
                  formattedPost &&
                  formattedPost.likedBy &&
                  formattedPost.likedBy.userIds &&
                  formattedPost.likedBy.userIds.includes(user.id)
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
  );
};

export default Post;