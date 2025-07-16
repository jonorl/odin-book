import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import SettingsMain from './components/SettingsMain';

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      setIsLoadingUser(true);
      try {
        const res = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUser();
  }, [token]);

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
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          {isLoading ? <div className='spinner spinner-container'></div> :
          <SettingsMain HOST={HOST} user={user} darkMode={darkMode} />}
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
          </div>
      </div>
    </div>
  );
}