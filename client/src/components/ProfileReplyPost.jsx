import { useState, useEffect } from "react";
import { useTheme } from '../hooks/useTheme';
import { usePost } from '../hooks/usePosts'
import { useUser } from '../hooks/UseUser'
import Post from './Post'
import ConfirmationModal from './ConfirmationModal';
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileReplyPost = ({ post }) => {
  const [likes, setLikes] = useState(post?.likes);
  const [retweeted, setRetweeted] = useState((post?.retweeted) || false);
  const [retweets, setRetweets] = useState(post?.retweets);
  const navigate = useNavigate();

  const { darkMode } = useTheme();
  const { user, specificUser, handleFollow, isFollowing } = useUser();
  const { isModalOpen, setIsModalOpen, handleConfirmDelete, postLike } = usePost();
  const [liked, setLiked] = useState(user && post?.likedBy?.userIds?.includes(user?.id));

  // Trigger re-render when user and post are fully loaded to fetch liked posts.
  useEffect(() => {
    setLiked(user && post?.likedBy?.userIds?.includes(user?.id));
  }, [user, post?.likedBy?.userIds]);

  // Checks if post is liked, add/removes counter and does the list POST fetching
  const handleLike = (post, user) => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
    console.log("post", post, "user", user)
    postLike(post, user);
  };

  // WIP Retweeting
  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  if (post?.originalPost) {
    return (
      <div className="">
        <div>
          <div
            id="originalPost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${post.originalPost.user?.id}/${post.originalPost?.id}`);
            }}
            className={`p-4 cursor-pointer transition-colors ${darkMode ? "border-gray-800 hover:bg-gray-950" : "border-gray-200 hover:bg-gray-50"
              } relative mb-4`}
          >
            <div className="flex space-x-3 border-l-0">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  if (post.originalPost.user) {
                    navigate(`/profile/${post.originalPost.user?.username}`);
                  }
                }}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
                src={post?.originalPost?.user?.avatar || null}
                alt="avatar"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <a
                    className={`hover:underline font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"
                      }`}
                  >
                    {post?.originalPost?.user?.name || "Unknown User"}
                  </a>
                  <span className="text-gray-500">
                    @{post?.originalPost?.user?.username || "unknown"}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">{post?.originalPost?.timestamp}</span>
                  {user && post?.originalPost?.user && post?.originalPost?.user?.id !== specificUser.id && (
                    <button
                      className={`text-s px-2 py-0.5 rounded-full ml-auto ${darkMode ? 'bg-[rgb(239,243,244)] text-black' : 'bg-black text-white'
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id, post.originalPost.user?.id);
                      }}
                    >
                      {isFollowing(post.originalPost.user?.id) ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <p className={`mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {post?.originalPost?.content}
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
            <div className="ml-0 pl-0">{<Post post={post} />}</div>
          </div>
        </div>
      </div>
    );
  } else { return <div className="ml-0 pl-0">{<Post post={post} />}</div> }
}


export default ProfileReplyPost;