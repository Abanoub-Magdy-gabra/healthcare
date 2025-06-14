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
} from "lucide-react";

const DashboardLayout = ({ children, role, activeCase, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Use AuthContext logout to properly clear user state
    logout();

    // Navigate to login page
    navigate("/login");
  };

  // Navigation items based on role
  const getNavigationItems = (role) => {
    const baseItems = [
      { name: "Home", key: "home", icon: DoorClosed },
      { name: "Dashboard", key: "dashboard", icon: Home },
      { name: "Profile", key: "profile", icon: UserCheck },
      { name: "Settings", key: "settings", icon: Settings },
    ];

    switch (role) {
      case "patient":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Appointments", key: "appointments", icon: Calendar },
          { name: "Medical Records", key: "medical-records", icon: FileText },
          { name: "Messages", key: "messages", icon: Users },
          { name: "Payments", key: "payments", icon: CreditCard },
          { name: "Room Booking", key: "room-booking", icon: Building },
          ...baseItems.slice(2), // Profile, Settings
        ];
      case "doctor":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Appointments", key: "appointments", icon: Calendar },
          { name: "Patients", key: "patients", icon: Users },
          { name: "Schedule", key: "schedule", icon: Clock },
          { name: "Reports", key: "reports", icon: FileText },
          ...baseItems.slice(2), // Profile, Settings
        ];
      case "nurse":
        return [
          baseItems[0], // Home
          baseItems[1], // Dashboard
          { name: "Patients", key: "patients", icon: Users },
          { name: "Shifts", key: "shifts", icon: Clock },
          { name: "Requests", key: "requests", icon: Activity },
          { name: "Reports", key: "reports", icon: FileText },
          ...baseItems.slice(2), // Profile, Settings
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
          ...baseItems.slice(2), // Profile, Settings
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(role);

  const isActiveCase = (key) => {
    return activeCase === key;
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
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {role}
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
              </button>
            );
          })}
        </nav>

        {/* Theme toggle and Logout section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">

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
                {role} Dashboard
              </h1>
            </div>

            {/* Desktop user menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {role}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
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
