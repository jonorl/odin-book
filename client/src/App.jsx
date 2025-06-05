import { useState } from 'react';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

export default function OdinBook() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed darkMode={darkMode} />
          <RightSidebar darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}