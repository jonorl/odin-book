import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from "./ui/input";
import SignUpCard from "./Signup"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const RightSidebar = () => {
  const { darkMode, setSearchActive } = useTheme();
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSearch = (value) => {
    if (value?.trim()) {
      setSearchActive(true);
      navigate(`/`);
      setQuery(value);
      console.log("Searching for:", value);
    }
  };

  return (
    <>
      <div className="w-80 p-4 space-y-4">
        <SignUpCard />

        <div className="flex items-center p-2">
          <Search
            className="text-muted-foreground mr-2 mb-2 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSearch(inputRef.current?.value)}
          />
          <Input
            ref={inputRef}
            placeholder="Search..."
            className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.currentTarget.value);
              }
            }}
          />
        </div>

        <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
          <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>What's happening</h2>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index} className={`p-2 rounded cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                <div className="text-sm text-gray-500">{trend.topic}</div>
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{trend.tag}</div>
                <div className="text-sm text-gray-500">{trend.posts}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
          <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Who to follow</h2>
          <div className="space-y-3">
            {suggestions.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.avatar}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-black'}`}>{user.name}</div>
                    <div className="text-gray-500 text-sm">@{user.username}</div>
                  </div>
                </div>
                <button className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${darkMode
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar