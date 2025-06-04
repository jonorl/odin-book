import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Search, Home, Bell, Mail, Bookmark, User, Settings, Moon, Sun } from 'lucide-react';

// Mock data
const mockPosts = [
  {
    id: 1,
    user: { name: 'John Doe', username: 'johndoe', avatar: '👨‍💻' },
    content: 'Just finished building my first React component! The feeling when everything clicks is amazing. #coding #react',
    timestamp: '2h',
    likes: 12,
    retweets: 3,
    replies: 5,
    liked: false,
    retweeted: false
  },
  {
    id: 2,
    user: { name: 'Jane Smith', username: 'janesmith', avatar: '👩‍🎨' },
    content: 'Beautiful sunset today! Sometimes you need to step away from the code and appreciate the world around you. 🌅',
    timestamp: '4h',
    likes: 28,
    retweets: 7,
    replies: 12,
    liked: true,
    retweeted: false
  },
  {
    id: 3,
    user: { name: 'Dev Community', username: 'devcommunity', avatar: '💻' },
    content: 'Pro tip: Always write tests for your code. Your future self will thank you! What\'s your favorite testing framework?',
    timestamp: '6h',
    likes: 45,
    retweets: 15,
    replies: 23,
    liked: false,
    retweeted: true
  }
];

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Explore' },
    { icon: Bell, label: 'Notifications' },
    { icon: Mail, label: 'Messages' },
    { icon: Bookmark, label: 'Bookmarks' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className={`w-64 h-screen border-r p-4 fixed left-0 top-0 ${
      darkMode 
        ? 'bg-black border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-500'}`}>OdinBook</h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'hover:bg-gray-800 text-white' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`flex items-center space-x-3 w-full p-3 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-white' 
                  : 'hover:bg-gray-100 text-black'
              } ${item.active ? 'font-bold' : ''}`}
            >
              <Icon size={24} />
              <span className="text-xl">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <button className="w-full bg-blue-500 text-white py-3 rounded-full font-bold mt-8 hover:bg-blue-600 transition-colors">
        Post
      </button>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`flex items-center space-x-3 p-3 rounded-full cursor-pointer transition-colors ${
          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            👤
          </div>
          <div className="flex-1">
            <div className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Your Name</div>
            <div className="text-gray-500 text-sm">@yourhandle</div>
          </div>
          <MoreHorizontal size={20} className={darkMode ? 'text-white' : 'text-black'} />
        </div>
      </div>
    </div>
  );
};

const PostComposer = ({ darkMode }) => {
  const [postText, setPostText] = useState('');

  return (
    <div className={`border-b p-4 ${
      darkMode 
        ? 'border-gray-800 bg-black' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          👤
        </div>
        <div className="flex-1">
          <textarea
            className={`w-full text-xl resize-none focus:outline-none border-none ${
              darkMode 
                ? 'bg-black text-white placeholder-gray-500' 
                : 'bg-white text-black placeholder-gray-500'
            }`}
            placeholder="What's happening?"
            rows={3}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-4 text-blue-500">
              <button className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
              }`}>📷</button>
            </div>
            <button
              className={`px-6 py-2 rounded-full font-bold ${
                postText.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
              disabled={!postText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = ({ post, darkMode }) => {
  const [liked, setLiked] = useState(post.liked);
  const [retweeted, setRetweeted] = useState(post.retweeted);
  const [likes, setLikes] = useState(post.likes);
  const [retweets, setRetweets] = useState(post.retweets);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(retweeted ? retweets - 1 : retweets + 1);
  };

  return (
    <div className={`border-b p-4 cursor-pointer transition-colors ${
      darkMode 
        ? 'border-gray-800 hover:bg-gray-950' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
          {post.user.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{post.user.name}</span>
            <span className="text-gray-500">@{post.user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{post.timestamp}</span>
            <div className="ml-auto">
              <button className={`p-1 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}>
                <MoreHorizontal size={16} className={darkMode ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>
          
          <div className="mb-3">
            <p className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{post.content}</p>
          </div>
          
          <div className="flex justify-between max-w-md">
            <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' 
                : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
            }`}>
              <MessageCircle size={18} />
              <span className="text-sm">{post.replies}</span>
            </button>
            
            <button
              onClick={handleRetweet}
              className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
                retweeted 
                  ? (darkMode ? 'text-green-400' : 'text-green-500')
                  : (darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/20' : 'text-gray-500 hover:text-green-500 hover:bg-green-50')
              }`}
            >
              <Repeat2 size={18} />
              <span className="text-sm">{retweets}</span>
            </button>
            
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
                liked 
                  ? (darkMode ? 'text-red-400' : 'text-red-500')
                  : (darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-500 hover:text-red-500 hover:bg-red-50')
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{likes}</span>
            </button>
            
            <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' 
                : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
            }`}>
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightSidebar = ({ darkMode }) => {
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

  return (
    <div className="w-80 p-4 space-y-4">
      <div className={`rounded-2xl p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>What's happening</h2>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className={`p-2 rounded cursor-pointer transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <div className="text-sm text-gray-500">{trend.topic}</div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{trend.tag}</div>
              <div className="text-sm text-gray-500">{trend.posts}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
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
              <button className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
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
    </div>
  );
};

const MainFeed = ({ darkMode }) => {
  return (
    <div className={`flex-1 border-r ${
      darkMode ? 'border-gray-800' : 'border-gray-200'
    }`}>
      <div className={`sticky top-0 backdrop-blur border-b p-4 ${
        darkMode 
          ? 'bg-black/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Home</h1>
      </div>
      
      <PostComposer darkMode={darkMode} />
      
      <div>
        {mockPosts.map(post => (
          <Post key={post.id} post={post} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mx-auto">
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="ml-64 flex-1 flex">
          <MainFeed darkMode={darkMode} />
          <RightSidebar darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}