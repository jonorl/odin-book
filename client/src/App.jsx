import { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0,
  });
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [followersPosts, setFollowersPosts] = useState([])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchUserAndData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Always fetch posts regardless of authentication status
      const postsRes = await fetch(`${HOST}/api/v1/getPosts/`);
      const postsData = await postsRes.json();
      setFormattedPosts(postsData.postFeed || []);

      // Only fetch user-specific data if token exists
      if (token) {
        try {
          // Fetch user data and followers
          const userRes = await fetch(`${HOST}/api/v1/me`, {
            headers: { authorization: `Bearer ${token}` },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.user);

            // Fetch followers using userData
            const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userData }),
            });

            if (followersRes.ok) {
              const followersData = await followersRes.json();
              setFollowers(followersData);

              const followersPosts = await fetch(`${HOST}/api/v1/followingposts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followersData }),
              })
              if (followersPosts.ok) {
                const followersPostData = await followersPosts.json();
                setFollowersPosts(followersPostData.postFeed)
              }
            }
          } else {
            // Token might be invalid, clear it
            localStorage.removeItem("token");
            setUser(null);
            setFollowers([]);
          }
        } catch (userErr) {
          console.error("Error fetching user data:", userErr);
          // Don't clear posts on user data error, just clear user state
          setUser(null);
          setFollowers([]);
        }
      } else {
        // No token, ensure user state is cleared
        setUser(null);
        setFollowers([]);
      }

    } catch (err) {
      console.error("Error fetching posts:", err);
      // Even if posts fail, try to maintain user state if possible
    }
  };

  useEffect(() => { fetchUserAndData() }, [])

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed
            HOST={HOST}
            user={user}
            darkMode={darkMode}
            formattedPosts={formattedPosts}
            followersData={followers}
            followersPosts={followersPosts}
            refetchFollowers={fetchUserAndData} // Pass refetch function
          />
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}