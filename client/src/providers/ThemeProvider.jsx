// providers/ThemeProvider.jsx
import { useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("For you");
  const [profileActiveTab, setProfileActiveTab] = useState("posts")
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, activeTab, setActiveTab, profileActiveTab, setProfileActiveTab }}>
      {children}
    </ThemeContext.Provider>
  );
};