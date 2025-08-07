import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from "./ui/input";
import SignUpCard from "./Signup"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const RightSidebar = ({ className = "", registeredUser = true }) => { // Accept className and registeredUser props
  const { darkMode, setSearchActive, setIsRightSidebarOpen } = useTheme();
  const { setQuery } = useUser();
  const navigate = useNavigate();

  const trends = [
    { topic: 'Technology', tag: '#ReactJS', posts: '45.2K posts' },
    { topic: 'Programming', tag: '#JavaScript', posts: '32.1K posts' },
    { topic: 'Web Development', tag: '#NodeJS', posts: '28.7K posts' },
    { topic: 'Trending', tag: '#TheOdinProject', posts: '15.3K posts' }
  ];

  const suggestions = [
    { name: 'React', username: 'reactjs', avatar: '⚛️' },
    { name: 'Node.js', username: 'nodejs', avatar: '💚' },
    { name: 'MDN Web Docs', username: 'mozdevnet', avatar: '📚' }
  ];

  const inputRef = useRef(null);

  useEffect(() => {
    // Only auto-focus on desktop, not on mobile
    if (inputRef.current && window.innerWidth >= 768) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSearch = (value) => {
    if (value?.trim()) {
      setSearchActive(true);
      setIsRightSidebarOpen(false);
      navigate(`/`);
      setQuery(value);
    }
  };

  return (
    <div className={`${className || "w-80"} p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto`}>
      <SignUpCard />

      <div className="flex items-center p-1 md:p-2">
        <Search
          className="text-muted-foreground mr-2 mb-1 md:mb-2 cursor-pointer hover:text-foreground transition-colors flex-shrink-0"
          onClick={() => handleSearch(inputRef.current?.value)}
          size={18} // Smaller icon for mobile
        />
        <Input
          ref={inputRef}
          placeholder="Search..."
          className={`text-sm md:text-xl font-bold mb-1 md:mb-3 flex-1 ${darkMode ? 'text-white' : 'text-black'}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value);
            }
          }}
        />
      </div>

      {registeredUser && (
        <>
          <div className={`rounded-2xl p-2 md:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <h2 className={`text-base md:text-xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
              What's happening
            </h2>
            <div className="space-y-1 md:space-y-3">
              {trends.map((trend, index) => (
                <div 
                  key={index} 
                  className={`p-1.5 md:p-2 rounded cursor-pointer transition-colors ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs text-gray-500">{trend.topic}</div>
                  <div className={`font-bold text-xs md:text-base ${darkMode ? 'text-white' : 'text-black'}`}>
                    {trend.tag}
                  </div>
                  <div className="text-xs text-gray-500">{trend.posts}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-2 md:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <h2 className={`text-base md:text-xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
              Who to follow
            </h2>
            <div className="space-y-1.5 md:space-y-3">
              {suggestions.map((user, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="w-7 h-7 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-base">
                      {user.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold text-xs md:text-sm truncate ${darkMode ? 'text-white' : 'text-black'}`}>
                        {user.name}
                      </div>
                      <div className="text-gray-500 text-xs truncate">@{user.username}</div>
                    </div>
                  </div>
                  <button className={`px-2 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                    darkMode
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RightSidebar;