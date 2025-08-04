import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserContext } from '../contexts/UserContext';

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
  const [followersPosts, setFollowersPosts] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [postUserDetails, setPostUserDetails] = useState(null);
  const [postReplies, setPostReplies] = useState(null)
  const [followingUsers, setFollowingUsers] = useState(followers?.followingUsers || []);

  // Memoize TOKEN to prevent re-evaluation on every render
  const TOKEN = useMemo(() => localStorage.getItem("token"), []);
  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  // Fetch post details from postDetails API
  const fetchPostDetails = useCallback(async (newPostId) => {
    try {
      const response = await fetch(`${HOST}/api/v1/posts/${newPostId}/details`);
      const data = await response.json();
      setPostDetails(data.postFeed[0]);
    } catch (err) {
      console.error("Error fetching post details", err);
      setPostDetails(null);
    }
  }, [HOST]);

  // Get user details from posting user
  const fetchUserProfileDetails = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${HOST}/api/v1/users/${userId}`);
      const data = await response.json();
      setPostUserDetails(data.user);
    } catch (err) {
      console.error("Error fetching user details", err);
      setPostUserDetails(null);
    }
  }, [HOST]);

  // get last 20 posts, logged in user data and logged-in user follower data and last 20
  // posts from posters that the user follow.
  const fetchUserAndData = useCallback(async () => {
    try {
      // Always fetch posts regardless of authentication status
      const postsRes = await fetch(`${HOST}/api/v1/posts/`);
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
            console.log("specificUser", specificUser)

            // Fetch followers using userData
            const followersRes = await fetch(`${HOST}/api/v1/followers`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userData, specificUserData: specificUser }),
            });

            if (followersRes.ok) {
              const followersData = await followersRes.json();
              setFollowers(followersData);

              const followersPosts = await fetch(`${HOST}/api/v1/followingposts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followersData }),
              });
              if (followersPosts.ok) {
                const followersPostData = await followersPosts.json();
                setFollowersPosts(followersPostData.postFeed);
              }
            }
          } else {
            // Token might be invalid, clear it
            localStorage.removeItem("token");
            setUser(null);
            setFollowers({
              followingUsers: [],
              followerCount: 0,
              followingCount: 0,
            });
          }
        } catch (userErr) {
          console.error("Error fetching user data:", userErr);
          // Don't clear posts on user data error, just clear user state
          setUser(null);
          setFollowers({
            followingUsers: [],
            followerCount: 0,
            followingCount: 0,
          });
        }
      } else {
        // No token, ensure user state is cleared
        setUser(null);
        setFollowers({
          followingUsers: [],
          followerCount: 0,
          followingCount: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      // Even if posts fail, try to maintain user state if possible
    }
  }, [HOST, TOKEN, specificUser]);

  // Function to refetch followers when needed (e.g., after follow/unfollow)
  const fetchUserAndFollowers = useCallback(async () => {
    if (!user) return;
    try {
      const followersRes = await fetch(`${HOST}/api/v1/followers`, {
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
  }, [HOST, user, specificUser]);


  const updateFollowingStatus = useCallback(async (targetUserId, isFollowing) => {
    if (isFollowing) {
      setFollowingUsers(prev => [...prev, { followingId: targetUserId }]);
    } else {
      setFollowingUsers(prev =>
        prev.filter(follower =>
          follower.followingId !== targetUserId && follower.id !== targetUserId
        )
      );
    }
  }, []);

  const followUser = async (userId, targetUserId) => {
    try {
      const res = await fetch(`${HOST}/api/v1/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetUserId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update follow status:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Failed to update follow status");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to follow user", err);
      throw err;
    }
  };

  //ProfileDetails
  const fetchUserDetails = useCallback(async (handle) => {
    if (!handle) {
      return;
    }
    try {
      // Fetch authenticated logged-in user
      let userData;
      const currentToken = localStorage.getItem("token"); // Get fresh token
      if (currentToken) {
        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${currentToken}` },
        });
        userData = await userRes.json();
        if (!userRes.ok) throw new Error("Failed to fetch user");
      }
      // Fetch specific user by handle including postCount and replyCount
      const specificUserRes = await fetch(`${HOST}/api/v1/users/handle/${handle}`);
      const specificUserData = await specificUserRes.json();
      if (!specificUserRes.ok) throw new Error("Failed to fetch specific user");

      setUser(userData?.user || null);
      setSpecificUser(specificUserData.user);

      // Fetch followers only if user is logged in and specificUser is available
      const followersRes = await fetch(`${HOST}/api/v1/followers`, {
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
  }, [HOST]);


  // returns true or false if user is following poster
  const isFollowing = (targetUserId) => {
    return followingUsers?.some(follower =>
      follower.followingId === targetUserId
    );
  };

  const handleFollow = async (userId, targetUserId) => {
    const wasFollowing = isFollowing(targetUserId);
    updateFollowingStatus(targetUserId, !wasFollowing);

    try {
      await followUser(userId, targetUserId);
      await fetchUserAndFollowers();
    } catch (error) {
      updateFollowingStatus(targetUserId, wasFollowing);
      console.error("Failed to update follow status, reverting changes", error);
    }
  };

  // Fetch formatted posts for specific user to be used in ProfileDetails
  useEffect(() => {
    async function fetchFormattedPosts() {
      if (!specificUser?.id) return;
      try {
        const res = await fetch(`${HOST}/api/v1/users/${specificUser.id}/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");
        setFormattedProfilePosts(data.postFeed || []);
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      }
    }
    fetchFormattedPosts();
  }, [specificUser?.id, HOST]);


  const fetchFormattedPosts = useCallback(async (post) => {
    try {
      console.log("post.id", post.id)
      const res = await fetch(`${HOST}/api/v1/posts/${post.id}/replies`);
      const data = await res.json();
      setPostReplies(data.postFeed || []);
      return data;
    } catch (err) {
      console.error("Failed to fetch formatted posts:", err);
    }
  }, [HOST]);

  // Run fetchUserAndData once upon mount.
  useEffect(() => {
    fetchUserAndData();
  }, [fetchUserAndData]);

  // Sync followingUsers with followersData when it changes
  useEffect(() => {
    setFollowingUsers(followers?.followingUsers || []);
  }, [followers]);

  let date = specificUser?.createdAt && new Date(specificUser?.createdAt);
  date = date?.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  const isDisabled = user ? false : true

  return (
    <UserContext.Provider value={{ HOST, formattedPosts, formattedProfilePosts, user, followers, followersPosts, postUserDetails, postDetails, specificUser, followingUsers, postReplies, date, isDisabled, fetchUserAndData, fetchPostDetails, fetchUserAndFollowers, fetchUserDetails, fetchUserProfileDetails, updateFollowingStatus, followUser, handleFollow, isFollowing, fetchFormattedPosts }}>
      {children}
    </UserContext.Provider>
  );
};