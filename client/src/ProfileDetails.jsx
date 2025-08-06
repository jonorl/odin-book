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
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        <Sidebar className="hidden md:flex md:ml-64 w-full md:w-64 fixed md:sticky top-0 z-10"/>
        <div className="flex-1 flex flex-col md:flex-row mx-auto w-full">
          <Profile/>
          <RightSidebar className="hidden md:flex md:w-80"/>
        </div>
      </div>
    </div>
  );
}