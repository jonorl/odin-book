import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Profile from "./components/Profile";

const HOST = import.meta.env.VITE_LOCALHOST;

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specificUser, setSpecificUser] = useState(null);
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0,
  });
  const { handle } = useParams();

  const token = localStorage.getItem("token");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchUserAndFollowers = async () => {
    try {
        const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, specificUser }),
        });
      const followersData = await followersRes.json();
      setFollowers(followersData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // useEffect(() => {
  //   fetchUserAndFollowers();
  // }, [followers]);

  // Fetch post user details
  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      setIsLoadingUser(true);
      try {

        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData.user);

        const specificUser = await fetch(`${HOST}/api/v1/userHandle/${handle}`);
        const specificUserData = await specificUser.json();
        setSpecificUser(specificUserData.user);
        // const followersRes = await fetch(`${HOST}/api/v1/followers/${data.user.id}`);

        // REPLICATE THIS IN OTHER ROUTES!
        const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userData, specificUserData }),
        });

        const followersData = await followersRes.json();
        setFollowers(followersData);
      } catch (err) {
        console.error("Error fetching post details", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUserDetails();
  }, [handle, user]);

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
      const userId = specificUser && specificUser.id
      try {
        const res = await fetch(`${HOST}/api/v1/getPostsFromSpecificUser/${userId}`, {
        });
        const data = await res.json();
        setFormattedPosts(data.postFeed || []);
        setIsLoading(false);
        return data;
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    };
    fetchFormattedPosts();
  }, [specificUser]);

  return (
    <div
      className={`min-h-screen mx-auto ${darkMode ? "bg-black" : "bg-white"}`}
    >
      <div className="flex max-w-7xl mr-auto ml-auto">
        {user && (
          <Sidebar
            className="flex ml-64"
            darkMode={darkMode}
            user={user}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        <div className="flex-1 flex mr-auto ml-auto">
          {isLoading ? (
            <div className="spinner spinner-container"></div>
          ) : (
            <Profile
              isLoading={isLoading}
              HOST={HOST}
              user={user}
              specificUser={specificUser}
              darkMode={darkMode}
              formattedPosts={formattedPosts}
              followersData={followers}
              refetchFollowers={fetchUserAndFollowers} // Pass refetch function

            />
          )}
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}
