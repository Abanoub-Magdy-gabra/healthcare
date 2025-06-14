import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Building,
  CreditCard,
  Activity,
  ChevronUp,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  Save,
  Edit,
  Plus,
  Eye,
  Download,
  X,
  UserCheck,
  Phone,
  Bell,
  Shield,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeCase, setActiveCase] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    pendingPayments: 0,
    occupancyRate: 0,
  });

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showProcessPaymentModal, setShowProcessPaymentModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showSystemBackupModal, setShowSystemBackupModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);

  // Form data states
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    department: "",
    phone: "",
    address: "",
    emergencyContact: "",
    specialization: "",
    licenseNumber: "",
  });

  const [newRoomData, setNewRoomData] = useState({
    number: "",
    type: "standard",
    floor: "1",
    capacity: "1",
    equipment: "",
    rate: "",
    status: "available",
  });

  const [paymentData, setPaymentData] = useState({
    patientName: "",
    amount: "",
    description: "",
    method: "cash",
    status: "pending",
    insuranceInfo: "",
  });

  const [reportData, setReportData] = useState({
    type: "user_summary",
    dateRange: "month",
    startDate: "",
    endDate: "",
    includeUsers: true,
    includeRooms: true,
    includePayments: true,
    format: "pdf",
  });

  // Check for profile section navigation from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section) {
      setActiveCase(section);
    }
  }, [location]);

  // Mock data
  const recentActivities = [
    {
      id: 1,
      activity: "New user registered",
      user: "John Doe",
      time: "10 minutes ago",
      type: "user_registration",
    },
    {
      id: 2,
      activity: "Room 105 assigned",
      user: "Jane Smith",
      time: "30 minutes ago",
      type: "room_assignment",
    },
    {
      id: 3,
      activity: "Payment processed",
      user: "Mike Johnson",
      time: "1 hour ago",
      type: "payment",
    },
    {
      id: 4,
      activity: "Doctor schedule updated",
      user: "Dr. Wilson",
      time: "2 hours ago",
      type: "schedule_update",
    },
    {
      id: 5,
      activity: "System backup completed",
      user: "System",
      time: "3 hours ago",
      type: "system",
    },
  ];

  const roomStatuses = [
    { id: "available", label: "Available", value: 12, color: "bg-green-500" },
    { id: "occupied", label: "Occupied", value: 35, color: "bg-blue-500" },
    {
      id: "maintenance",
      label: "Maintenance",
      value: 5,
      color: "bg-orange-500",
    },
    { id: "reserved", label: "Reserved", value: 8, color: "bg-purple-500" },
  ];

  const rooms = [
    {
      id: 1,
      number: "101",
      type: "Standard",
      floor: 1,
      status: "available",
      capacity: 1,
      equipment: ["Bed", "TV", "Bathroom"],
      lastCleaned: "2025-01-21",
      rate: 150,
    },
    {
      id: 2,
      number: "102",
      type: "Standard",
      floor: 1,
      status: "occupied",
      capacity: 1,
      equipment: ["Bed", "TV", "Bathroom"],
      patient: "John Doe",
      admissionDate: "2025-01-20",
      rate: 150,
    },
    {
      id: 3,
      number: "201",
      type: "Deluxe",
      floor: 2,
      status: "available",
      capacity: 2,
      equipment: ["Bed", "TV", "Bathroom", "Fridge", "Sofa"],
      lastCleaned: "2025-01-21",
      rate: 250,
    },
    {
      id: 4,
      number: "301",
      type: "ICU",
      floor: 3,
      status: "occupied",
      capacity: 1,
      equipment: ["Bed", "Ventilator", "Monitor", "Defibrillator"],
      patient: "Jane Smith",
      admissionDate: "2025-01-19",
      rate: 500,
    },
    {
      id: 5,
      number: "302",
      type: "ICU",
      floor: 3,
      status: "maintenance",
      capacity: 1,
      equipment: ["Bed", "Ventilator", "Monitor", "Defibrillator"],
      maintenanceIssue: "Ventilator calibration",
      rate: 500,
    },
    {
      id: 6,
      number: "401",
      type: "Surgery",
      floor: 4,
      status: "reserved",
      capacity: 1,
      equipment: ["Operating Table", "Anesthesia Machine", "Surgical Lights"],
      reservedFor: "Heart Surgery - Dr. Wilson",
      reservationTime: "2025-01-22 08:00",
      rate: 1000,
    },
  ];

  // Get users from localStorage
  const getRegisteredUsers = () => {
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );
    return registeredUsers.map((user) => ({
      ...user,
      status: "active",
      lastLogin: new Date().toISOString().split("T")[0],
      department:
        user.role === "doctor"
          ? user.specialization || "General Medicine"
          : user.role === "nurse"
          ? "General Ward"
          : user.role === "admin"
          ? "Administration"
          : null,
    }));
  };

  const users = getRegisteredUsers();

  // Handler functions
  const handleAddUser = (e) => {
    e.preventDefault();
    console.log("Adding user:", newUserData);

    // Get existing users
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...newUserData,
      registeredAt: new Date().toISOString(),
    };

    // Add to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    alert("User added successfully!");
    setShowAddUserModal(false);
    setNewUserData({
      name: "",
      email: "",
      password: "",
      role: "patient",
      department: "",
      phone: "",
      address: "",
      emergencyContact: "",
      specialization: "",
      licenseNumber: "",
    });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    console.log("Adding room:", newRoomData);
    alert("Room added successfully!");
    setShowAddRoomModal(false);
    setNewRoomData({
      number: "",
      type: "standard",
      floor: "1",
      capacity: "1",
      equipment: "",
      rate: "",
      status: "available",
    });
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    console.log("Processing payment:", paymentData);
    alert("Payment processed successfully!");
    setShowProcessPaymentModal(false);
    setPaymentData({
      patientName: "",
      amount: "",
      description: "",
      method: "cash",
      status: "pending",
      insuranceInfo: "",
    });
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generating report:", reportData);
    alert("Report generated successfully! Download will start shortly.");
    setShowGenerateReportModal(false);
  };

  const handleSystemBackup = () => {
    console.log("Initiating system backup...");
    alert(
      "System backup initiated successfully! You will be notified when complete."
    );
    setShowSystemBackupModal(false);
  };

  const payments = [
    {
      id: 1,
      patientName: "John Doe",
      amount: 2500,
      description: "Room charge - 5 days",
      status: "paid",
      date: "2025-01-20",
      method: "Insurance",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      amount: 15000,
      description: "ICU treatment and surgery",
      status: "pending",
      date: "2025-01-19",
      method: "Cash",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      amount: 750,
      description: "Consultation and medication",
      status: "paid",
      date: "2025-01-18",
      method: "Credit Card",
    },
    {
      id: 4,
      patientName: "Sarah Davis",
      amount: 3200,
      description: "Diagnostic tests and room",
      status: "overdue",
      date: "2025-01-15",
      method: "Insurance",
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 254,
        totalRooms: 60,
        pendingPayments: 15,
        occupancyRate: 72,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${color
              .replace("border-", "bg-")
              .replace(
                "dark:border-",
                "dark:bg-"
              )} bg-opacity-10 dark:bg-opacity-10`}
          >
            <Icon
              className={`h-6 w-6 ${color
                .replace("border-", "text-")
                .replace("dark:border-", "dark:text-")}`}
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-2xl font-bold mt-1 text-gray-700 dark:text-gray-300">
              {value}
            </p>
          </div>
        </div>
        {change && (
          <div
            className={`flex items-center ${
              change.type === "increase" ? "text-green-500" : "text-red-500"
            }`}
          >
            {change.type === "increase" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{change.value}%</span>
          </div>
        )}
      </div>
    </div>
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, Admin {user?.name || "Administrator"}!
            </h1>
            <p className="text-indigo-100">
              Today is{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveCase("users")}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </button>
            <button
              onClick={() => setActiveCase("reports")}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-full"></div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="border-blue-500 dark:border-blue-400"
            change={{ type: "increase", value: 12 }}
          />
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={Building}
            color="border-green-500 dark:border-green-400"
          />
          <StatCard
            title="Pending Payments"
            value={`$${stats.pendingPayments}k`}
            icon={CreditCard}
            color="border-orange-500 dark:border-orange-400"
            change={{ type: "decrease", value: 3 }}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={Activity}
            color="border-purple-500 dark:border-purple-400"
            change={{ type: "increase", value: 8 }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Room Status
            </h2>
            <Link
              to="/admin/rooms"
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
            >
              Manage →
            </Link>
          </div>

          <div className="space-y-4">
            {roomStatuses.map((status) => (
              <div key={status.id} className="flex items-center">
                <div
                  className={`h-4 w-4 rounded-full ${status.color} mr-3`}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {status.label}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {status.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${status.color} h-2 rounded-full`}
                      style={{ width: `${(status.value / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Add Room
                </span>
              </button>
              <button
                onClick={() => setShowGenerateReportModal(true)}
                className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Room Report
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <Link
              to="/admin/activities"
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-hidden">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`py-4 ${
                    index !== 0
                      ? "border-t border-gray-200 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-3 w-3 rounded-full bg-blue-500 mt-2"></div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.activity}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        By {activity.user}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management Quick Links */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              User Management
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/admin/users"
                className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 group"
              >
                <Users className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                  All Users
                </span>
              </Link>

              <Link
                to="/admin/doctors"
                className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 group"
              >
                <Activity className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                  Doctors
                </span>
              </Link>

              <Link
                to="/admin/nurses"
                className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 group"
              >
                <Users className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                  Nurses
                </span>
              </Link>

              <Link
                to="/admin/patients"
                className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 group"
              >
                <Users className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                  Patients
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple placeholder sections for other cases
  const UsersSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-blue-100">Manage all system users</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              User Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Users ({users.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email} •{" "}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        {user.department && ` • ${user.department}`}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Last login:{" "}
                        {new Date(user.lastLogin).toLocaleDateString()}
                        {user.phone && ` • ${user.phone}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                    <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No registered users in the system yet.
              </p>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RoomsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Management</h1>
            <p className="text-green-100">
              Manage hospital rooms and facilities
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Room Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Rooms ({rooms.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Room {room.number} - {room.type}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Floor {room.floor} • Capacity: {room.capacity} • $
                      {room.rate}/day
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {room.status === "occupied" &&
                        `Patient: ${room.patient} • Admitted: ${new Date(
                          room.admissionDate
                        ).toLocaleDateString()}`}
                      {room.status === "available" &&
                        `Last cleaned: ${new Date(
                          room.lastCleaned
                        ).toLocaleDateString()}`}
                      {room.status === "maintenance" &&
                        `Issue: ${room.maintenanceIssue}`}
                      {room.status === "reserved" &&
                        `Reserved for: ${room.reservedFor} at ${room.reservationTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      room.status === "available"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : room.status === "occupied"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : room.status === "maintenance"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PaymentsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payment Management</h1>
            <p className="text-orange-100">Manage payments and billing</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowProcessPaymentModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Payment Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Payments ({payments.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowProcessPaymentModal(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Process Payment
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {payment.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${payment.amount} • {payment.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(payment.date).toLocaleDateString()} •{" "}
                      {payment.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReportsSection = () => {
    const systemReports = [
      {
        id: 1,
        title: "Monthly System Usage Report",
        date: "2025-01-21",
        type: "System Report",
        status: "Completed",
        description: "Comprehensive system usage and performance metrics",
      },
      {
        id: 2,
        title: "User Activity Summary",
        date: "2025-01-20",
        type: "User Report",
        status: "Pending",
        description: "All user activities and login statistics",
      },
      {
        id: 3,
        title: "Financial Overview",
        date: "2025-01-19",
        type: "Financial Report",
        status: "Completed",
        description: "Payment processing and revenue analysis",
      },
      {
        id: 4,
        title: "Room Utilization Report",
        date: "2025-01-18",
        type: "Operations Report",
        status: "In Progress",
        description: "Room occupancy and maintenance statistics",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">System Reports</h1>
              <p className="text-indigo-100">
                Generate and view system reports
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowGenerateReportModal(true)}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </button>
              <button
                onClick={() => setShowSystemBackupModal(true)}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                System Backup
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Reports ({systemReports.length})
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowGenerateReportModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {systemReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.type} •{" "}
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {report.status}
                    </span>
                    <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActivitiesSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">System Activities</h1>
            <p className="text-cyan-100">Monitor system activities and logs</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSystemBackupModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              System Backup
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Activity Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activities ({recentActivities.length})
          </h2>
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full ${
                      activity.type === "user_registration"
                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                        : activity.type === "room_assignment"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        : activity.type === "payment"
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                        : activity.type === "schedule_update"
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {activity.type === "user_registration" ? (
                      <UserCheck className="h-6 w-6" />
                    ) : activity.type === "room_assignment" ? (
                      <Building className="h-6 w-6" />
                    ) : activity.type === "payment" ? (
                      <CreditCard className="h-6 w-6" />
                    ) : activity.type === "schedule_update" ? (
                      <Calendar className="h-6 w-6" />
                    ) : (
                      <Activity className="h-6 w-6" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activity.activity}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.type === "user_registration"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : activity.type === "room_assignment"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : activity.type === "payment"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : activity.type === "schedule_update"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {activity.type.replace("_", " ").toUpperCase()}
                  </span>
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: user?.name || "System Administrator",
      email: user?.email || "admin@healthcareportal.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-20",
      address: "123 Healthcare Admin Center, Medical District, HC 12345",
      emergencyContact: "John Admin - +1 (555) 987-6543",
      employeeId: "ADM001",
      department: "Administration",
      position: "System Administrator",
      yearsExperience: "10",
      education: "MBA - Healthcare Management",
      certifications:
        "Certified Healthcare Administrator (CHA), HIPAA Compliance",
      responsibilities:
        "System oversight, User management, Data security, Compliance monitoring",
      accessLevel: "Level 5 - Full System Access",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSaveProfile = (e) => {
      e.preventDefault();
      console.log("Saving admin profile:", profileData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Profile</h1>
              <p className="text-indigo-100">
                Manage your administrative information
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <User className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {profileData.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                System Administrator
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.department}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.yearsExperience} years experience
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contact
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profileData.emergencyContact}
                </p>
              )}
            </div>
          </div>

          {/* Personal and Professional Information */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSaveProfile}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {new Date(profileData.dateOfBirth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Administrative Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Administrative Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Employee ID
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="employeeId"
                        value={profileData.employeeId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.employeeId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        name="department"
                        value={profileData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Administration">Administration</option>
                        <option value="IT">Information Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">Human Resources</option>
                        <option value="Operations">Operations</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={profileData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.position}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="yearsExperience"
                        value={profileData.yearsExperience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.yearsExperience} years
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Education
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="education"
                        value={profileData.education}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.education}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Access Level
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.accessLevel}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Certifications
                    </label>
                    {isEditing ? (
                      <textarea
                        name="certifications"
                        value={profileData.certifications}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List your certifications..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.certifications}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key Responsibilities
                    </label>
                    {isEditing ? (
                      <textarea
                        name="responsibilities"
                        value={profileData.responsibilities}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List your key responsibilities..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.responsibilities}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  const SettingsSection = () => {
    const [systemSettings, setSystemSettings] = useState({
      emailNotifications: true,
      smsNotifications: false,
      systemAlerts: true,
      userRegistrations: true,
      paymentNotifications: true,
      roomAlerts: true,
      backupNotifications: false,
      maintenanceAlerts: true,
    });

    const [securitySettings, setSecuritySettings] = useState({
      allowUserRegistration: true,
      requireEmailVerification: true,
      enableTwoFactor: false,
      automaticBackups: true,
    });

    const [generalSettings, setGeneralSettings] = useState({
      language: "english",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12",
      theme: "auto",
      currency: "USD",
    });

    const handleSystemSettingChange = (key, value) => {
      setSystemSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSecuritySettingChange = (key, value) => {
      setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleGeneralSettingChange = (key, value) => {
      setGeneralSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveSettings = () => {
      console.log("Saving admin settings:", {
        systemSettings,
        securitySettings,
        generalSettings,
      });
      alert("System settings saved successfully!");
    };

    const handleExportData = () => {
      alert(
        "System data export has been initiated. You will receive a notification when complete."
      );
    };

    const handleDeleteData = () => {
      if (
        window.confirm(
          "Are you sure you want to delete all system data? This action cannot be undone."
        )
      ) {
        alert(
          "Data deletion request submitted. Please contact technical support to complete the process."
        );
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">System Settings</h1>
          <p className="text-gray-300">
            Configure system preferences and notifications
          </p>
        </div>

        {/* System Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            System Notification Preferences
          </h2>
          <div className="space-y-4">
            {Object.entries(systemSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "emailNotifications" &&
                      "Receive admin notifications via email"}
                    {key === "smsNotifications" &&
                      "Receive urgent alerts via SMS"}
                    {key === "systemAlerts" &&
                      "Get notified about system status changes"}
                    {key === "userRegistrations" &&
                      "Get alerts when new users register"}
                    {key === "paymentNotifications" &&
                      "Receive payment processing notifications"}
                    {key === "roomAlerts" &&
                      "Get notified about room status changes"}
                    {key === "backupNotifications" &&
                      "Receive system backup notifications"}
                    {key === "maintenanceAlerts" &&
                      "Get maintenance and update notifications"}
                  </p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    value ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security & Access Settings
          </h2>
          <div className="space-y-4">
            {Object.entries(securitySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "allowUserRegistration" &&
                      "Allow new users to register accounts"}
                    {key === "requireEmailVerification" &&
                      "Require email verification for new accounts"}
                    {key === "enableTwoFactor" &&
                      "Enable two-factor authentication for admin accounts"}
                    {key === "automaticBackups" &&
                      "Enable automatic daily system backups"}
                  </p>
                </div>
                <button
                  onClick={() => handleSecuritySettingChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    value ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* General Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            General System Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Language
              </label>
              <select
                value={generalSettings.language}
                onChange={(e) =>
                  handleGeneralSettingChange("language", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="english">English</option>
                <option value="spanish">Español</option>
                <option value="french">Français</option>
                <option value="arabic">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Timezone
              </label>
              <select
                value={generalSettings.timezone}
                onChange={(e) =>
                  handleGeneralSettingChange("timezone", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                value={generalSettings.dateFormat}
                onChange={(e) =>
                  handleGeneralSettingChange("dateFormat", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                value={generalSettings.timeFormat}
                onChange={(e) =>
                  handleGeneralSettingChange("timeFormat", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="12">12 Hour</option>
                <option value="24">24 Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme Preference
              </label>
              <select
                value={generalSettings.theme}
                onChange={(e) =>
                  handleGeneralSettingChange("theme", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="auto">Auto (System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={generalSettings.currency}
                onChange={(e) =>
                  handleGeneralSettingChange("currency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SAR">SAR (ر.س)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            System Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Manual System Backup
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create a manual backup of all system data
                </p>
              </div>
              <button
                onClick={() => setShowSystemBackupModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Backup Now
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Export System Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Export all system data for analysis or migration
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Export Data
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <h3 className="text-sm font-medium text-red-900 dark:text-red-200">
                  Delete All System Data
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Permanently delete all system data and user accounts
                </p>
              </div>
              <button
                onClick={handleDeleteData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </button>
        </div>
      </div>
    );
  };

  // Render different cases
  const renderActiveCase = () => {
    switch (activeCase) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UsersSection />;
      case "rooms":
        return <RoomsSection />;
      case "payments":
        return <PaymentsSection />;
      case "reports":
        return <ReportsSection />;
      case "activities":
        return <ActivitiesSection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  // Modal Components
  const AddUserModal = () =>
    showAddUserModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New User
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Role *
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="patient">Patient</option>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newUserData.department}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        department: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {newUserData.role === "doctor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={newUserData.specialization}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          specialization: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={newUserData.licenseNumber}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          licenseNumber: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Address
                  </label>
                  <textarea
                    value={newUserData.address}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Emergency Contact
                  </label>
                  <textarea
                    value={newUserData.emergencyContact}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const AddRoomModal = () =>
    showAddRoomModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Room
              </h2>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={newRoomData.number}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, number: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Room Type *
                  </label>
                  <select
                    value={newRoomData.type}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, type: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="icu">ICU</option>
                    <option value="surgery">Surgery</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    value={newRoomData.floor}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, floor: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={newRoomData.capacity}
                    onChange={(e) =>
                      setNewRoomData({
                        ...newRoomData,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Daily Rate ($) *
                  </label>
                  <input
                    type="number"
                    value={newRoomData.rate}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, rate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={newRoomData.status}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Equipment & Features
                </label>
                <textarea
                  value={newRoomData.equipment}
                  onChange={(e) =>
                    setNewRoomData({
                      ...newRoomData,
                      equipment: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="List equipment and features (e.g., Bed, TV, Bathroom, Medical equipment...)"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const ProcessPaymentModal = () =>
    showProcessPaymentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Process Payment
              </h2>
              <button
                onClick={() => setShowProcessPaymentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={paymentData.patientName}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.method}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, method: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="insurance">Insurance</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentData.status}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Description *
                </label>
                <textarea
                  value={paymentData.description}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Description of services, treatments, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Insurance Information
                </label>
                <textarea
                  value={paymentData.insuranceInfo}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      insuranceInfo: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  rows="2"
                  placeholder="Insurance provider, policy number, etc."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowProcessPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const GenerateReportModal = () =>
    showGenerateReportModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Generate System Report
              </h2>
              <button
                onClick={() => setShowGenerateReportModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportData.type}
                    onChange={(e) =>
                      setReportData({ ...reportData, type: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user_summary">User Summary</option>
                    <option value="room_utilization">Room Utilization</option>
                    <option value="financial_overview">
                      Financial Overview
                    </option>
                    <option value="system_activity">System Activity</option>
                    <option value="comprehensive">Comprehensive Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Date Range
                  </label>
                  <select
                    value={reportData.dateRange}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        dateRange: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={reportData.startDate}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={reportData.endDate}
                    onChange={(e) =>
                      setReportData({ ...reportData, endDate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Include in Report:
                </h3>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includeUsers}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includeUsers: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-white">
                    User Data & Analytics
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includeRooms}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includeRooms: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-white">
                    Room Utilization & Status
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includePayments}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includePayments: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-white">
                    Payment & Financial Data
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Report Format
                </label>
                <select
                  value={reportData.format}
                  onChange={(e) =>
                    setReportData({ ...reportData, format: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const SystemBackupModal = () =>
    showSystemBackupModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Backup
              </h2>
              <button
                onClick={() => setShowSystemBackupModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create System Backup
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This will create a complete backup of all system data including
                users, rooms, payments, and settings.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notice
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    The backup process may take several minutes depending on
                    data size. Do not close this window during the process.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSystemBackupModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSystemBackup}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <DashboardLayout
      role="admin"
      activeCase={activeCase}
      onNavigate={setActiveCase}
    >
      <div className="space-y-6">{renderActiveCase()}</div>

      {/* Modals */}
      <AddUserModal />
      <AddRoomModal />
      <ProcessPaymentModal />
      <GenerateReportModal />
      <SystemBackupModal />
    </DashboardLayout>
  );
};

export default AdminDashboard;
