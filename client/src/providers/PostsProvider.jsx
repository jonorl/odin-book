import { useMemo, useState } from 'react'
import { PostsContext } from '../contexts/PostsContext';

export const PostsProvider = ({ children }) => {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  const postLike = async (post, user) => {
    const id = post.id;
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/likes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const postRetweet = async (post, user) => {
    const id = post.id;
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/retweets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to post retweet:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPostDelete = async (postId, returnToHomepage, navigate) => {
    setIsLoading(true);
    try {
      console.log("postId", postId);
      const res = await fetch(`${HOST}/api/v1/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      returnToHomepage ? (navigate(`/`), window.location.reload()) :
        window.location.reload();
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleConfirmUserDelete = async (userId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/api/v1/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      localStorage.removeItem("token");
      window.location.href = `${import.meta.env.VITE_THISHOST}`;
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <PostsContext.Provider value={{ 
      liked, 
      isModalOpen, 
      isLoading,
      postLike, 
      setLiked, 
      setIsModalOpen, 
      handleConfirmPostDelete, 
      handleConfirmUserDelete, 
      postRetweet,
    }}>
      {children}
    </PostsContext.Provider>
  );
};