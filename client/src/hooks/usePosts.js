import { useContext } from 'react';
import { PostsContext } from '../contexts/PostsContext';

export const usePost = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('useTheme must be used within PostsProvider');
  return context;
};