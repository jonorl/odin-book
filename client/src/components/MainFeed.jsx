// import { mockPosts } from "../utils/utils"
import PostComposer from './PostComposer';
import Post from './Post';

const MainFeed = ({ darkMode, formattedPosts, isLoading, HOST }) => {

  // console.log("posts", posts)
  // console.log("users", users)
  // console.log("formattedPosts", formattedPosts)

  return (
    <div className={`flex-1 border-r  ${darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
      <div className={` sticky top-0 backdrop-blur border-b p-4 ${darkMode
        ? 'bg-black/80 border-gray-800'
        : 'bg-white/80 border-gray-200'
        }`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Home</h1>
      </div>

      <PostComposer darkMode={darkMode} HOST={HOST} />

      {isLoading ? <div className='spinner spinner-container'></div> : (formattedPosts.length > 0 &&
        <div>
          {formattedPosts.map(post => (
            <Post key={post.id} post={post} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainFeed;