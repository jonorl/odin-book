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
      console.log("re-render")
      fetchPostDetails(postId);
      fetchUserProfileDetails(userId)
    }
  }, [postId, userId, fetchPostDetails, fetchUserProfileDetails]);

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
      {/* Mobile: Full-width content only */}
      <div className="md:hidden">
        <PostDetailsMainFeed />
      </div>

      {/* Desktop: Traditional layout */}
      <div className="hidden md:flex max-w-7xl mx-auto">
        <Sidebar className="w-64 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <PostDetailsMainFeed />
        </div>
        <RightSidebar className="w-80 flex-shrink-0 hidden lg:block" />
      </div>
    </div>
  );
}