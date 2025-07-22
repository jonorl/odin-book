import { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0,
  });
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchUserAndData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setIsLoadingUser(true);
    setIsLoading(true);
    
    try {
      // First, fetch the current user and posts
      const [userRes, postsRes] = await Promise.all([
        fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        }),
        fetch(`${HOST}/api/v1/getPosts/`)
      ]);

      const [userData, postsData] = await Promise.all([
        userRes.json(),
        postsRes.json()
      ]);

      setUser(userData.user);
      setFormattedPosts(postsData.postFeed || []);
      console.log("postsData", postsData.postFeed)

      // Now fetch followers using both userData and the user from posts
      const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });

      const followersData = await followersRes.json();
      setFollowers(followersData);
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoadingUser(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndData();
  }, []);

  useEffect(() => {
    console.log("followers state updated:", followers);
  }, [followers]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed
            isLoading={isLoading}
            HOST={HOST}
            user={user}
            darkMode={darkMode}
            formattedPosts={formattedPosts}
            followersData={followers}
            refetchFollowers={fetchUserAndData} // Pass refetch function
          />
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}