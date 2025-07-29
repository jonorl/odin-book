import { useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

const HOST = import.meta.env.VITE_LOCALHOST
const TOKEN = localStorage.getItem("token");

export const UserProvider = ({ children }) => {
  const [formattedPosts, setFormattedPosts] = useState([]);
  const [formattedProfilePosts, setFormattedProfilePosts] = useState([]);
  const [user, setUser] = useState(null);
  const [specificUser, setSpecificUser] = useState(null);
  const [followers, setFollowers] = useState({
    followingUsers: [],
    followerCount: 0,
    followingCount: 0,
  });
  const [followersPosts, setFollowersPosts] = useState([])
  const [postDetails, setPostDetails] = useState(null);
  const [postUserDetails, setPostUserDetails] = useState(null);

  // Fetch post details from postDetails API

  async function fetchPostDetails(newPostId) {
    try {
      const response = await fetch(`${HOST}/api/v1/postDetails/${newPostId}`);
      const data = await response.json();
      setPostDetails(data.postFeed[0]);
    } catch (err) {
      console.error("Error fetching post details", err);
      setPostDetails(null);
    }
  }

  // Get user details from posting user
    async function fetchUserProfileDetails(userId) {
      if (!userId) return;
      try {
        const response = await fetch(`${HOST}/api/v1/userDetails/${userId}`);
        const data = await response.json();
        setPostUserDetails(data.user);
      } catch (err) {
        console.error("Error fetching user details", err);
        setPostUserDetails(null);
      }
    }

  // get last 20 posts, logged in user data and logged-in user follower data and last 20
  // posts from posters that the user follow.
  const fetchUserAndData = async () => {
    try {


      // Always fetch posts regardless of authentication status
      const postsRes = await fetch(`${HOST}/api/v1/getPosts/`);
      const postsData = await postsRes.json();
      setFormattedPosts(postsData.postFeed || []);

      // Only fetch user-specific data if token exists
      if (TOKEN) {
        try {
          // Fetch user data and followers
          const userRes = await fetch(`${HOST}/api/v1/me`, {
            headers: { authorization: `Bearer ${TOKEN}` },
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

  // Function to refetch followers when needed (e.g., after follow/unfollow)
  const fetchUserAndFollowers = async () => {
    if (!user) return;
    try {
      const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: user, specificUserData: postUserDetails }),
      });
      const followersData = await followersRes.json();
      if (!followersRes.ok) throw new Error("Failed to refetch followers");
      setFollowers(followersData);
    } catch (err) {
      console.error("Error refetching followers:", err);
    }
  };

  //ProfileDetails
  async function fetchUserDetails(handle) {
    if (!handle) {
      return;
    }
    try {
      // Fetch authenticated logged-in user
      let userData
      if (user) {
        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${TOKEN}` },
        });
        userData = await userRes.json();
        if (!userRes.ok) throw new Error("Failed to fetch user");
      }
      // Fetch specific user by handle including postCount and replyCount
      const specificUserRes = await fetch(`${HOST}/api/v1/userHandle/${handle}`);
      const specificUserData = await specificUserRes.json();
      if (!specificUserRes.ok) throw new Error("Failed to fetch specific user");

      setUser(userData?.user || null);
      setSpecificUser(specificUserData.user);

      // Fetch followers only if user is logged in and specificUser is available
      const followersRes = await fetch(`${HOST}/api/v1/followers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: userData, specificUserData: specificUserData }),
      });
      const followersData = await followersRes.json();
      if (!followersRes.ok) throw new Error("Failed to fetch followers");
      setFollowers(followersData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  // Fetch formatted posts for specific user to be used in ProfileDetails
  useEffect(() => {
    async function fetchFormattedPosts() {
      if (!specificUser?.id) return;
      try {
        const res = await fetch(`${HOST}/api/v1/getPostsFromSpecificUser/${specificUser.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");
        setFormattedProfilePosts(data.postFeed || []);
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    }
    fetchFormattedPosts();
  }, [specificUser]);

  // Run fetchUserAndData once upon mount.
  useEffect(() => { fetchUserAndData() }, [])

  return (
    <UserContext.Provider value={{ HOST, formattedPosts, formattedProfilePosts, user, followers, followersPosts, postUserDetails, postDetails, specificUser, fetchUserAndData, fetchPostDetails, fetchUserAndFollowers, fetchUserDetails, fetchUserProfileDetails}}>
      {children}
    </UserContext.Provider>
  );
};