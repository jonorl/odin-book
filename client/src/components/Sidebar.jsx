import { MoreHorizontal, Home, Mail, Bookmark, User, Settings, Moon, Sun } from 'lucide-react';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Mail, label: 'Messages' },
    { icon: Bookmark, label: 'Bookmarks' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className={`w-64 h-screen border-r p-4  left-0 top-0 ${darkMode
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

      <div className="bottom-4 left-4 right-4">
        <div className={`flex items-center space-x-3 p-3 rounded-full cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            👤
          </div>
          <div className="flex-1">
            <div className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Your Name</div>
            <div className="text-gray-500 text-sm">@yourhandle</div>
          </div>
          <MoreHorizontal size={20} className={darkMode ? 'text-white' : 'text-black'} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar
