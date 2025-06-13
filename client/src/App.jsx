import { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  // const [posts, setPosts] = useState([])
  // const [users, setUsers] = useState([])
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch posts
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await fetch(`${HOST}/api/v1/test2`, {
  //         // headers: { authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       setPosts(data || []);
  //       return data
  //     } catch (err) {
  //       console.error("Failed to fetch posts:", err);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  // Fetch  users
 /*  useEffect(() => {
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
  }, []); */

  // Create new mapped object fusing posts and users
  useEffect(() => {
    const fetchFormattedPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/getPosts/`, {
          // headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFormattedPosts(data.postFeed || []);
        setIsLoading(false)
        return data
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    };
    fetchFormattedPosts();
  }, [])

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed isLoading={isLoading} HOST={HOST} darkMode={darkMode} formattedPosts={formattedPosts} />
          <RightSidebar darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}