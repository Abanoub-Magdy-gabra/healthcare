import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex justify-center">
            <Activity className="h-12 w-12 text-primary" />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Patient Portal
          </h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;