import { ArrowLeft, Calendar } from "lucide-react";

const Profile = ({
  profileData = {
    // hardcoded stuff
    following: 67,
    followers: 50,
    totalPosts: 221,
  },
  darkMode,
  user,
}) => {
  let date = new Date(user.createdAt);
  date = date.toLocaleDateString("en-GB", { month: 'short', year: 'numeric' } );

  return (
    <div
      className={`flex-1 border ${
        darkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      {/* Header Navigation */}
      <div className="flex justify-between p-4 border-b border-gray-800 flex-col bg-black text-white">
        <div className="flex items-center space-x-8">
          <ArrowLeft className="w-5 h-5 cursor-pointer hover:bg-gray-900 rounded-full p-1" />
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">
              {profileData.totalPosts} posts
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div>
        {/* Profile Content */}
        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="mb-4 mt-4">
            <img
              src={user.profilePicUrl}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-black bg-gray-600"
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            {/* Name and Verification */}
            <div className="flex items-center space-x-2">
              <h2 className="text-xl text-white font-bold">{user.name}</h2>
            </div>

            {/* Username */}
            <p className="text-gray-500">@{user.handle}</p>

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
                  {profileData.following}
                </span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-white">
                  {profileData.followers}
                </span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button className="flex-1 py-4 text-center border-b-2 border-blue-500 text-white font-medium">
              Posts
            </button>
            <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 hover:text-white transition-colors">
              Replies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
