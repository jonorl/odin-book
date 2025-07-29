import { useState, useEffect, useContext } from 'react';
import { useTheme } from './hooks/useTheme';

import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import SettingsMain from './components/SettingsMain';

const HOST = import.meta.env.VITE_LOCALHOST

export default function OdinBook() {
  const { darkMode, toggleDarkMode } = useTheme();
  // const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${HOST}/api/v1/me`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, [token]);

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <SettingsMain HOST={HOST} user={user} darkMode={darkMode} />
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
          </div>
      </div>
    </div>
  );
}