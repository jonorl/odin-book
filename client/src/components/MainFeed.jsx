import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'
import PostComposer from './PostComposer';
import Post from './Post';

const MainFeed = () => {
  
  const { darkMode, activeTab, setActiveTab } = useTheme();
  const { followersPosts, user, formattedPosts } = useUser();
  
  const postsToDisplay = activeTab === "For you" ? formattedPosts : followersPosts;

  return (
    <div className={`flex-1 border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className={`top-0 backdrop-blur p-4 ${darkMode
        ? 'bg-black/80 border-gray-800'
        : 'bg-white/80 border-gray-200'
        }`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Home</h1>
      </div>
      {user && (
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
        </div>)}
      {user !== null && (
        <PostComposer/>
      )}
      {(
        postsToDisplay?.length > 0 && (
          <div>
            {postsToDisplay.map(post => (
              <Post
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MainFeed;