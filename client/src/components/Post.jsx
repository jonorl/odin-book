import { useState } from "react";
import { useTheme } from '../hooks/useTheme';
import { usePost } from '../hooks/usePosts'
import { useUser } from '../hooks/UseUser'
import ConfirmationModal from './ConfirmationModal';
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Post = ({ post, followingUsers, updateFollowingStatus }) => {
  const [likes, setLikes] = useState(post?.likes);
  const [liked, setLiked] = useState(post?.likes !== 0 ? true : false);

  const [retweeted, setRetweeted] = useState((post?.retweeted) || false);
  const [retweets, setRetweets] = useState(post?.retweets);
  const navigate = useNavigate();

  const { darkMode } = useTheme();
  const { user, specificUser, fetchUserAndData, followUser } = useUser();
  const { isModalOpen, setIsModalOpen, handleConfirmDelete, postLike } = usePost();


  const isFollowing = (targetUserId) => {
    return followingUsers?.some(follower =>
      follower.followingId === targetUserId || follower.id === targetUserId
    );
  };

  const handleFollow = async (userId, targetUserId) => {
    const wasFollowing = isFollowing(targetUserId);
    updateFollowingStatus(targetUserId, !wasFollowing);

    try {
      await followUser(userId, targetUserId);
      await fetchUserAndData(); // Refetch followers to sync with server
    } catch (error) {
      updateFollowingStatus(targetUserId, wasFollowing); // Revert on error
      console.error("Failed to update follow status, reverting changes", error);
    }
  };

  const handleLike = (post, user) => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
    postLike(post, user);
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  const renderPostContent = (postData) => (

    // Rendering of posts
    <div
      onClick={() => navigate(`/${postData.user.id}/${postData.id}`)}
      id="replies"
      className={`border-b cursor-pointer transition-colors ${darkMode ? "border-gray-800 hover:bg-gray-950" : "border-gray-200 hover:bg-gray-50"
        } relative p-4 flex space-x-3`}
    >
      {/* The for you implementation needs to take postData.user.id and compare it against each value in the followingUsers array */}
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
            className={`hover:underline font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"
              }`}
          >
            {postData && postData.user && postData.user.name}
          </a>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">
            @{postData && postData.user && postData.user.username}
          </span>
          <span onClick={(e) => e.stopPropagation()} className="text-gray-500">·</span>
          <span id="hola" onClick={(e) => e.stopPropagation()} className="text-gray-500">
            {postData && postData.timestamp}
          </span>
          {postData?.user?.id === user?.id &&
            <div>
              <Trash2 size={18} className="text-red-500" onClick={(e) => {
                e.stopPropagation(); setIsModalOpen(true)
              }} />
              <ConfirmationModal
                darkMode={darkMode}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                postId={postData.id}
              />
            </div>}
          {user && postData.user && postData.user.id !== user.id && (
            <button id="ComoTas?"
              className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode ? 'bg-[rgb(239,243,244)] text-black' : 'bg-black text-white'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(user.id, postData.user.id);
              }}
            >

              {isFollowing(postData.user.id) ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <div className="mb-3">
          <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            {postData && (postData.content || postData.text)}
          </p>
          {postData && (postData.image || postData.imageUrl) && (
            <img
              className="rounded-xl max-w-full max-h-80"
              onClick={(e) => e.stopPropagation()}
              src={postData.image || postData.imageUrl}
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
            <span className="text-sm">{postData && postData.replies}</span>
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
          </button>{console.log("liked", post)}
          <button
            onClick={() => handleLike(postData, user)}
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
                user && post?.likedBy?.userIds?.includes(user?.id)
                  ? (darkMode ? "rgb(248 113 113)" : "rgb(239 68 68)") 
                  : "none" 
              }
              stroke={
                user && post?.likedBy?.userIds?.includes(user?.id)
                  ? "none" 
                  : (darkMode ? "rgb(156 163 175)" : "rgb(107 114 128)") 
              }
              strokeWidth={
                user && post?.likedBy?.userIds?.includes(user?.id)
                  ? 0 // No stroke width when liked
                  : 2 // Default stroke width for the border when not liked (adjust as needed)
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

  // Conditional for profile view / reply view
  if (post && post.originalPost) {
    return (
      <div className="">
        <div>
          <div
            id="originalPost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${post.originalPost.user.id}/${post.originalPost.id}`);
            }}
            className={`p-4 cursor-pointer transition-colors ${darkMode ? "border-gray-800 hover:bg-gray-950" : "border-gray-200 hover:bg-gray-50"
              } relative mb-4`}
          >
            <div className="flex space-x-3 border-l-0">
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
                    className={`hover:underline font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"
                      }`}
                  >
                    {post.originalPost.user?.name || "Unknown User"}
                  </a>
                  <span className="text-gray-500">
                    @{post.originalPost.user?.username || "unknown"}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">{post.originalPost.timestamp}</span>
                  {user && post.originalPost.user && post.originalPost.user.id !== specificUser.id && (
                    <button
                      className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode ? 'bg-[rgb(239,243,244)] text-black' : 'bg-black text-white'
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id, post.originalPost.user.id);
                      }}
                    >
                      {isFollowing(post.originalPost.user.id) ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {post.originalPost.content}
                  </p>
                  {post?.post?.originalPost?.post?.originalPost?.image && (
                    <img
                      className="rounded-xl max-w-full max-h-80"
                      onClick={(e) => e.stopPropagation()}
                      src={post.originalPost.image}
                      alt="posted image"
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              className={`absolute left-10 top-16 w-0.5 ${darkMode ? "bg-gray-600" : "bg-gray-400"}`}
              style={{ height: 'calc(100% - 4rem + 1rem)' }}
            />
          </div>
          <div className={`ml-0 pl-0 relative`}>
            <div className="ml-0 pl-0">{renderPostContent(post)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cursor-pointer transition-colors`}>
      <div>{renderPostContent(post)}</div>
    </div>
  );
};

export default Post;