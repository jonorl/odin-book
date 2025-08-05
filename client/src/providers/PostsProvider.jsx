import { useMemo, useState, useEffect } from 'react'
import { PostsContext } from '../contexts/PostsContext';

export const PostsProvider = ({ children }) => {

  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)

  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  const postLike = async (post, user) => {
    const id = post.id;
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
    }
  };

  const postRetweet = async (post, user) => {
    const id = post.id;
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
      throw err; // Re-throw to handle in component
    }
  };

  const handleConfirmPostDelete = async (postId, returnToHomepage, navigate) => {
    try {
      console.log("postId", postId)
      const res = await fetch(`${HOST}/api/v1/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      returnToHomepage ? (navigate(`/`), window.location.reload()) :
        window.location.reload()
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    }
    setIsModalOpen(false);
  };

  const handleConfirmUserDelete = async (userId) => {
    try {
      const res = await fetch(`${HOST}/api/v1/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      localStorage.removeItem("token");
      window.location.href = `${import.meta.env.VITE_THISHOST}`
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    }
    setIsModalOpen(false);
  };

    const postChangePage = async (page) => {
      console.log(page, page)
    try {
      const res = await fetch(`${HOST}/api/v1/posts?page=${page}`, {
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to change page", err);
    }
  };

  useEffect(() => { console.log(currentPage), [currentPage] })

  return (
    <PostsContext.Provider value={{ postLike, setLiked, liked, isModalOpen, currentPage, setCurrentPage, setIsModalOpen, handleConfirmPostDelete, handleConfirmUserDelete, postRetweet, postChangePage }}>
      {children}
    </PostsContext.Provider>
  );
};