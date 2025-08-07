import { useTheme } from './hooks/useTheme'
import { useUser } from './hooks/UseUser'
import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import MainFeed from "./components/MainFeed"

export default function OdinBook() {
  const { darkMode, isSidebarOpen, setIsSidebarOpen, isRightSidebarOpen, setIsRightSidebarOpen } = useTheme();
  const { user } = useUser();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="md:hidden">
        <span className='text-xs m-0 p-0'>&zwnj; </span>
        {user ? (
          <img
            className="w-12 h-12 ml-6 mb-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl cursor-pointer"
            src={user?.profilePicUrl || null}
            alt="avatar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <div 
            className={`ml-6 mb-6 cursor-pointer text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-500'}`}
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          >
            OdinBook
          </div>
        )}

        {/* Left Sidebar (for logged-in users) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className={`fixed inset-y-0 left-0 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
              darkMode ? 'bg-black' : 'bg-white'
            } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <Sidebar className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Right Sidebar (for non-logged-in users) */}
        {isRightSidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setIsRightSidebarOpen(false)}
            ></div>
            <div className={`fixed inset-y-0 left-0 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
              darkMode ? 'bg-black' : 'bg-white'
            } ${isRightSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <RightSidebar className="w-full h-full" registeredUser={false} />
            </div>
          </div>
        )}

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