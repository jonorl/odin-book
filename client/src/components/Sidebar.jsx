import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Home, User, Settings, Moon, Sun } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, currentPage, setCurrentPage } = useUser();
  const [userPopupMenu, setUserPopupMenu] = useState(false);
  const popupRef = useRef(null); // Ref for the popup container
  const moreHorizontalRef = useRef(null); // Ref for the MoreHorizontal icon
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Home', nav: '/', active: true },
    user && { icon: User, nav: `/profile/${user.handle}`, label: 'Profile' },
    { icon: Settings, nav: '/settings', label: 'Settings' }, { icon: FaGithub, nav: 'https://github.com/jonorl', label: 'Github' }
  ];

  // Function to close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target) &&
        moreHorizontalRef.current && !moreHorizontalRef.current.contains(event.target)
      ) {
        setUserPopupMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userPopupMenu]); // Added userPopupMenu to dependencies to re-run effect on state change if popup opens/closes

  const togglePopup = (event) => {
    // Prevent the click from propagating to the document and immediately triggering handleClickOutside
    event.stopPropagation();
    setUserPopupMenu(!userPopupMenu);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };


  return (
    <div className={`w-16 sm:w-20 md:w-64 h-screen p-4 relative ${darkMode // Main sidebar needs 'relative'
      ? 'bg-black border-gray-800'
      : 'bg-white border-gray-200'
      }`}>
      <div className="mb-8 flex items-center justify-between">
        <h1 onClick={() => { currentPage === 1 ? navigate(`/`) : setCurrentPage(1) }} className={`cursor-pointer text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-500'}`}>OdinBook</h1>
        <button
          onClick={toggleDarkMode}
          className={`cursor-pointer p-2 rounded-full transition-colors ${darkMode
            ? 'hover:bg-gray-800 text-white'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {user !== null &&
        <>
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isExternal = item.nav.startsWith('http');
              if (isExternal) {
                return (
                  <a
                    key={index}
                    href={item.nav}
                    target="_blank" // Open external links in a new tab
                    rel="noopener noreferrer" // Security best practice for external links
                    className={`flex items-center space-x-3 w-full p-3 rounded-full transition-colors ${darkMode
                      ? 'hover:bg-gray-800 text-white'
                      : 'hover:bg-gray-100 text-black'
                      } ${item.active ? 'font-bold' : ''}`}
                  >
                    <Icon size={24} />
                    <span className="text-xl">{item.label}</span>
                  </a>
                );
              } else {
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.nav)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-full transition-colors ${darkMode
                      ? 'hover:bg-gray-800 text-white'
                      : 'hover:bg-gray-100 text-black'
                      } ${item.active ? 'font-bold' : ''}`}
                  >
                    <Icon size={24} />
                    <span className="text-xl">{item.label}</span>
                  </button>
                );
              }
            })}
          </nav>

          {/* User Profile Area - needs 'relative' for popup positioning */}
          <div className="absolute left-4 right-4">
            <div
              className={`flex items-center space-x-3 p-3 rounded-full cursor-pointer transition-colors relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={togglePopup}
            >
              {/* Profile Image (placeholder or actual) */}
              <img className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl" src={user.profilePicUrl}></img>

              {/* User Name and Handle */}
              <div className="flex-1">
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{user.name}</div>
                <div className="text-gray-500 text-sm">@{user.handle}</div>
              </div>
              <MoreHorizontal ref={moreHorizontalRef} size={20} className={darkMode ? 'text-white' : 'text-black'} />

              {/* The Popup Box */}
              {userPopupMenu && (
                <div
                  ref={popupRef} // Attach ref to the popup box
                  className={`absolute top-[calc(100%+10px)] right-0 min-w-[200px] rounded-lg shadow-lg z-50 overflow-hidden
                    ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}
                  `}
                >
                  <div className={`py-2`}>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm font-bold transition-colors
                        ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'}
                      `}
                      onClick={(e) => { e.stopPropagation(); logout(); setUserPopupMenu(false); }}
                    >
                      Log out @{user.handle}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default Sidebar;