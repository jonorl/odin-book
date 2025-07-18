import { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0
  })
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token)
    async function fetchUserAndFollowers() {
      if (!token) return;
      setIsLoadingUser(true);
      try {
        // Fetch user first
        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        console.log("userData", userData.user.id)
        setUser(userData.user);

        // Then fetch followers
        const followersRes = await fetch(`${HOST}/api/v1/followers/${userData.user.id}`);
        const followersData = await followersRes.json();
        console.log("followersData", followersData);
        setFollowers(followersData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUserAndFollowers();
  }, []);

  useEffect(() => {
    console.log("followers state updated:", followers);
  }, [followers]);

  // Create new mapped object fusing posts and users
  useEffect(() => {
    const fetchFormattedPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/getPosts/`, {
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
      <div className="flex max-w-7xl mr-auto ml-auto">{console.log(followers && "averga", followers)}
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed isLoading={isLoading} HOST={HOST} user={user} darkMode={darkMode} formattedPosts={formattedPosts} followersData={followers} />
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}