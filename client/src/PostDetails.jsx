import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useTheme } from './hooks/useTheme';
import { useUser } from './hooks/UseUser'

import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import PostDetailsMainFeed from './components/PostDetailsMainFeed';

export default function OdinBook() {

  const { darkMode, toggleDarkMode } = useTheme();
  const { HOST, user, postDetails, postUserDetails, fetchPostDetails, fetchUserProfileDetails } = useUser();
  const { postId, userId } = useParams();

  // Fetch details of specific post clicked on
  useEffect(() => {
      fetchPostDetails(postId);
      fetchUserProfileDetails(userId)
  }, [postId, userId, fetchPostDetails, fetchUserProfileDetails]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          {
            postDetails && postUserDetails && <PostDetailsMainFeed/>}
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}