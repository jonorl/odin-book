import { useState, useEffect } from "react";
import { useTheme } from '../hooks/useTheme';
import { usePost } from '../hooks/usePosts'
import { useUser } from '../hooks/UseUser'
import PostAddendum from './PostAddendum'
import ConfirmationModal from './ConfirmationModal';
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Post = ({ post, isReply }) => {

  const { user, handleFollow, isFollowing, isDisabled } = useUser();
  const { setIsModalOpen, postLike, postRetweet } = usePost();
  const [likes, setLikes] = useState(post?.likes);
  const [retweeted, setRetweeted] = useState(post?.retweetedBy?.userIds?.includes(user?.id) || false);
  const [retweets, setRetweets] = useState(post?.retweets);
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [liked, setLiked] = useState(user && post?.likedBy?.userIds?.includes(user?.id));

  // Trigger re-render when user and post are fully loaded
  useEffect(() => {
    setLiked(user && post?.likedBy?.userIds?.includes(user?.id));
    setRetweeted(user && post?.retweetedBy?.userIds?.includes(user?.id));
  }, [user, post?.likedBy?.userIds, post?.retweetedBy?.userIds]);

  // Checks if post is liked, add/removes counter and does the API call
  const handleLike = (post, user) => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
    postLike(post, user);
  };

  // Updated retweet handler with API call
  const handleRetweet = async () => {
    if (isDisabled) return;

    const wasRetweeted = retweeted;
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);

    try {
      await postRetweet(post, user);
    } catch (error) {
      setRetweeted(wasRetweeted);
      setRetweets(wasRetweeted ? retweets + 1 : retweets - 1);
      console.error("Failed to retweet:", error);
    }
  };

  return (
    <>
      {(post?.originalPost && isReply) && <PostAddendum post={post} />}

      {/* Retweet Header - Show if this is a repost */}
      {post?.isRepost && (
        <div className={`px-4 pt-3 pb-1 border-t ${darkMode ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-600"}`}>
          <div className="flex items-center space-x-2 text-sm">
            <Repeat2 size={16} />
            <span>
              <span
                className="font-medium hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.repostUser.username}`);
                }}
              >
                {post.repostUser.name}
              </span>
              {" "}retweeted
            </span>
            <span>• {post.repostTimestamp}</span>
          </div>
          {post.repostComment && (
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {post.repostComment}
            </p>
          )}
        </div>
      )}

      <div
        onClick={() => navigate(`/${post?.user.id}/${post?.id}`)}
        id="replies"
        className={`border-b cursor-pointer transition-colors ${darkMode ? "border-gray-800 hover:bg-gray-950" : "border-gray-200 hover:bg-gray-50"
          } relative p-4 flex space-x-3`}
      >
        <img
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${post?.user?.username}`);
          }}
          className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
          src={(post?.user?.avatar) || null}
          alt="avatar"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <a
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${post?.user?.username}`);
              }}
              className={`hover:underline font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"
                }`}
            >
              {post?.user?.name}
            </a>
            <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
              @{post?.user?.username}
            </span>
            <span onClick={(e) => e.stopPropagation()} className="text-gray-500">·</span>
            <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
              {post?.timestamp}
            </span>
            {post?.user?.id === user?.id &&
              <div>
                <Trash2 size={18} className="text-red-500" onClick={(e) => {
                  e.stopPropagation(); setIsModalOpen(true)
                }} />
                <ConfirmationModal
                  postId={post?.id}
                  returnToHomepage={false}
                />
              </div>}
            {user && post?.user?.id !== user?.id && (
              <button
                className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode ? 'bg-[rgb(239,243,244)] text-black' : 'bg-black text-white'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user.id, post?.user?.id);
                }}
              >
                {isFollowing(post?.user?.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="mb-3">
            <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              {post && (post?.content || post?.text)}
            </p>
            {post && (post?.image || post?.imageUrl) && (
              <img
                className="rounded-xl max-w-full max-h-80"
                onClick={(e) => e.stopPropagation()}
                src={post?.image || post?.imageUrl}
                alt="posted image"
              />
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex justify-between max-w-md">
            <button
              className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
                ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                }`}
            >
              <MessageCircle size={18} />
              <span className="text-sm">{post?.replies}</span>
            </button>
            <button
              onClick={handleRetweet}
              disabled={isDisabled}
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
              disabled={isDisabled}
              onClick={() => handleLike(post, user)}
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
                  user && liked
                    ? "currentColor"
                    : "none"}
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
    </>
  );
};

export default Post;
