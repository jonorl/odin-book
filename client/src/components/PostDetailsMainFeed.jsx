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
  const { isDisabled, postDetails, user, isFollowing, postUserDetails, handleFollow, postReplies, fetchFormattedPosts, originalPost, fetchPostDetails } = useUser();
  const { setIsModalOpen, postLike } = usePost();
  const [liked, setLiked] = useState(user && postDetails?.likedBy?.userIds?.includes(user?.id));
  const [likes, setLikes] = useState(postDetails?.likes);
  const [retweeted, setRetweeted] = useState(postDetails?.retweeted);
  const [retweets, setRetweets] = useState(postDetails?.retweets);
  const navigate = useNavigate();

  // Fetch all post details including replies upon all hooks loading
  useEffect(() => {
    fetchFormattedPosts(postDetails);
  }, [postDetails, fetchFormattedPosts]);

  // Fetch all post details including replies upon all hooks loading
  useEffect(() => {
    fetchPostDetails(postDetails?.replyToId, true);
  }, [postDetails?.replyToId, fetchPostDetails]);

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

  // WIP Retweeting
  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  return (
    <div
      className={`flex-1 border ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
        }`}
    >
      <div id="backButton" className={`flex flex-col ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
        }`}>
        <div className={`flex items-center p-4 border-b ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
          }`}>
          <button
            onClick={() => history.back()}
            className={`cursor-pointer ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
              } rounded-full p-2`}
          >
            <ArrowLeft
              size={32}
              className={`cursor-pointer ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
                } rounded-full p-1`}
            />
          </button><div className={`justify-start text-xl font-bold ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
            }`}>Thread</div>

        </div>

        {/* If original post exists, render it */}
        {(postDetails.replyToId) && <>
          <Post key={postDetails.replyToId} post={originalPost} reply={false} />
        </>}

        {/* Post Content */}
        <div
          id="agrega aca el condicional" className={`relative flex space-x-3 border-b p-4 cursor-pointer transition-colors ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
            } `}
          onClick={() => {
            navigate(`/${postDetails.user.id}/${postDetails.id}`);
          }}
        >
          <img
            className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
            src={postUserDetails.profilePicUrl}
          ></img>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <a
                className={`hover:underline font-bold ${darkMode ? "text-white" : "text-black"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${postDetails.user.username}`);
                }}
              >
                {postUserDetails.name} {postUserDetails.surname}
              </a>
              <span className="text-gray-500">@{postUserDetails.handle}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{postDetails.timestamp}</span>
              {postDetails?.user?.id === user?.id &&
                <div>
                  <Trash2 size={18} className="text-red-500" onClick={(e) => {
                    e.stopPropagation(); setIsModalOpen(true)
                  }} />
                  <ConfirmationModal
                    postId={postDetails?.id}
                    returnToHomepage={true}
                  />
                </div>}

              {(postDetails?.user && user && postDetails?.user?.id !== user?.id && <button
                className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode
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

            <div className="mb-3">
              <p className={darkMode ? "text-gray-200" : "text-gray-900"}>
                {postDetails?.content}
              </p>
              {postDetails?.image !== null && (
                <img
                  className="rounded-xl max-h-80"
                  src={postDetails?.image}
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
                <span className="text-sm">{postDetails?.replies}</span>
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
                onClick={() => handleLike(postDetails, user)}
                disabled={isDisabled}
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
