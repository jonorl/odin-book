import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Home, Mail, Bookmark, User, Settings, Moon, Sun } from 'lucide-react';

const Sidebar = ({ darkMode, toggleDarkMode, user }) => {
  const [userPopupMenu, setUserPopupMenu] = useState(false);
  const popupRef = useRef(null); // Ref for the popup container
  const moreHorizontalRef = useRef(null); // Ref for the MoreHorizontal icon

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' }
  ];

  // Function to close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the popup AND outside the MoreHorizontal icon
      // If event.target is NOT inside popupRef.current AND NOT inside moreHorizontalRef.current
      if (
        popupRef.current && !popupRef.current.contains(event.target) &&
        moreHorizontalRef.current && !moreHorizontalRef.current.contains(event.target)
      ) {
        setUserPopupMenu(false); // Corrected: Set to false to close the popup
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
    <div className={`w-16 sm:w-20 md:w-64 h-screen border-r p-4 relative ${darkMode // Main sidebar needs 'relative'
      ? 'bg-black border-gray-800'
      : 'bg-white border-gray-200'
      }`}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-500'}`}>OdinBook</h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors ${darkMode
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
              return (
                <button
                  key={index}
                  className={`flex items-center space-x-3 w-full p-3 rounded-full transition-colors ${darkMode
                    ? 'hover:bg-gray-800 text-white'
                    : 'hover:bg-gray-100 text-black'
                    } ${item.active ? 'font-bold' : ''}`}
                >
                  <Icon size={24} />
                  <span className="text-xl">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Area - needs 'relative' for popup positioning */}
          <div className="absolute left-4 right-4">
            <div
              className={`flex items-center space-x-3 p-3 rounded-full cursor-pointer transition-colors relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={togglePopup}
            >
              {/* Profile Image (placeholder or actual) */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
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