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
    <div className={`min-h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="md:hidden">
        <Profile />
      </div>
      <div className="hidden md:flex max-w-7xl mx-auto">
        <Sidebar className="w-64 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Profile />
        </div>
        <RightSidebar className="w-80 flex-shrink-0 hidden lg:block" />
      </div>
    </div>
  );
}