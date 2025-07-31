import { useMemo, useState } from 'react'
import { PostsContext } from '../contexts/PostsContext';

export const PostsProvider = ({ children }) => {

  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  const postLike = async (post, user) => {
    const id = post.id;
    try {
      const res = await fetch(`${HOST}/api/v1/newLike/`, {
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

  const handleConfirmPostDelete = async (postId, returnToHomepage, navigate) => {
    try {
      console.log("postId", postId)
      const res = await fetch(`${HOST}/api/v1/deletepost/${postId}`, {
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
      const res = await fetch(`${HOST}/api/v1/deleteuser/${userId}`, {
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

  return (
    <PostsContext.Provider value={{ postLike, setLiked, liked, isModalOpen, setIsModalOpen, handleConfirmPostDelete, handleConfirmUserDelete }}>
      {children}
    </PostsContext.Provider>
  );
};