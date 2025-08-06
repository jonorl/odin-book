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
  const { postDetails, postUserDetails, fetchPostDetails, fetchUserProfileDetails, isLoading } = useUser();
  const { postId, userId } = useParams();

  // Fetch details of specific post clicked on
  useEffect(() => {
    fetchPostDetails(postId);
    fetchUserProfileDetails(userId)
  }, [postId, userId, fetchPostDetails, fetchUserProfileDetails]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        <Sidebar className="hidden md:flex md:ml-64 w-full md:w-64 fixed md:sticky top-0 z-10"/>
        <div className="flex-1 flex flex-col md:flex-row mx-auto w-full">
          {isLoading ? (
            <div className="mx-auto pt-38">
              <LoadingSpinner
                size="large"
                text="Loading posts..."
                className="flex text-center"
              />
            </div>
          ) : (
            postDetails && postUserDetails && <PostDetailsMainFeed />)}
          <RightSidebar className="hidden md:flex md:w-80"/>
        </div>
      </div>
    </div>
  );
}