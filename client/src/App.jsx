import { useTheme } from './hooks/useTheme';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

export default function OdinBook() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="md:hidden">
        <MainFeed />
      </div>
      <div className="hidden md:flex max-w-7xl mx-auto">
        <Sidebar className="w-64 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <MainFeed />
        </div>
        <RightSidebar className="w-80 flex-shrink-0 hidden lg:block" />
      </div>
    </div>
  );
}