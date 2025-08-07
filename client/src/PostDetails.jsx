import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useTheme } from './hooks/useTheme';
import { useUser } from './hooks/UseUser'

import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import PostDetailsMainFeed from './components/PostDetailsMainFeed';
import LoadingSpinner from './components/ui/LoadingSpinner';

export default function OdinBook() {

  const { darkMode } = useTheme();
  const { fetchPostDetails, fetchUserProfileDetails, isLoading } = useUser();
  const { postId, userId } = useParams();

  // Fetch details of specific post clicked on
useEffect(() => {
  if (postId && userId) {
    const fetchData = async () => {
      await fetchPostDetails(postId);
      await fetchUserProfileDetails(userId);
    };
    fetchData();
  }
}, [postId, userId]); // Remove fetch functions from dependencies

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <LoadingSpinner
          size="large"
          text="Loading posts..."
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Single instance that adapts to screen size */}
      <div className="md:flex max-w-7xl mx-auto">
        <Sidebar className="hidden md:block w-64 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <PostDetailsMainFeed />
        </div>
        <RightSidebar className="hidden lg:block w-80 flex-shrink-0" />
      </div>
    </div>
  );
}