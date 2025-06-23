import { useState } from 'react'
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';


const PostMainFeed = ({HOST, darkMode, user, post, postUser}) => {
  console.log("user", user)

  const [liked, setLiked] = useState(post.liked);
  const [retweeted, setRetweeted] = useState(post.retweeted);
  const [likes, setLikes] = useState(post.likes);
  const [retweets, setRetweets] = useState(post.retweets);

  const postLike = async () => {
    console.log("post.id", post.id)
    const id = post.id
    try {
      const res = await fetch(`${HOST}/api/v1/newLike/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user }),
      });
      const data = await res.json();
      return data
    } catch (err) {
      console.error("Failed to post new message:", err);
    }
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    postLike()
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  return (

    <div className="flex flex-col bg-black text-white min-h-screen">{console.log(post)}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button className="text-white hover:bg-gray-800 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="flex space-x-3">
        <img className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl" src={postUser.avatar}></img>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <a className={`hover:underline font-bold ${darkMode ? 'text-white' : 'text-black'}`} href='#'>{postUser.name}</a>
            <span className="text-gray-500">@{postUser.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{post.timestamp}</span>
            <div className="ml-auto">
              <button className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}>
                <MoreHorizontal size={16} className={darkMode ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <p className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{post.content}</p>
            {post.image !== null &&
              <img src={post.image} alt="posted image"></img>
            }
          </div>

          <div className="flex justify-between max-w-md">
            <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
              ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
              }`}>
              <MessageCircle size={18} />
              <span className="text-sm">{post.replies}</span>
            </button>

            <button
              onClick={handleRetweet}
              className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${retweeted
                ? (darkMode ? 'text-green-400' : 'text-green-500')
                : (darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/20' : 'text-gray-500 hover:text-green-500 hover:bg-green-50')
                }`}
            >
              <Repeat2 size={18} />
              <span className="text-sm">{retweets}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${liked
                ? (darkMode ? 'text-red-400' : 'text-red-500')
                : (darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-500 hover:text-red-500 hover:bg-red-50')
                }`}
            >
              <Heart size={18} fill={user && post && post.likedBy && post.likedBy.userIds && post.likedBy.userIds.includes(user.id) ? 'currentColor' : 'none'} />
              <span className="text-sm">{likes}</span>
            </button>

            <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
              ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
              }`}>
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons (Comment, Retweet, Like, Share) */}
      <div className="flex justify-around py-3 border-b border-gray-800">
        {/* Comment Button */}
        <div className="flex items-center text-gray-500 hover:text-blue-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm">2</span> {/* Example count */}
        </div>

        {/* Retweet Button */}
        <div className="flex items-center text-gray-500 hover:text-green-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <span className="text-sm">4</span> {/* Example count */}
        </div>

        {/* Like Button */}
        <div className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm">8</span> {/* Example count */}
        </div>

        {/* Share Button */}
        <div className="flex items-center text-gray-500 hover:text-blue-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.882 13.118 9 12.807 9 12s-.118-.807-.316-1.006A3.001 3.001 0 006 10c-1.657 0-3 1.343-3 3s1.343 3 3 3c.807 0 1.5-.316 2.006-.816zm-.006-.006C7.5 13.842 7 14.5 7 15s.5 1.158 1.184 1.842a4.001 4.001 0 005.632 0C14.5 16.158 15 15.5 15 15s-.5-1.158-1.184-1.842a4.001 4.001 0 00-5.632 0zM15 12c0 .807-.118 1.5-.316 2.006A3.001 3.001 0 0018 15c1.657 0 3-1.343 3-3s-1.343-3-3-3c-.807 0-1.5.118-2.006.316z"
            />
          </svg>
        </div>
      </div>

      {/* Reply Section (simplified) */}
      <div className="p-4 flex items-start border-b border-gray-800">
        <img
          src="/path/to/your-avatar.png" // Replace with path to your default user avatar
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <textarea
            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
            rows="2"
            placeholder="Post your reply"
          ></textarea>
          <div className="text-right mt-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostMainFeed;