import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Home,
  Info,
  Stethoscope,
  Mail,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

const PublicNavbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Load notification count for logged in users
  useEffect(() => {
    if (user) {
      // Mock notification count - in real app, this would come from API
      setNotificationCount(3);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setSidebarOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    setDropdownOpen(false);
    setSidebarOpen(false);
    navigate(path);
  };

  const getDashboardRoute = (role) => {
    return "/dashboard";
  };

  const getProfileRoute = (role) => {
    return "/dashboard?section=profile";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Services", path: "/services", icon: Activity },
    { name: "Our Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // Try to get full name first, then fall back to email
    if (user.full_name) {
      return user.full_name;
    }
    
    if (user.name) {
      return user.name;
    }
    
    // Extract name from email as last resort
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return "User";
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const names = displayName.split(' ');
    
    if (names.length >= 2) {
      return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    }
    
    return displayName.charAt(0).toUpperCase();
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      case 'nurse':
        return 'Nurse';
      case 'patient':
        return 'Patient';
      default:
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
    }
  };

  return (
    <>
      {/* Desktop & Mobile Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm relative z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo & Desktop Navigation */}
            <div className="flex">
              <Link to="/" className="flex items-center group">
                <Activity className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  HealthCare 
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Theme Toggle, Notifications, User Menu, Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {user ? (
                <>
                  {/* Notifications (for logged in users) */}
                  <div className="relative">
                    <button
                      onClick={() => handleNavigation('/dashboard?section=messages')}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors relative"
                    >
                      <Bell className="h-6 w-6" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* User Dropdown (hidden on mobile, shown in sidebar) */}
                  <div className="hidden lg:block relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-semibold">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getRoleDisplayName(user.role)}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-t-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-lg font-semibold">
                                {getUserInitials()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {getUserDisplayName()}
                              </p>
                              <p className="text-sm text-primary font-medium">
                                {getRoleDisplayName(user.role)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2">
                          <button
                            onClick={() =>
                              handleNavigation(getDashboardRoute(user.role))
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" />
                            Dashboard
                          </button>

                          <button
                            onClick={() =>
                              handleNavigation(getProfileRoute(user.role))
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                          >
                            <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" />
                            Profile Settings
                          </button>

                          <button
                            onClick={() => handleNavigation('/dashboard?section=messages')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                          >
                            <MessageSquare className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" />
                            Messages
                            {notificationCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {notificationCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => handleNavigation("/dashboard?section=settings")}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                          >
                            <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" />
                            Settings
                          </button>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // User not logged in - show login/register buttons (hidden on mobile)
                <div className="hidden lg:flex lg:space-x-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center"
            >
              <Activity className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                HealthCare Portal
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {getRoleDisplayName(user.role)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors group ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`h-6 w-6 mr-3 ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-primary'
                  }`} />
                  {item.name}
                </Link>
              ))}

              {/* User Actions (if logged in) */}
              {user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                  <button
                    onClick={() =>
                      handleNavigation(getDashboardRoute(user.role))
                    }
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group text-left"
                  >
                    <LayoutDashboard className="h-6 w-6 mr-3 text-gray-400 group-hover:text-primary" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => handleNavigation(getProfileRoute(user.role))}
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group text-left"
                  >
                    <User className="h-6 w-6 mr-3 text-gray-400 group-hover:text-primary" />
                    Profile
                  </button>

                  <button
                    onClick={() => handleNavigation('/dashboard?section=messages')}
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group text-left"
                  >
                    <MessageSquare className="h-6 w-6 mr-3 text-gray-400 group-hover:text-primary" />
                    Messages
                    {notificationCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavigation("/dashboard?section=settings")}
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group text-left"
                  >
                    <Settings className="h-6 w-6 mr-3 text-gray-400 group-hover:text-primary" />
                    Settings
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-6 w-6 mr-3" />
                Sign Out
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;