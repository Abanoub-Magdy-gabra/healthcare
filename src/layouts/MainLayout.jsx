import { Outlet } from 'react-router-dom';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>


      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
     
        
        {/* Main content scrollable area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;