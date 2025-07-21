import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import PostDetailsMainFeed from './components/PostDetailsMainFeed';

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postDetails, setPostDetails] = useState(null)
  const [postUser, setPostUserDetails] = useState(null)
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0,
  });
  const { postId } = useParams();
  const { userId } = useParams();

  const token = localStorage.getItem("token");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchUserAndFollowers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsLoadingUser(true);
    try {
      const userRes = await fetch(`${HOST}/api/v1/me`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData.user);

      const followersRes = await fetch(`${HOST}/api/v1/followers/${userData.user.id}`);
      const followersData = await followersRes.json();
      setFollowers(followersData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserAndFollowers();
  }, []);

  useEffect(() => {
    console.log("followers state updated:", followers);
  }, [followers]);

  useEffect(() => {
    const fetchFormattedPosts = async () => {
      try {
        const res = await fetch(`${HOST}/api/v1/getPosts/`);
        const data = await res.json();
        setFormattedPosts(data.postFeed || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    };
    fetchFormattedPosts();
  }, []);

  // Fetch post details
  useEffect(() => {
    async function fetchPostDetails() {
      try {
        const post = await fetch(`${HOST}/api/v1/postDetails/${postId}`)
        const data = await post.json()
        setPostDetails(data.postFeed[0])
      } catch (err) {
        console.error("Error fetching post details", err)
      }
    } fetchPostDetails()
  }, [postId])

  // Fetch post user details
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const post = await fetch(`${HOST}/api/v1/userDetails/${userId}`)
        const data = await post.json()
        setPostUserDetails(data.user)
      } catch (err) {
        console.error("Error fetching post details", err)
      }
    } fetchUserDetails()
  }, [userId])

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
            postDetails && postUser && <PostDetailsMainFeed postUser={postUser} post={postDetails} isLoading={isLoading} HOST={HOST} user={user} darkMode={darkMode} formattedPosts={formattedPosts} followersData={followers} refetchFollowers={fetchUserAndFollowers} />}
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}