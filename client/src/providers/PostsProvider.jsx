import { useMemo, useState } from 'react'
import { useUser } from '../hooks/UseUser'
import { PostsContext } from '../contexts/PostsContext';

export const PostsProvider = ({ children }) => {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const HOST = useMemo(() => import.meta.env.VITE_LOCALHOST, []);

  const { user } = useUser();

  const postLike = async (post) => {
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

  const handleConfirmDelete = async (postId) => {
    try {
      const res = await fetch(`${HOST}/api/v1/deletepost/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      window.location.reload()
      return data;
    } catch (err) {
      console.error("Failed to post new message:", err);
    }
    setIsModalOpen(false);
  };

  return (
    <PostsContext.Provider value={{ postLike, setLiked, liked, isModalOpen, setIsModalOpen, handleConfirmDelete }}>
      {children}
    </PostsContext.Provider>
  );
};