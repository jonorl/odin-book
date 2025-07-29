// contexts/AppProviders.jsx
import { ThemeProvider } from '../providers/ThemeProvider';
import { PostsProvider } from '../providers/PostsProvider';
import { UserProvider } from '../providers/UserProvider';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <UserProvider>
        <PostsProvider>
          {children}
        </PostsProvider>
      </UserProvider>
    </ThemeProvider>
  );
};