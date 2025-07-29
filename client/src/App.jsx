import { useTheme } from './hooks/useTheme';
import { useUser } from './hooks/UseUser'
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

export default function OdinBook() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { HOST, formattedPosts, user, followers, followersPosts, fetchUserAndData } = useUser();

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64" darkMode={darkMode} user={user} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 flex mr-auto ml-auto">
          <MainFeed
            HOST={HOST}
            user={user}
            darkMode={darkMode}
            formattedPosts={formattedPosts}
            followersData={followers}
            followersPosts={followersPosts}
            refetchFollowers={fetchUserAndData}
          />
          <RightSidebar darkMode={darkMode} HOST={HOST} user={user} />
        </div>
      </div>
    </div>
  );
}