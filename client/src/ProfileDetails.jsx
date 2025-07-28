import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from './DataContext';

import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Profile from "./components/Profile";

const HOST = import.meta.env.VITE_LOCALHOST;

export default function OdinBook() {
  const { darkMode, toggleDarkMode } = useData();
  // const [darkMode, setDarkMode] = useState(true);
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

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };

  // Fetch user and specific user details
  useEffect(() => {
    async function fetchUserDetails() {
      if (/* !token ||  */!handle) {
        setIsLoadingUser(false);
        return;
      }
      setIsLoadingUser(true);
      try {
        // Fetch authenticated user
        let userData
        if (user) {
        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        });
        userData = await userRes.json();
        if (!userRes.ok) throw new Error("Failed to fetch user");
        }
        // Fetch specific user by handle
        const specificUserRes = await fetch(`${HOST}/api/v1/userHandle/${handle}`);
        const specificUserData = await specificUserRes.json();
        if (!specificUserRes.ok) throw new Error("Failed to fetch specific user");

        setUser(userData?.user || null);
        setSpecificUser(specificUserData.user);

        // Fetch followers only if both user and specificUser are available
        const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userData: userData, specificUserData: specificUserData}),
        });
        const followersData = await followersRes.json();
        console.log("followersData", followersData)
        if (!followersRes.ok) throw new Error("Failed to fetch followers");
        setFollowers(followersData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUserDetails();
  }, [user, handle, token]); // Only depend on handle and token

  // Fetch formatted posts for specific user
  useEffect(() => {
    async function fetchFormattedPosts() {
      if (!specificUser?.id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${HOST}/api/v1/getPostsFromSpecificUser/${specificUser.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");
        setFormattedPosts(data.postFeed || []);
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFormattedPosts();
  }, [specificUser]);

  // Function to refetch followers when needed (e.g., after follow/unfollow)
  const fetchUserAndFollowers = async () => {
    if (!user) return;
    try {
      const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: user, specificUserData: specificUser }),
      });
      const followersData = await followersRes.json();
      if (!followersRes.ok) throw new Error("Failed to refetch followers");
      setFollowers(followersData);
    } catch (err) {
      console.error("Error refetching followers:", err);
    }
  };

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
          <Sidebar
            className="flex ml-64"
            darkMode={darkMode}
            user={user}
            toggleDarkMode={toggleDarkMode}
          />
        <div className="flex-1 flex mr-auto ml-auto">
          {/* {isLoading || isLoadingUser ? (
            <div className="spinner spinner-container"></div>
          ) : ( */}
            <Profile
              isLoading={isLoading}
              HOST={HOST}
              user={user}
              specificUser={specificUser}
              darkMode={darkMode}
              formattedPosts={formattedPosts}
              followersData={followers}
              refetchFollowers={fetchUserAndFollowers}
            />
          {/* )} */}
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}