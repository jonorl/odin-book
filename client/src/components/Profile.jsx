import { ArrowLeft, Calendar } from "lucide-react";
import Post from "./Post";
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const Profile = () => {
  const { darkMode, profileActiveTab, setProfileActiveTab } = useTheme();
  const { formattedProfilePosts, followers, date, HOST, user, specificUser, handleFollow, isFollowing } = useUser();

  return (
    <div
      className={`flex-1 border ${darkMode ? "border-gray-800" : "border-gray-200"
        }`}
    >{console.log("followers", followers)}
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
              {specificUser?.postCount} Profile
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
                  {followers.followingCount}
                </span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-white">
                  {followers.followerCount}
                </span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>

          </div>
        </div>
        {/* Navigation Tabs */}
        <div className={`border-b ${darkMode ? "border-gray-800" : "border-gray-200"} `}>
          <div className="flex">
            {/* Posts Button */}
            <button
              className={`flex-1 py-4 text-center ${profileActiveTab === "posts"
                ? "border-b-2 border-blue-500 text-gray-500 font-medium"
                : "text-gray-500 hover:bg-gray-900 hover:text-white"
                } transition-colors`}
              onClick={() => setProfileActiveTab("posts")}
            >
              Posts
            </button>
            {/* Replies Button */}
            <button
              className={`flex-1 py-4 text-center ${profileActiveTab === "replies"
                ? "border-b-2 border-blue-500 text-gray-500 font-medium"
                : "text-gray-500 hover:bg-gray-900 hover:text-white"
                } transition-colors`}
              onClick={() => setProfileActiveTab("replies")}
            >
              Replies
            </button>
          </div>
          {/* 3. Conditionally render content based on the active tab */}
          {profileActiveTab === "posts"
            ? formattedProfilePosts &&
            formattedProfilePosts
              .filter((post) => post.replyToId === null)
              .map((post) => (
                <Post key={post.id} post={post} isReply={false} />
              ))
            : formattedProfilePosts &&
            formattedProfilePosts
              .filter((post) => post.replyToId !== null)
              .map((post) => (
                <Post key={post.id} post={post} isReply={true} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
