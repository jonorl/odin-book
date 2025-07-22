// MainFeed.jsx
import { useState, useEffect } from 'react';
import PostComposer from './PostComposer';
import Post from './Post';

const MainFeed = ({ darkMode, formattedPosts, isLoading, HOST, user, followersData, refetchFollowers }) => {
  const [activeTab, setActiveTab] = useState("Following");
  const [followingUsers, setFollowingUsers] = useState(followersData?.followingUsers || []);

  // Sync followingUsers with followersData when it changes
  useEffect(() => {
    setFollowingUsers(followersData?.followingUsers || []);
  }, [followersData]);

  const updateFollowingStatus = (targetUserId, isFollowing) => {
    if (isFollowing) {
      setFollowingUsers(prev => [...prev, { followingId: targetUserId }]);
    } else {
      setFollowingUsers(prev =>
        prev.filter(follower =>
          follower.followingId !== targetUserId && follower.id !== targetUserId
        )
      );
    }
  };

  return (
    <div className={`flex-1 border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className={`top-0 backdrop-blur p-4 ${darkMode
        ? 'bg-black/80 border-gray-800'
        : 'bg-white/80 border-gray-200'
      }`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Home</h1>
      </div>
      <div className="flex">
        <button
          className={`flex-1 py-4 text-center ${activeTab === "For you"
            ? "border-b-2 border-blue-500 text-gray-500 font-medium"
            : "text-gray-500 hover:bg-gray-900 hover:text-white"
          } transition-colors`}
          onClick={() => setActiveTab("For you")}
        >
          For you
        </button>
        <button
          className={`flex-1 py-4 text-center ${activeTab === "Following"
            ? "border-b-2 border-blue-500 text-gray-500 font-medium"
            : "text-gray-500 hover:bg-gray-900 hover:text-white"
          } transition-colors`}
          onClick={() => setActiveTab("Following")}
        >
          Following
        </button>
      </div>
      {user !== null && (
        <PostComposer darkMode={darkMode} HOST={HOST} user={user} />
      )}
      {isLoading ? (
        <div className='spinner spinner-container'></div>
      ) : (
        formattedPosts.length > 0 && (
          <div>
            {formattedPosts.map(post => (
              <Post
                user={user}
                specificUser={user}
                HOST={HOST}
                key={post.id}
                post={post}
                darkMode={darkMode}
                followingUsers={followingUsers}
                updateFollowingStatus={updateFollowingStatus}
                refetchFollowers={refetchFollowers} // Pass refetch function
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MainFeed;