import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { dbService } from '../../lib/supabase.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  Users,
  Clock,
  Activity,
  FileText,
  Settings,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Heart,
  Thermometer,
  Droplets,
  Zap,
  X,
  Save,
  User,
  Stethoscope,
  Clipboard,
  Home,
  Building,
  Star,
  Download
} from 'lucide-react';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [patients, setPatients] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});

  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingShift, setEditingShift] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form states
  const [patientForm, setPatientForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_conditions: '',
    medications: '',
    notes: ''
  });

  const [shiftForm, setShiftForm] = useState({
    title: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    patient_count: 1,
    description: '',
    requirements: ''
  });

  const [requestForm, setRequestForm] = useState({
    patient_id: '',
    request_type: '',
    description: '',
    address: '',
    requested_date: '',
    requested_time: '',
    duration_hours: 2,
    priority: 'medium',
    services: [],
    special_instructions: '',
    estimated_cost: 0
  });

  const [vitalsForm, setVitalsForm] = useState({
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    oxygen_saturation: '',
    respiratory_rate: '',
    notes: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

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

      // Mock data for patients and shifts (in real app, these would come from database)
      setPatients([
        {
          id: '1',
          full_name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0009',
          address: '123 Main St, Anytown, ST 12345',
          status: 'stable',
          last_visit: '2024-01-15',
          conditions: ['Diabetes', 'Hypertension'],
          medications: ['Metformin', 'Lisinopril'],
          notes: 'Regular monitoring required'
        },
        {
          id: '2',
          full_name: 'Mary Johnson',
          email: 'mary.johnson@email.com',
          phone: '+1-555-0011',
          address: '456 Oak Ave, Somewhere, ST 12346',
          status: 'monitoring',
          last_visit: '2024-01-18',
          conditions: ['Post-surgery recovery'],
          medications: ['Pain medication', 'Antibiotics'],
          notes: 'Wound care needed'
        }
      ]);

      setShifts([
        {
          id: '1',
          title: 'Morning Shift - ICU',
          location: 'City General Hospital',
          start_date: '2024-01-20',
          start_time: '07:00',
          end_date: '2024-01-20',
          end_time: '15:00',
          patient_count: 8,
          status: 'scheduled'
        },
        {
          id: '2',
          title: 'Home Visit - Elderly Care',
          location: '789 Pine Rd, Elsewhere, ST 12347',
          start_date: '2024-01-21',
          start_time: '09:00',
          end_date: '2024-01-21',
          end_time: '13:00',
          patient_count: 1,
          status: 'in_progress'
        }
      ]);

    } catch (error) {
      console.error('Error loading nurse data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (section) => {
    setActiveCase(section);
    setError('');
    setSuccess('');
  };

  // Patient Management Functions
  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would create a patient profile
      const newPatient = {
        id: Date.now().toString(),
        ...patientForm,
        status: 'stable',
        last_visit: new Date().toISOString().split('T')[0],
        conditions: patientForm.medical_conditions.split(',').map(c => c.trim()).filter(c => c),
        medications: patientForm.medications.split(',').map(m => m.trim()).filter(m => m)
      };

      setPatients(prev => [...prev, newPatient]);
      setShowPatientModal(false);
      resetPatientForm();
      setSuccess('Patient added successfully!');
    } catch (error) {
      setError('Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedPatient = {
        ...editingPatient,
        ...patientForm,
        conditions: patientForm.medical_conditions.split(',').map(c => c.trim()).filter(c => c),
        medications: patientForm.medications.split(',').map(m => m.trim()).filter(m => m)
      };

      setPatients(prev => prev.map(p => p.id === editingPatient.id ? updatedPatient : p));
      setShowPatientModal(false);
      setEditingPatient(null);
      resetPatientForm();
      setSuccess('Patient updated successfully!');
    } catch (error) {
      setError('Failed to update patient');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVitals = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would save vitals to medical records
      const vitalsRecord = {
        patient_id: selectedPatient.id,
        record_type: 'Vital Signs',
        title: 'Vital Signs Check',
        description: `BP: ${vitalsForm.blood_pressure}, HR: ${vitalsForm.heart_rate}, Temp: ${vitalsForm.temperature}°F, O2: ${vitalsForm.oxygen_saturation}%, RR: ${vitalsForm.respiratory_rate}`,
        test_results: vitalsForm,
        record_date: new Date().toISOString().split('T')[0],
        is_critical: false
      };

      // Update patient's last visit
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id 
          ? { ...p, last_visit: new Date().toISOString().split('T')[0] }
          : p
      ));

      setShowVitalsModal(false);
      setSelectedPatient(null);
      resetVitalsForm();
      setSuccess('Vital signs recorded successfully!');
    } catch (error) {
      setError('Failed to record vital signs');
    } finally {
      setLoading(false);
    }
  };

  // Shift Management Functions
  const handleAddShift = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newShift = {
        id: Date.now().toString(),
        ...shiftForm,
        status: 'scheduled'
      };

      setShifts(prev => [...prev, newShift]);
      setShowShiftModal(false);
      resetShiftForm();
      setSuccess('Shift scheduled successfully!');
    } catch (error) {
      setError('Failed to schedule shift');
    } finally {
      setLoading(false);
    }
  };

  // Request Management Functions
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        ...requestForm,
        patient_id: requestForm.patient_id || patients[0]?.id,
        nurse_id: user.id,
        services: requestForm.services
      };

      const newRequest = await dbService.createNurseRequest(requestData);
      setRequests(prev => [...prev, newRequest]);
      setShowRequestModal(false);
      resetRequestForm();
      setSuccess('Request created successfully!');
      
      // Reload data to get updated stats
      loadNurseData();
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setLoading(true);
    try {
      await dbService.updateNurseRequest(requestId, {
        nurse_id: user.id,
        status: 'confirmed'
      });

      setRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, nurse_id: user.id, status: 'confirmed' }
          : r
      ));
      setSuccess('Request accepted successfully!');
      
      // Reload data to get updated stats
      loadNurseData();
    } catch (error) {
      console.error('Error accepting request:', error);
      setError('Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    setLoading(true);
    try {
      await dbService.updateNurseRequest(requestId, {
        status: 'completed'
      });

      setRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'completed' }
          : r
      ));
      setSuccess('Request completed successfully!');
      
      // Reload data to get updated stats
      loadNurseData();
    } catch (error) {
      console.error('Error completing request:', error);
      setError('Failed to complete request');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRequest = async (requestId) => {
    setLoading(true);
    try {
      await dbService.updateNurseRequest(requestId, {
        status: 'in_progress'
      });

      setRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'in_progress' }
          : r
      ));
      setSuccess('Request started successfully!');
      
      // Reload data to get updated stats
      loadNurseData();
    } catch (error) {
      console.error('Error starting request:', error);
      setError('Failed to start request');
    } finally {
      setLoading(false);
    }
  };

  // Form reset functions
  const resetPatientForm = () => {
    setPatientForm({
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      medical_conditions: '',
      medications: '',
      notes: ''
    });
  };

  const resetShiftForm = () => {
    setShiftForm({
      title: '',
      location: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      patient_count: 1,
      description: '',
      requirements: ''
    });
  };

  const resetRequestForm = () => {
    setRequestForm({
      patient_id: '',
      request_type: '',
      description: '',
      address: '',
      requested_date: '',
      requested_time: '',
      duration_hours: 2,
      priority: 'medium',
      services: [],
      special_instructions: '',
      estimated_cost: 0
    });
  };

  const resetVitalsForm = () => {
    setVitalsForm({
      blood_pressure: '',
      heart_rate: '',
      temperature: '',
      oxygen_saturation: '',
      respiratory_rate: '',
      notes: ''
    });
  };

  // Modal handlers
  const openAddPatientModal = () => {
    resetPatientForm();
    setEditingPatient(null);
    setShowPatientModal(true);
  };

  const openEditPatientModal = (patient) => {
    setPatientForm({
      full_name: patient.full_name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth || '',
      address: patient.address,
      emergency_contact: patient.emergency_contact || '',
      emergency_phone: patient.emergency_phone || '',
      medical_conditions: patient.conditions?.join(', ') || '',
      medications: patient.medications?.join(', ') || '',
      notes: patient.notes || ''
    });
    setEditingPatient(patient);
    setShowPatientModal(true);
  };

  const openVitalsModal = (patient) => {
    setSelectedPatient(patient);
    resetVitalsForm();
    setShowVitalsModal(true);
  };

  const openAddShiftModal = () => {
    resetShiftForm();
    setEditingShift(null);
    setShowShiftModal(true);
  };

  const openAddRequestModal = () => {
    resetRequestForm();
    setEditingRequest(null);
    setShowRequestModal(true);
  };

  // Filter functions
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Render functions for each section
  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.full_name}!</h1>
        <p className="text-green-100">You have {stats.activeRequests || 0} active requests today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeRequests || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniquePatients || patients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests || requests.length}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent requests
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Shifts</h3>
          <div className="space-y-3">
            {shifts.slice(0, 4).map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{shift.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(shift.start_date)} at {formatTime(shift.start_time)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                  {shift.status}
                </span>
              </div>
            ))}
            {shifts.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming shifts
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Management</h2>
        <button
          onClick={openAddPatientModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.full_name}
                      </h3>
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
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {patient.email}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Address:</strong> {patient.address}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Conditions:</strong> {patient.conditions?.join(', ') || 'None'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Last Visit:</strong> {formatDate(patient.last_visit)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openVitalsModal(patient)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Record Vitals"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditPatientModal(patient)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit Patient"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No patients yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShifts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shift Management</h2>
        <button
          onClick={openAddShiftModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Shift
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
                        {shift.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                        {shift.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {shift.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(shift.start_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Patients:</strong> {shift.patient_count}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
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
        <button
          onClick={openAddRequestModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Request
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.patient?.full_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        {request.request_type}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(request.requested_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(request.requested_time)} ({request.duration_hours}h)
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Address:</strong> {request.address}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Description:</strong> {request.description}
                    </div>
                    {request.services && request.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {request.services.map((service, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                    {request.estimated_cost && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Estimated Cost:</strong> ${request.estimated_cost}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.status === 'pending' && !request.nurse_id && (
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        disabled={loading}
                      >
                        Accept
                      </button>
                    )}
                    {request.status === 'confirmed' && request.nurse_id === user.id && (
                      <button
                        onClick={() => handleStartRequest(request.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        disabled={loading}
                      >
                        Start
                      </button>
                    )}
                    {request.status === 'in_progress' && request.nurse_id === user.id && (
                      <button
                        onClick={() => handleCompleteRequest(request.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                        disabled={loading}
                      >
                        Complete
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No requests found</p>
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
        <button
          onClick={() => setSuccess('Report generated successfully!')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Report</h3>
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate daily activity and patient care report
          </p>
          <button
            onClick={() => setSuccess('Daily report generated successfully!')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Generate Daily Report
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Summary</h3>
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comprehensive patient care summary report
          </p>
          <button
            onClick={() => setSuccess('Patient summary generated successfully!')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Generate Summary
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Report</h3>
            <Clock className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Detailed shift activities and time tracking
          </p>
          <button
            onClick={() => setSuccess('Shift report generated successfully!')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Generate Shift Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
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

        <form onSubmit={(e) => {
          e.preventDefault();
          setSuccess('Profile updated successfully!');
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.full_name || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
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
                defaultValue={user?.license_number || ''}
                placeholder="RN123456"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <input
                type="text"
                defaultValue={user?.specialization || ''}
                placeholder="Critical Care, Emergency, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={user?.phone || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                defaultValue={user?.department || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">New Request Notifications</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Shift Reminders</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Patient Updates</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Emergency Alerts</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Available for Home Visits</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Emergency Call Availability</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Weekend Shifts</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Night Shifts</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const PatientModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingPatient ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <button
            onClick={() => setShowPatientModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={editingPatient ? handleEditPatient : handleAddPatient}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={patientForm.full_name}
                onChange={(e) => setPatientForm({...patientForm, full_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={patientForm.email}
                onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={patientForm.phone}
                onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={patientForm.date_of_birth}
                onChange={(e) => setPatientForm({...patientForm, date_of_birth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={patientForm.address}
                onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={patientForm.emergency_contact}
                onChange={(e) => setPatientForm({...patientForm, emergency_contact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emergency Phone
              </label>
              <input
                type="tel"
                value={patientForm.emergency_phone}
                onChange={(e) => setPatientForm({...patientForm, emergency_phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical Conditions (comma separated)
              </label>
              <input
                type="text"
                value={patientForm.medical_conditions}
                onChange={(e) => setPatientForm({...patientForm, medical_conditions: e.target.value})}
                placeholder="Diabetes, Hypertension, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Medications (comma separated)
              </label>
              <input
                type="text"
                value={patientForm.medications}
                onChange={(e) => setPatientForm({...patientForm, medications: e.target.value})}
                placeholder="Metformin, Lisinopril, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={patientForm.notes}
                onChange={(e) => setPatientForm({...patientForm, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowPatientModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {editingPatient ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const VitalsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Record Vital Signs - {selectedPatient?.full_name}
          </h3>
          <button
            onClick={() => setShowVitalsModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleUpdateVitals}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                value={vitalsForm.blood_pressure}
                onChange={(e) => setVitalsForm({...vitalsForm, blood_pressure: e.target.value})}
                placeholder="120/80"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={vitalsForm.heart_rate}
                onChange={(e) => setVitalsForm({...vitalsForm, heart_rate: e.target.value})}
                placeholder="72"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={vitalsForm.temperature}
                onChange={(e) => setVitalsForm({...vitalsForm, temperature: e.target.value})}
                placeholder="98.6"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Oxygen Saturation (%)
              </label>
              <input
                type="number"
                value={vitalsForm.oxygen_saturation}
                onChange={(e) => setVitalsForm({...vitalsForm, oxygen_saturation: e.target.value})}
                placeholder="98"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <input
                type="number"
                value={vitalsForm.respiratory_rate}
                onChange={(e) => setVitalsForm({...vitalsForm, respiratory_rate: e.target.value})}
                placeholder="16"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={vitalsForm.notes}
                onChange={(e) => setVitalsForm({...vitalsForm, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowVitalsModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              Record Vitals
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ShiftModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Schedule New Shift
          </h3>
          <button
            onClick={() => setShowShiftModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleAddShift}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shift Title *
              </label>
              <input
                type="text"
                required
                value={shiftForm.title}
                onChange={(e) => setShiftForm({...shiftForm, title: e.target.value})}
                placeholder="Morning Shift - ICU"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={shiftForm.location}
                onChange={(e) => setShiftForm({...shiftForm, location: e.target.value})}
                placeholder="City General Hospital"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={shiftForm.start_date}
                onChange={(e) => setShiftForm({...shiftForm, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={shiftForm.start_time}
                onChange={(e) => setShiftForm({...shiftForm, start_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={shiftForm.end_date}
                onChange={(e) => setShiftForm({...shiftForm, end_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={shiftForm.end_time}
                onChange={(e) => setShiftForm({...shiftForm, end_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Patient Count
              </label>
              <input
                type="number"
                min="1"
                value={shiftForm.patient_count}
                onChange={(e) => setShiftForm({...shiftForm, patient_count: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={shiftForm.description}
                onChange={(e) => setShiftForm({...shiftForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowShiftModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              Schedule Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const RequestModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Request
          </h3>
          <button
            onClick={() => setShowRequestModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleCreateRequest}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Patient
              </label>
              <select
                value={requestForm.patient_id}
                onChange={(e) => setRequestForm({...requestForm, patient_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Request Type *
              </label>
              <select
                required
                value={requestForm.request_type}
                onChange={(e) => setRequestForm({...requestForm, request_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Type</option>
                <option value="Post-Surgery Care">Post-Surgery Care</option>
                <option value="Routine Care">Routine Care</option>
                <option value="Elderly Care">Elderly Care</option>
                <option value="Medication Management">Medication Management</option>
                <option value="Wound Care">Wound Care</option>
                <option value="Physical Therapy">Physical Therapy</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={requestForm.address}
                onChange={(e) => setRequestForm({...requestForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requested Date *
              </label>
              <input
                type="date"
                required
                value={requestForm.requested_date}
                onChange={(e) => setRequestForm({...requestForm, requested_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requested Time *
              </label>
              <input
                type="time"
                required
                value={requestForm.requested_time}
                onChange={(e) => setRequestForm({...requestForm, requested_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={requestForm.duration_hours}
                onChange={(e) => setRequestForm({...requestForm, duration_hours: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={requestForm.priority}
                onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={requestForm.estimated_cost}
                onChange={(e) => setRequestForm({...requestForm, estimated_cost: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Services Required
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Medication Administration', 'Wound Care', 'Vital Signs Monitoring', 'Personal Care', 'Physical Therapy', 'Companionship'].map((service) => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={requestForm.services.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequestForm({...requestForm, services: [...requestForm.services, service]});
                        } else {
                          setRequestForm({...requestForm, services: requestForm.services.filter(s => s !== service)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Special Instructions
              </label>
              <textarea
                rows={3}
                value={requestForm.special_instructions}
                onChange={(e) => setRequestForm({...requestForm, special_instructions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 flex items-center"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading && activeCase === 'dashboard') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 text-green-700 dark:text-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {renderContent()}

      {/* Modals */}
      {showPatientModal && <PatientModal />}
      {showVitalsModal && <VitalsModal />}
      {showShiftModal && <ShiftModal />}
      {showRequestModal && <RequestModal />}
    </DashboardLayout>
  );
};

export default NurseDashboard;