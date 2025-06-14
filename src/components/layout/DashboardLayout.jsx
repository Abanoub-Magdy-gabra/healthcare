import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";
import {
  Menu,
  X,
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Activity,
  Building,
  CreditCard,
  Clock,
  UserCheck,
  ChevronRight,
  DoorClosed,
  MessageSquare,
  Bell,
  User,
} from "lucide-react";

const DashboardLayout = ({ children, role, activeCase, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Load notification count for logged in users
    if (user) {
      // Mock notification count - in real app, this would come from API
      setNotificationCount(3);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Use AuthContext logout to properly clear user state
      await logout();
      
      // Navigate to login page after successful logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      navigate("/login", { replace: true });
    }
  };

  // Navigation items based on role
  const getNavigationItems = (role) => {
    const baseItems = [
      { name: "Home", key: "home", icon: DoorClosed },
      { name: "Dashboard", key: "dashboard", icon: Home },
      { name: "Profile", key: "profile", icon: UserCheck },
      { name: "Messages", key: "messages", icon: MessageSquare },
      { name: "Settings", key: "settings", icon: Settings },
    ];

    switch (role) {
      case "patient":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Appointments", key: "appointments", icon: Calendar },
          { name: "Medical Records", key: "medical-records", icon: FileText },
          baseItems[3], // Messages
          { name: "Payments", key: "payments", icon: CreditCard },
          { name: "Room Booking", key: "room-booking", icon: Building },
          baseItems[2], // Profile
          baseItems[4], // Settings
        ];
      case "doctor":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Appointments", key: "appointments", icon: Calendar },
          { name: "Patients", key: "patients", icon: Users },
          { name: "Schedule", key: "schedule", icon: Clock },
          { name: "Reports", key: "reports", icon: FileText },
          baseItems[3], // Messages
          baseItems[2], // Profile
          baseItems[4], // Settings
        ];
      case "nurse":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Patients", key: "patients", icon: Users },
          { name: "Shifts", key: "shifts", icon: Clock },
          { name: "Requests", key: "requests", icon: Activity },
          { name: "Reports", key: "reports", icon: FileText },
          baseItems[3], // Messages
          baseItems[2], // Profile
          baseItems[4], // Settings
        ];
      case "admin":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Users", key: "users", icon: Users },
          { name: "Rooms", key: "rooms", icon: Building },
          { name: "Payments", key: "payments", icon: CreditCard },
          { name: "Reports", key: "reports", icon: FileText },
          { name: "Activities", key: "activities", icon: Activity },
          baseItems[3], // Messages
          baseItems[2], // Profile
          baseItems[4], // Settings
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(role);

  const isActiveCase = (key) => {
    return activeCase === key;
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <Activity className="h-8 w-8 text-primary" />
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
              HealthCare
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {getUserInitials()}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getRoleDisplayName(role)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const current = isActiveCase(item.key);

            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.key === "home") {
                    // Navigate to home page
                    navigate("/");
                  } else if (onNavigate) {
                    onNavigate(item.key);
                  }
                  setSidebarOpen(false);
                }}
                className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  current
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    current
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  }`}
                />
                {item.name}
                {current && <ChevronRight className="ml-auto h-4 w-4" />}
                {item.key === "messages" && notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {getRoleDisplayName(role)} Dashboard
              </h1>
            </div>

            {/* Desktop user menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => onNavigate && onNavigate('messages')}
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

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getRoleDisplayName(role)}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-semibold">
                  {getUserInitials()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;