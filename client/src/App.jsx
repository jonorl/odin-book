import { useTheme } from './hooks/useTheme';
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

export default function OdinBook() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl md:flex-row mr-auto ml-auto">
        <Sidebar className="hidden md:flex md:ml-64 w-full md:w-64 fixed md:sticky top-0 z-10"/>
        <div className="flex-1 flex flex-col md:flex-row mx-auto w-full">
          <MainFeed/>
          <RightSidebar/>
        </div>
      </div>
    </div>
  );
}