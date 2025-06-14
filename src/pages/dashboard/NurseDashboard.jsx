import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { dbService } from '../../lib/supabase.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  Users,
  Clock,
  Activity,
  FileText,
  User,
  Settings,
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Heart,
  Thermometer,
  Stethoscope
} from 'lucide-react';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadNurseData();
    }
  }, [user]);

  const loadNurseData = async () => {
    setLoading(true);
    try {
      const [
        requestsData,
        statsData
      ] = await Promise.all([
        dbService.getNurseRequests(user.id, 'nurse'),
        dbService.getDashboardStats(user.id, 'nurse')
      ]);

      setRequests(requestsData || []);
      setStats(statsData || {});

      // Mock data for patients and shifts (would come from actual queries)
      setPatients([
        {
          id: 1,
          name: 'John Smith',
          age: 65,
          room: '101A',
          condition: 'Post-surgery recovery',
          status: 'stable',
          lastVitals: '2024-01-15 08:00',
          vitals: {
            temperature: '98.6°F',
            bloodPressure: '120/80',
            heartRate: '72 bpm',
            oxygenSat: '98%'
          },
          medications: ['Aspirin 81mg', 'Lisinopril 10mg'],
          notes: 'Patient recovering well from surgery'
        }
      ]);

      setShifts([
        {
          id: 1,
          date: '2024-01-15',
          startTime: '07:00',
          endTime: '19:00',
          type: 'Day Shift',
          status: 'active',
          patients: 8,
          location: 'ICU Ward'
        }
      ]);

    } catch (error) {
      console.error('Error loading nurse data:', error);
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

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Good morning, Nurse {user?.full_name}!</h1>
        <p className="text-purple-100">You have {requests.filter(r => r.status === 'pending').length} pending requests today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeRequests || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique Patients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniquePatients || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {requests.slice(0, 4).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{request.patient?.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.request_type} - {formatDate(request.requested_date)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No requests available
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Shifts</h3>
          <div className="space-y-3">
            {shifts.slice(0, 3).map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{shift.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shift.date} - {shift.startTime} to {shift.endTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shift.location} - {shift.patients} patients
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  shift.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {shift.status}
                </span>
              </div>
            ))}
            {shifts.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No shifts scheduled
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Patients</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{patient.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Age: {patient.age} | Room: {patient.room}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                patient.status === 'stable' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : patient.status === 'monitoring'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{patient.condition}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Latest Vitals</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <Thermometer className="h-3 w-3 mr-1 text-red-500" />
                    {patient.vitals.temperature}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1 text-pink-500" />
                    {patient.vitals.heartRate}
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-1 text-blue-500" />
                    {patient.vitals.bloodPressure}
                  </div>
                  <div className="flex items-center">
                    <Stethoscope className="h-3 w-3 mr-1 text-green-500" />
                    {patient.vitals.oxygenSat}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {patient.lastVitals}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Medications</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.medications.map((med, index) => (
                    <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              {patient.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{patient.notes}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                Update Vitals
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                <Eye className="h-4 w-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No patients assigned</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderShifts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Shifts</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Request Shift
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {shift.type}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {shift.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {shift.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {shift.patients} patients
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shift.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {shift.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {shifts.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No shifts scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Home Care Requests</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.patient?.full_name}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {request.request_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : request.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(request.requested_date)} at {formatTime(request.requested_time)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.address}
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Services:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.services?.map((service, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    {request.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Description: {request.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {request.status}
                    </span>
                    {request.status === 'pending' && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Accept
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No requests available</p>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Reports feature coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'N'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Registered Nurse</p>
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
              License Number
            </label>
            <input
              type="text"
              value={user?.license_number || ''}
              placeholder="Add license number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={user?.specialization || ''}
              placeholder="Add specialization"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Shift Notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Patient Alerts</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Home Visit Requests</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Accept home visit requests</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Emergency call availability</span>
                <input type="checkbox" className="toggle" />
              </div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (activeCase) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'patients':
        return renderPatients();
      case 'shifts':
        return renderShifts();
      case 'requests':
        return renderRequests();
      case 'reports':
        return renderReports();
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
      role="nurse"
      activeCase={activeCase}
      onNavigate={handleNavigation}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default NurseDashboard;