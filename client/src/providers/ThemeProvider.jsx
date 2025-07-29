// providers/ThemeProvider.jsx
import { useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};