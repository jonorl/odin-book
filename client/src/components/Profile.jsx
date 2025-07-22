import { ArrowLeft, Calendar } from "lucide-react";
import Post from "./Post";
import { useState, useEffect } from "react";

const Profile = ({
  darkMode,
  user,
  specificUser,
  formattedPosts,
  HOST,
  followersData,
  refetchFollowers,
}) => {
  let date = specificUser?.createdAt && new Date(specificUser?.createdAt);
  date = date?.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  const [activeTab, setActiveTab] = useState("posts");
  const [followingUsers, setFollowingUsers] = useState(followersData?.followingUsers || []);


  const handleFollow = async (userId, targetUserId) => {
    const wasFollowing = isFollowing(targetUserId);
    updateFollowingStatus(targetUserId, !wasFollowing);

    try {
      await followUser(userId, targetUserId);
      await refetchFollowers(); // Refetch followers to sync with server
    } catch (error) {
      updateFollowingStatus(targetUserId, wasFollowing); // Revert on error
      console.error("Failed to update follow status, reverting changes", error);
    }
  };

  const followUser = async (userId, targetUserId) => {
    try {
      const res = await fetch(`${HOST}/api/v1/newFollow/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetUserId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update follow status:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Failed to update follow status");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to follow user", err);
      throw err;
    }
  };

  const isFollowing = (targetUserId) => {
    return followingUsers?.some(follower =>
      follower.followingId === targetUserId || follower.id === targetUserId
    );
  };
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
    <div
      className={`flex-1 border ${darkMode ? "border-gray-800" : "border-gray-200"
        }`}
    >
      {/* Header Navigation */}
      <div
        className={`flex justify-between p-4 border-b  ${darkMode
          ? "bg-black/80 border-gray-800 text-white"
          : "bg-white/80 border-gray-200 text-black"
          }}`}
      >
        <div className="flex items-center space-x-8">
          <ArrowLeft
            size={32}
            className={`cursor-pointer hover:bg-gray-900 rounded-full p-1 ${darkMode ? "text-white" : "text-black"
              }`}
            onClick={() => history.back()}
          />
          <div>
            <h1
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"
                }`}
            >
              {specificUser?.name}
            </h1>
            <p
              className={`text-sm text-gray-500 ${darkMode ? "text-white" : "text-black"
                }`}
            >
              {specificUser?.postCount} posts
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div>
        {/* Profile Content */}
        <div className="px-4 pb-4 flex flex-col items-center">
          {/* Avatar */}
          <div className="mb-4 mt-4">
            <img
              src={specificUser?.profilePicUrl}
              alt={specificUser?.name}
              className={`w-32 h-32 rounded-full bg-gray-600 ${darkMode ? "text-white" : "text-black"
                }
              }`}
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-3 flex flex-col items-center">
            {/* Name and Verification */}
            <div className="flex items-center space-x-2">
              <h2
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"
                  }`}
              >
                {specificUser?.name}&nbsp;{specificUser?.surname}
              </h2>
            </div>

            {user && specificUser && user.id !== specificUser.id && (
              <button
                className={`text-s px-2 py-0.5 rounded-full  ${darkMode ? 'bg-[rgb(239,243,244)] text-black' : 'bg-black text-white'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user.id, specificUser.id);
                }}
              >
                {isFollowing(specificUser.id) ? "Following" : "Follow"}
              </button>
            )}

            {/* Username */}
            <p
              className={`text-gray-500 ${darkMode ? "text-white" : "text-black"
                }`}
            >
              @{specificUser?.handle}
            </p>

            {/* Location and Join Date */}
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined on {date}</span>
              </div>
            </div>

            {/* Following/Followers */}
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-white">
                  {followersData.followingCount}
                </span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-white">
                  {followersData.followerCount}
                </span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>

          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            {/* Posts Button */}
            <button
              className={`flex-1 py-4 text-center ${activeTab === "posts"
                ? "border-b-2 border-blue-500 text-gray-500 font-medium"
                : "text-gray-500 hover:bg-gray-900 hover:text-white"
                } transition-colors`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            {/* Replies Button */}
            <button
              className={`flex-1 py-4 text-center ${activeTab === "replies"
                ? "border-b-2 border-blue-500 text-gray-500 font-medium"
                : "text-gray-500 hover:bg-gray-900 hover:text-white"
                } transition-colors`}
              onClick={() => setActiveTab("replies")}
            >
              Replies
            </button>
          </div>
          {/* 3. Conditionally render content based on the active tab */}
          {activeTab === "posts"
            ? formattedPosts &&
            formattedPosts
              .filter((post) => post.replyToId === null)
              .map((post) => (
                <Post
                  key={post.id}
                  user={user}
                  specificUser={specificUser}
                  HOST={HOST}
                  post={post}
                  darkMode={darkMode}
                  followingUsers={followingUsers}
                  updateFollowingStatus={updateFollowingStatus}
                  refetchFollowers={refetchFollowers} // Pass refetch function
                />
              ))
            : formattedPosts &&
            formattedPosts
              .filter((post) => post.replyToId !== null)
              .map((post) => (
                <Post
                  key={post.id}
                  user={user}
                  specificUser={specificUser}
                  HOST={HOST}
                  post={post}
                  darkMode={darkMode}
                  followingUsers={followingUsers}
                  updateFollowingStatus={updateFollowingStatus}
                  refetchFollowers={refetchFollowers} // Pass refetch function
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
