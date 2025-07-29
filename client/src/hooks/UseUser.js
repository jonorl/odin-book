import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useTheme must be used within UserProvider');
  return context;
};