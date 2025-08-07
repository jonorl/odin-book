import { useState, useEffect } from "react";
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'
import { usePost } from '../hooks/usePosts'
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, ArrowLeft, Trash2 } from "lucide-react";
import PostComposer from "./PostComposer";
import Post from "./Post"
import ConfirmationModal from './ConfirmationModal';

const PostDetailsMainFeed = () => {

  const { darkMode } = useTheme();
  const { isDisabled, postDetails, user, isFollowing, postUserDetails, handleFollow, postReplies, originalPost } = useUser();
  const { setIsModalOpen, postLike } = usePost();
  const [liked, setLiked] = useState(user && postDetails?.likedBy?.userIds?.includes(user?.id));
  const [likes, setLikes] = useState(postDetails?.likes);
  const [retweeted, setRetweeted] = useState(postDetails?.retweeted);
  const [retweets, setRetweets] = useState(postDetails?.retweets);
  const [shareSuccess, setShareSuccess] = useState(false);
  const navigate = useNavigate();

  // Trigger re-render when user and post are fully loaded to fetch liked posts.
  useEffect(() => {
    setLiked(user && postDetails?.likedBy?.userIds?.includes(user?.id));
  }, [user, postDetails?.likedBy?.userIds]);

  // Checks if post is liked, add/removes counter and does the list POST fetching
  const handleLike = (post, user) => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
    postLike(post, user);
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

    const handleShare = async (post) => {
    const postUrl = `${window.location.origin}/${post?.user.id}/${post?.id}`;

    try {
      if (navigator.share) {
        // Use native share API if available (mobile devices)
        await navigator.share({
          title: `${post?.user?.name} on Twitter Clone`,
          text: post?.content || post?.text,
          url: postUrl,
        });
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(postUrl);
        setShareSuccess(true);

        // Reset success state after 2 seconds
        setTimeout(() => {
          setShareSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to share:', error);
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    }
  };

  return (
    <div
      className={`flex-1 border ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
        }`}
    >
      <div id="backButton" className={`flex flex-col ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
        }`}>
        <div className={`flex items-center p-3 sm:p-4 border-b ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
          }`}>
          <button
            onClick={() => history.back()}
            className={`cursor-pointer ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
              } rounded-full p-1 sm:p-2`}
          >
            <ArrowLeft
              size={24}
              className={`sm:hidden cursor-pointer ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
                } rounded-full p-1`}
            />
            <ArrowLeft
              size={32}
              className={`hidden sm:block cursor-pointer ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
                } rounded-full p-1`}
            />
          </button>
          <div className={`justify-start text-lg sm:text-xl font-bold ml-2 sm:ml-0 ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
            }`}>Thread</div>
        </div>

        {/* If original post exists, render it */}
        {(postDetails?.replyToId) && <>
          <Post key={postDetails.replyToId} post={originalPost} reply={false} />
        </>}

        {/* Post Content */}
        <div
          id="agrega aca el condicional" className={`relative flex space-x-2 sm:space-x-3 border-b p-3 sm:p-4 cursor-pointer transition-colors ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
            } `}
          onClick={() => {
            navigate(`/${postDetails?.user?.id}/${postDetails?.id}`);
          }}
        >
          <img
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-base sm:text-lg md:text-xl"
            src={postUserDetails?.profilePicUrl}
          ></img>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 min-w-0">
              <a
                className={`hover:underline font-bold cursor-pointer text-sm sm:text-base truncate ${darkMode ? "text-white" : "text-black"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${postDetails?.user?.username}`);
                }}
              >
                {postUserDetails?.name} {postUserDetails?.surname}
              </a>
              <span className="text-gray-500 text-xs sm:text-sm truncate">@{postUserDetails?.handle}</span>
              <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">·</span>
              <span className="text-gray-500 text-xs sm:text-sm truncate">{postDetails?.timestamp}</span>
              {postDetails?.user?.id === user?.id &&
                <div className="ml-auto flex-shrink-0">
                  <Trash2 size={14} className="sm:hidden text-red-500 cursor-pointer" onClick={(e) => {
                    e.stopPropagation(); setIsModalOpen(true)
                  }} />
                  <Trash2 size={16} className="hidden sm:block md:hidden text-red-500 cursor-pointer" onClick={(e) => {
                    e.stopPropagation(); setIsModalOpen(true)
                  }} />
                  <Trash2 size={18} className="hidden md:block text-red-500 cursor-pointer" onClick={(e) => {
                    e.stopPropagation(); setIsModalOpen(true)
                  }} />
                  <ConfirmationModal
                    postId={postDetails?.id}
                    returnToHomepage={true}
                  />
                </div>}

              {(user && postDetails?.user && postDetails?.user?.id !== user?.id && <button
                className={`text-xs sm:text-sm px-2 py-0.5 rounded-full ml-auto flex-shrink-0 whitespace-nowrap ${darkMode
                  ? 'bg-[rgb(239,243,244)] text-black'
                  : 'bg-black text-white'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  { handleFollow(user?.id, postDetails?.user?.id) }
                }}
              >
                {isFollowing(postDetails?.user?.id) ? "Following" : "Follow"}
              </button>)}
            </div>

            <div className="mb-2 sm:mb-3">
              <p className={`mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed break-words ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                {postDetails?.content}
              </p>
              {postDetails?.image !== null && (
                <img
                  className="rounded-xl max-w-full h-auto max-h-48 sm:max-h-60 md:max-h-80 object-cover"
                  src={postDetails?.image}
                  alt="posted image"
                ></img>
              )}
            </div>

            <div className="flex justify-between items-center max-w-full sm:max-w-xs md:max-w-md" onClick={(e) => e.stopPropagation()}>
              <button
                className={`flex items-center space-x-1 sm:space-x-2 rounded-full p-1 sm:p-1.5 md:p-2 group transition-colors ${darkMode
                  ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                  : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                  }`}
              >
                <MessageCircle size={14} className="sm:hidden flex-shrink-0" />
                <MessageCircle size={16} className="hidden sm:block md:hidden flex-shrink-0" />
                <MessageCircle size={18} className="hidden md:block flex-shrink-0" />
                <span className="text-xs sm:text-sm">{postDetails?.replies || 0}</span>
              </button>

              <button
                onClick={handleRetweet}
                disabled={isDisabled}
                className={`flex items-center space-x-1 sm:space-x-2 rounded-full p-1 sm:p-1.5 md:p-2 group transition-colors ${retweeted
                  ? darkMode
                    ? "text-green-400"
                    : "text-green-500"
                  : darkMode
                    ? "text-gray-400 hover:text-green-400 hover:bg-green-900/20"
                    : "text-gray-500 hover:text-green-500 hover:bg-green-50"
                  }`}
              >
                <Repeat2 size={14} className="sm:hidden flex-shrink-0" />
                <Repeat2 size={16} className="hidden sm:block md:hidden flex-shrink-0" />
                <Repeat2 size={18} className="hidden md:block flex-shrink-0" />
                <span className="text-xs sm:text-sm">{retweets || 0}</span>
              </button>

              <button
                onClick={() => handleLike(postDetails, user)}
                disabled={isDisabled}
                className={`flex items-center space-x-1 sm:space-x-2 rounded-full p-1 sm:p-1.5 md:p-2 group transition-colors ${liked
                  ? darkMode
                    ? "text-red-400"
                    : "text-red-500"
                  : darkMode
                    ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
              >
                <Heart
                  size={14}
                  className="sm:hidden flex-shrink-0"
                  fill={
                    user && liked
                      ? "currentColor"
                      : "none"}
                />
                <Heart
                  size={16}
                  className="hidden sm:block md:hidden flex-shrink-0"
                  fill={
                    user && liked
                      ? "currentColor"
                      : "none"}
                />
                <Heart
                  size={18}
                  className="hidden md:block flex-shrink-0"
                  fill={
                    user && liked
                      ? "currentColor"
                      : "none"}
                />
                <span className="text-xs sm:text-sm">{likes || 0}</span>
              </button>

            <button
              onClick={() => handleShare(postDetails)}
              className={`flex items-center space-x-1 md:space-x-2 rounded-full p-1.5 md:p-2 group transition-colors relative ${
                shareSuccess
                  ? darkMode
                    ? "text-green-400"
                    : "text-green-500"
                  : darkMode
                    ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                    : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              <Share size={16} className="md:hidden" />
              <Share size={18} className="hidden md:block" />
              {shareSuccess && (
                <span className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            </div>
          </div>
        </div>

        {user !== null && (
          <PostComposer redirected="true" />
        )}
      </div>

      {postDetails?.replies > 0 &&
        postReplies?.map((postReply) => (
          <Post key={postReply.id} post={postReply} isReply={false} />
        ))}
    </div>
  );
};

export default PostDetailsMainFeed;
