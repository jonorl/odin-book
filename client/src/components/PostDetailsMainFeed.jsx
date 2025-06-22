const PostDetailsMainFeed = () => {
  return (
    <div className="flex flex-col bg-black text-white min-h-screen">
      {/* Header: Back Button and Reply Button */}
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
        <h2 className="text-xl font-bold">Post</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
          Reply
        </button>
      </div>

      {/* Post Content */}
      <div className="p-4 border-b border-gray-800">
        {/* User Info */}
        <div className="flex items-center mb-2">
          <img
            src="/path/to/nrm-avatar.png" // Replace with actual path to NRM avatar
            alt="National Rejoin March"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-bold">National Rejoin March</p>
            <p className="text-gray-500 text-sm">@MarchForRejoin</p>
          </div>
        </div>

        {/* Tweet Text */}
        <p className="mb-4">
          The "don't knows" are starting to make up their mind in 2025.
        </p>
        <p className="text-blue-500 mb-4">They're choosing #ReJoinEU</p>

        {/* Image/Chart (replace with actual image source) */}
        <div className="mb-4">
          <img
            src="/path/to/image_1d348c.png" // Replace with the actual path to your image
            alt="Poll of Polls: UK Support for Rejoining the EU (2023-2025)"
            className="rounded-lg w-full h-auto"
          />
        </div>

        {/* Timestamp */}
        <p className="text-gray-500 text-sm">
          9:54 AM · Jun 22, 2025
        </p>
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

      {/* Example Comment (You'd likely map over an array of comments here) */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img
            src="/path/to/nrm-avatar.png" // Assuming the NRM account is commenting on its own post
            alt="National Rejoin March"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-bold">National Rejoin March</p>
            <p className="text-gray-500 text-sm">@MarchForRejoin · 24m</p>
          </div>
        </div>
        <p className="mb-2">
          Join the campaign...
          <br />
          <a href="http://MarchForRejoin.co.uk" className="text-blue-500 hover:underline">
            MarchForRejoin.co.uk
          </a>
          <br />
          for all the info you need, join in, petitions, action and more!
        </p>
        {/* Placeholder for the two stars - you might use an SVG or an icon library here */}
        <div className="flex space-x-1 mt-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsMainFeed;