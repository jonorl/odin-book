import { useContext } from 'react';
import { UserContext } from '../contexts/PostsContext';

export const useTheme = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useTheme must be used within UserProvider');
  return context;
};