import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from './hooks/useTheme';
import { useUser } from './hooks/UseUser'
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Profile from "./components/Profile";

export default function OdinBook() {
  const { darkMode } = useTheme();
  const { fetchUserDetails } = useUser();
  const { handle } = useParams();

  // Fetch user and specific user details
  useEffect(() => {
    if (handle) {
      fetchUserDetails(handle);
    }
  }, [fetchUserDetails, handle]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64"/>
        <div className="flex-1 flex mr-auto ml-auto">
          <Profile/>
          <RightSidebar/>
        </div>
      </div>
    </div>
  );
}