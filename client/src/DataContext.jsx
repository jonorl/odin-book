import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DataContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);