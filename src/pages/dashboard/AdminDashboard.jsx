import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { dbService } from '../../lib/supabase.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  Users,
  Building,
  CreditCard,
  FileText,
  Activity,
  Settings,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        usersData,
        roomsData,
        paymentsData,
        activitiesData,
        statsData
      ] = await Promise.all([
        dbService.getAllUsers(),
        dbService.getRooms(),
        dbService.getPayments(user.id, 'admin'),
        dbService.getAuditLogs(),
        dbService.getDashboardStats(user.id, 'admin')
      ]);

      setUsers(usersData || []);
      setRooms(roomsData || []);
      setPayments(paymentsData || []);
      setActivities(activitiesData || []);
      setStats(statsData || {});

      // Mock reports data
      setReports([
        {
          id: 1,
          title: 'Monthly Revenue Report',
          type: 'financial',
          period: 'December 2023',
          status: 'completed',
          generatedBy: 'System',
          date: '2024-01-01',
          revenue: 125000,
          patients: 450
        },
        {
          id: 2,
          title: 'Patient Satisfaction Survey',
          type: 'quality',
          period: 'Q4 2023',
          status: 'completed',
          generatedBy: 'Admin',
          date: '2023-12-31',
          satisfaction: 4.2,
          responses: 89
        }
      ]);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (section) => {
    setActiveCase(section);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.full_name}!</h1>
        <p className="text-indigo-100">System Administrator Dashboard</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers || 0}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {stats.activeUsers || 0} active
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available Rooms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.availableRooms || 0}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                of {stats.totalRooms || 0} total
              </p>
            </div>
            <Building className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingPayments || 0}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Requires attention
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Activities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activities.length}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Last 24 hours
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Users</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="text-lg text-green-600">{stats.activeUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Available Rooms</span>
              <span className="text-lg text-blue-600">{stats.availableRooms || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.user?.full_name || 'System'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activity.table_name || 'system'}
                </span>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent activities
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {users.map((userData) => (
              <div key={userData.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {userData.full_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        userData.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : userData.role === 'doctor'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : userData.role === 'nurse'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {userData.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{userData.email}</span>
                      {userData.department && <span>• {userData.department}</span>}
                      <span>• Joined {formatDate(userData.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      userData.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {userData.is_active ? 'active' : 'inactive'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Room {room.room_number}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {room.room_type} • Floor {room.floor}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                room.status === 'available' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : room.status === 'occupied'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily Rate:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${room.daily_rate}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Capacity:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {room.capacity} patient(s)
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment?.map((item, index) => (
                    <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                {room.status === 'available' ? 'Book Room' : 'View Details'}
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {rooms.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No rooms available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
        <div className="flex space-x-3">
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {payment.patient?.full_name}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {payment.invoice_number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{payment.description}</span>
                      <span>• {formatDate(payment.created_at)}</span>
                      {payment.payment_method && <span>• {payment.payment_method}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${payment.amount}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {payment.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No payment records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.type === 'financial' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : report.type === 'quality'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{report.period}</span>
                      <span>• Generated by {report.generatedBy}</span>
                      <span>• {report.date}</span>
                    </div>
                    {report.revenue && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Revenue: ${report.revenue.toLocaleString()} | Patients: {report.patients}
                      </p>
                    )}
                    {report.satisfaction && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Satisfaction: {report.satisfaction}/5 | Responses: {report.responses}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Activities</h2>
        <div className="flex space-x-3">
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.user?.full_name || 'System'}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {activity.table_name || 'system'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>{formatDate(activity.created_at)}</span>
                      {activity.ip_address && <span>IP: {activity.ip_address}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No activities recorded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">System Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.full_name || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <input
              type="text"
              value="Administration"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Access Level
            </label>
            <input
              type="text"
              value="Full System Access"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Login Monitoring</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Failed Login Alerts</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Automatic Backups</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Maintenance Mode</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeCase) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'users':
        return renderUsers();
      case 'rooms':
        return renderRooms();
      case 'payments':
        return renderPayments();
      case 'reports':
        return renderReports();
      case 'activities':
        return renderActivities();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <DashboardLayout
      role="admin"
      activeCase={activeCase}
      onNavigate={handleNavigation}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;