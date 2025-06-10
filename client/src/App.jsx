import { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"
import { formatPostsForFeed } from "./utils/utils.js"

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [formattedPosts, setFormattedPosts] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/test2`, {
          // headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPosts(data || []);
        return data
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  // Fetch  users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/test`, {
          // headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data || []);
        return data
      } catch (err) {
        console.error("Failed to fetch online users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Create new mapped object fusing posts and users
  useEffect(() => {
    if (posts.posts && posts.posts.length > 0 && users.users && users.users.length > 0) {
      const formatted = formatPostsForFeed(posts.posts, users.users);
      console.log(formatted)
      setFormattedPosts(formatted);
    }
  }, [posts, users]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          {formattedPosts.length > 0 && <MainFeed darkMode={darkMode} formattedPosts={formattedPosts} />}
          <RightSidebar darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}