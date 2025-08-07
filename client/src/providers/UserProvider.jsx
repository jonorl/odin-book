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
  const [postReplies, setPostReplies] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(followers?.followingUsers || []);
  const [currentPage, setCurrentPage] = useState(parseInt(1));
  const [query, setQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfilePosts, setIsLoadingProfilePosts] = useState(false);
  const [originalPost, setOriginalPost] = useState(null)
  const [prevReplyToId, setPrevReplyToId] = useState(null);

  const TOKEN = useMemo(() => localStorage.getItem("token"), []);
  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  const fetchPostDetails = useCallback(async (newPostId, isOriginalPost = false) => {
    if (newPostId === null) { return }
    setIsLoading(true);
    try {
      const response = await fetch(`${HOST}/api/v1/posts/${newPostId}/details`);
      const data = await response.json();
      isOriginalPost ? setOriginalPost(data.postFeed[0]) : setPostDetails(data.postFeed[0]);
      fetchFormattedPosts(data.postFeed[0])
    } catch (err) {
      console.error("Error fetching post details", err);
      setPostDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  const fetchUserProfileDetails = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${HOST}/api/v1/users/${userId}`);
      const data = await response.json();
      setPostUserDetails(data.user);
    } catch (err) {
      console.error("Error fetching user details", err);
      setPostUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  const fetchUserAndData = useCallback(async (pageNum, keyword) => {
    const page = parseInt(pageNum) || 1;
    const searchTerm = keyword;

    setIsLoading(true);
    try {
      const postsRes = await fetch(`${HOST}/api/v1/posts?page=${page}&query=${searchTerm}`);
      const postsData = await postsRes.json();
      setFormattedPosts(postsData.postFeed || []);

      if (TOKEN) {
        try {
          const userRes = await fetch(`${HOST}/api/v1/me`, {
            headers: { authorization: `Bearer ${TOKEN}` },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.user);

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
          setUser(null);
          setFollowers({
            followingUsers: [],
            followerCount: 0,
            followingCount: 0,
          });
        }
      } else {
        setUser(null);
        setFollowers({
          followingUsers: [],
          followerCount: 0,
          followingCount: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [HOST, TOKEN, specificUser]);

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

  const fetchUserDetails = useCallback(async (handle) => {
    if (!handle) return;

    setIsLoading(true);
    try {
      let userData;
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        const userRes = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${currentToken}` },
        });
        userData = await userRes.json();
        if (!userRes.ok) throw new Error("Failed to fetch user");
      }

      const specificUserRes = await fetch(`${HOST}/api/v1/users/handle/${handle}`);
      const specificUserData = await specificUserRes.json();
      if (!specificUserRes.ok) throw new Error("Failed to fetch specific user");

      setUser(userData?.user || null);
      setSpecificUser(specificUserData.user);

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
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  const isFollowing = (targetUserId) => {
    return followingUsers?.some(follower =>
      follower.followingId === targetUserId
    );
  };

  const handleFollow = async (userId, targetUserId) => {
    const wasFollowing = isFollowing(targetUserId);
    updateFollowingStatus(targetUserId, !wasFollowing);
    triggerRefetchOnFollowersUpdate()

    try {
      await followUser(userId, targetUserId);
      await fetchUserAndFollowers();
    } catch (error) {
      updateFollowingStatus(targetUserId, wasFollowing);
      console.error("Failed to update follow status, reverting changes", error);
    }
  };

  useEffect(() => {
    async function fetchFormattedPosts() {
      if (!specificUser?.id) return;

      setIsLoadingProfilePosts(true);
      try {
        const res = await fetch(`${HOST}/api/v1/users/${specificUser?.id}/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");
        setFormattedProfilePosts(data.postFeed || []);
      } catch (err) {
        console.error("Failed to fetch formatted posts:", err);
      } finally {
        setIsLoadingProfilePosts(false);
      }
    }
    fetchFormattedPosts();
  }, [specificUser?.id, HOST]);

  const fetchFormattedPosts = useCallback(async (post) => {
    console.log("attempt")
    if (!post?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/posts/${post?.id}/replies`);
      const data = await res.json();
      setPostReplies(data.postFeed || []);
      return data;
    } catch (err) {
      console.error("Failed to fetch formatted posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  const postChangePage = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/posts?page=${page}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to change page", err);
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  const postQuery = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/posts?page=1?query=${query}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to change page", err);
    } finally {
      setIsLoading(false);
    }
  }, [HOST]);

  // useEffect(() => {
  //   if (query) { fetchUserAndData(1, query) }
  //   else { fetchUserAndData(currentPage) }
  // }, [fetchUserAndData, currentPage, query]);

  // useEffect(() => {
  //   setFollowingUsers(followers?.followingUsers || []);

  // }, [followers]);

  const [followersTrigger, setFollowersTrigger] = useState(0);

  // Expose a function to manually trigger refetch when followers change externally
  const triggerRefetchOnFollowersUpdate = useCallback(() => {
    setFollowersTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (postDetails?.replyToId && postDetails.replyToId !== prevReplyToId) {
      fetchPostDetails(postDetails.replyToId, true);
      setPrevReplyToId(postDetails.replyToId);
    }
  }, [postDetails]); // Simplified dependency

  useEffect(() => {
    if (query) {
      fetchUserAndData(1, query)
    } else {
      fetchUserAndData(currentPage)
    }
  }, [fetchUserAndData, currentPage, query, followersTrigger]);

  useEffect(() => {
    setFollowingUsers(followers?.followingUsers || []);
  }, [followers]);

  let date = specificUser?.createdAt && new Date(specificUser?.createdAt);
  date = date?.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  const isDisabled = user ? false : true;

  return (
    <UserContext.Provider value={{
      HOST,
      formattedPosts,
      formattedProfilePosts,
      user,
      followers,
      followersPosts,
      postUserDetails,
      postDetails,
      specificUser,
      followingUsers,
      postReplies,
      date,
      isDisabled,
      currentPage,
      query,
      isLoading,
      originalPost,
      isLoadingProfilePosts,
      // Functions
      setQuery,
      setCurrentPage,
      fetchUserAndData,
      fetchPostDetails,
      fetchUserAndFollowers,
      fetchUserDetails,
      fetchUserProfileDetails,
      updateFollowingStatus,
      followUser,
      handleFollow,
      isFollowing,
      fetchFormattedPosts,
      postChangePage,
      postQuery,
      triggerRefetchOnFollowersUpdate,
    }}>
      {children}
    </UserContext.Provider>
  );
};