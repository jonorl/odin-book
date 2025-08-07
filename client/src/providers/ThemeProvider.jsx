// providers/ThemeProvider.jsx
import { useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("For you");
  const [profileActiveTab, setProfileActiveTab] = useState("posts")
  const [searchActive, setSearchActive] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, activeTab, setActiveTab, profileActiveTab, setProfileActiveTab, searchActive, setSearchActive, isSidebarOpen, setIsSidebarOpen, isRightSidebarOpen, setIsRightSidebarOpen }}>
      {children}
    </ThemeContext.Provider>
  );
};