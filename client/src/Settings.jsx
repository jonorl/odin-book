import { useTheme } from './hooks/useTheme';

import Sidebar from "./components/Sidebar"
import RightSidebar from "./components/RightSidebar"
import SettingsMain from './components/SettingsMain';

export default function OdinBook() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen mx-auto ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="flex max-w-7xl mr-auto ml-auto">
        <Sidebar className="flex ml-64"/>
        <div className="flex-1 flex mr-auto ml-auto">
          <SettingsMain/>
          <RightSidebar/>
          </div>
      </div>
    </div>
  );
}