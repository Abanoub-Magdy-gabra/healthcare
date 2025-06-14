import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { dbService } from '../../lib/supabase.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Activity,
  User,
  Settings,
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Save,
  X,
  Stethoscope,
  Heart,
  Pill,
  ClipboardList,
  UserPlus,
  CalendarPlus,
  FileTextIcon,
  Download,
  Upload,
  Star,
  MapPin,
  MessageSquare
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user?.id) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [
        appointmentsData,
        medicalRecordsData,
        statsData
      ] = await Promise.all([
        dbService.getAppointments(user.id, 'doctor'),
        dbService.getMedicalRecords(user.id),
        dbService.getDashboardStats(user.id, 'doctor')
      ]);

      setAppointments(appointmentsData || []);
      setMedicalRecords(medicalRecordsData || []);
      setStats(statsData || {});

      // Get unique patients from appointments
      const uniquePatients = appointmentsData?.reduce((acc, appointment) => {
        if (appointment.patient && !acc.find(p => p.id === appointment.patient_id)) {
          acc.push({
            id: appointment.patient_id,
            ...appointment.patient,
            lastVisit: appointment.appointment_date,
            condition: appointment.diagnosis || 'General consultation',
            status: 'active'
          });
        }
        return acc;
      }, []) || [];

      setPatients(uniquePatients);

      // Mock schedule data
      setSchedule([
        {
          id: 1,
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Main Clinic',
          isActive: true
        },
        {
          id: 2,
          day: 'Tuesday',
          startTime: '10:00',
          endTime: '16:00',
          location: 'Cardiology Wing',
          isActive: true
        },
        {
          id: 3,
          day: 'Wednesday',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Main Clinic',
          isActive: true
        }
      ]);

      // Mock reports data
      setReports([
        {
          id: 1,
          title: 'Monthly Patient Summary',
          type: 'patient_summary',
          period: 'December 2024',
          status: 'completed',
          generatedDate: '2024-01-01',
          patientCount: 45,
          appointmentCount: 78
        },
        {
          id: 2,
          title: 'Treatment Outcomes Report',
          type: 'outcomes',
          period: 'Q4 2024',
          status: 'pending',
          generatedDate: null,
          successRate: 92
        }
      ]);

    } catch (error) {
      console.error('Error loading doctor data:', error);
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

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
    
    // Initialize form data based on modal type
    if (type === 'appointment') {
      setFormData(item ? {
        patient_id: item.patient_id || '',
        appointment_date: item.appointment_date || '',
        appointment_time: item.appointment_time || '',
        duration_minutes: item.duration_minutes || 30,
        appointment_type: item.appointment_type || '',
        notes: item.notes || '',
        diagnosis: item.diagnosis || '',
        prescription: item.prescription || '',
        follow_up_date: item.follow_up_date || ''
      } : {
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        duration_minutes: 30,
        appointment_type: '',
        notes: '',
        diagnosis: '',
        prescription: '',
        follow_up_date: ''
      });
    } else if (type === 'patient') {
      setFormData(item ? {
        full_name: item.full_name || '',
        email: item.email || '',
        phone: item.phone || '',
        date_of_birth: item.date_of_birth || '',
        address: item.address || '',
        emergency_contact: item.emergency_contact || '',
        emergency_phone: item.emergency_phone || '',
        medical_conditions: item.medical_conditions || '',
        medications: item.medications || '',
        allergies: item.allergies || ''
      } : {
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        emergency_contact: '',
        emergency_phone: '',
        medical_conditions: '',
        medications: '',
        allergies: ''
      });
    } else if (type === 'medical_record') {
      setFormData(item ? {
        patient_id: item.patient_id || '',
        record_type: item.record_type || '',
        title: item.title || '',
        description: item.description || '',
        test_results: item.test_results ? JSON.stringify(item.test_results, null, 2) : '',
        record_date: item.record_date || '',
        is_critical: item.is_critical || false,
        attachments: item.attachments?.join(', ') || ''
      } : {
        patient_id: '',
        record_type: '',
        title: '',
        description: '',
        test_results: '',
        record_date: '',
        is_critical: false,
        attachments: ''
      });
    } else if (type === 'schedule') {
      setFormData(item ? {
        day: item.day || '',
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        location: item.location || '',
        isActive: item.isActive || true
      } : {
        day: '',
        startTime: '',
        endTime: '',
        location: '',
        isActive: true
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalType === 'appointment') {
        const appointmentData = {
          ...formData,
          doctor_id: user.id,
          status: selectedItem ? selectedItem.status : 'pending'
        };

        if (selectedItem) {
          await dbService.updateAppointment(selectedItem.id, appointmentData);
        } else {
          await dbService.createAppointment(appointmentData);
        }
        
        await loadDoctorData();
        alert(selectedItem ? 'Appointment updated successfully!' : 'Appointment created successfully!');
      } else if (modalType === 'medical_record') {
        const recordData = {
          ...formData,
          doctor_id: user.id,
          test_results: formData.test_results ? JSON.parse(formData.test_results) : null,
          attachments: formData.attachments ? formData.attachments.split(',').map(s => s.trim()) : []
        };

        if (selectedItem) {
          // Update existing record (if API supports it)
          alert('Medical record updated successfully!');
        } else {
          await dbService.createMedicalRecord(recordData);
          await loadDoctorData();
          alert('Medical record created successfully!');
        }
      } else if (modalType === 'patient') {
        // For now, we'll show success message
        // In a real app, you'd create/update patient profiles
        alert(selectedItem ? 'Patient updated successfully!' : 'Patient added successfully!');
      } else if (modalType === 'schedule') {
        // For now, we'll update local state
        if (selectedItem) {
          setSchedule(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setSchedule(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        alert(selectedItem ? 'Schedule updated successfully!' : 'Schedule added successfully!');
      }

      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      await dbService.updateAppointment(appointmentId, { status: newStatus });
      await loadDoctorData();
      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      setLoading(true);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: Date.now(),
        title: `${reportType} Report`,
        type: reportType,
        period: new Date().toLocaleDateString(),
        status: 'completed',
        generatedDate: new Date().toISOString(),
        patientCount: patients.length,
        appointmentCount: appointments.length
      };
      
      setReports(prev => [newReport, ...prev]);
      alert(`${reportType} report generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.appointment_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPatients = patients.filter(patient => 
    patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedicalRecords = medicalRecords.filter(record => 
    record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.record_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Good morning, Dr. {user?.full_name?.split(' ')[1] || user?.full_name}!</h1>
        <p className="text-green-100">You have {stats.todayAppointments || 0} appointments today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayAppointments || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniquePatients || 0}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAppointments || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Today's Schedule & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
            <button
              onClick={() => openModal('appointment')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {appointments
              .filter(appointment => 
                new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
              )
              .slice(0, 4)
              .map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{appointment.patient?.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(appointment.appointment_time)} - {appointment.appointment_type} ({appointment.duration_minutes}min)
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
            {appointments.filter(a => 
              new Date(a.appointment_date).toDateString() === new Date().toDateString()
            ).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No appointments scheduled for today
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Patients</h3>
            <button
              onClick={() => openModal('patient')}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {patients.slice(0, 4).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{patient.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last visit: {formatDate(patient.lastVisit)} - {patient.condition}
                  </p>
                </div>
                <button 
                  onClick={() => openModal('patient', patient)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
            {patients.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No patients yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => openModal('appointment')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {appointment.patient?.full_name}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {appointment.appointment_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(appointment.appointment_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(appointment.appointment_time)} ({appointment.duration_minutes}min)
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Notes: {appointment.notes}
                      </p>
                    )}
                    {appointment.diagnosis && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Diagnosis: {appointment.diagnosis}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : appointment.status === 'completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Confirm
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Complete
                      </button>
                    )}
                    <button 
                      onClick={() => openModal('appointment', appointment)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
              </div>
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
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => openModal('patient')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.full_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {patient.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Last visit: {formatDate(patient.lastVisit)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Condition: {patient.condition}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal('medical_record', { patient_id: patient.id })}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs flex items-center"
                    >
                      <FileTextIcon className="h-3 w-3 mr-1" />
                      Add Record
                    </button>
                    <button 
                      onClick={() => openModal('patient', patient)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => openModal('patient', patient)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No patients found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => openModal('medical_record')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            New Record
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {filteredMedicalRecords.map((record) => (
              <div key={record.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.title}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {record.record_type}
                      </span>
                      {record.is_critical && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(record.record_date)}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Patient ID: {record.patient_id?.slice(0, 8)}...
                      </div>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {record.description}
                      </p>
                    )}
                    {record.test_results && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                        <strong>Test Results:</strong> {JSON.stringify(record.test_results)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openModal('medical_record', record)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredMedicalRecords.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No medical records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Schedule</h2>
        <button
          onClick={() => openModal('schedule')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {schedule.map((item) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.day}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.startTime} - {item.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openModal('schedule', item)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {schedule.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No schedule set</p>
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
        <div className="flex space-x-3">
          <button
            onClick={() => generateReport('Patient Summary')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Patient Report
          </button>
          <button
            onClick={() => generateReport('Treatment Outcomes')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            Outcomes Report
          </button>
        </div>
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
                        report.type === 'patient_summary' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {report.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Period: {report.period}</span>
                      {report.generatedDate && <span>Generated: {formatDate(report.generatedDate)}</span>}
                    </div>
                    {report.patientCount && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Patients: {report.patientCount} | Appointments: {report.appointmentCount}
                      </p>
                    )}
                    {report.successRate && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        Success Rate: {report.successRate}%
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'completed' && (
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'D'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dr. {user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Medical Doctor</p>
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
              Specialty
            </label>
            <input
              type="text"
              value={user?.specialization || ''}
              placeholder="Add specialty"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <span className="text-gray-700 dark:text-gray-300">Appointment Notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Patient Messages</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Schedule Changes</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Accept new patients</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Emergency consultations</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {modalType === 'appointment' && (selectedItem ? 'Edit Appointment' : 'New Appointment')}
              {modalType === 'patient' && (selectedItem ? 'Edit Patient' : 'Add Patient')}
              {modalType === 'medical_record' && (selectedItem ? 'View Medical Record' : 'New Medical Record')}
              {modalType === 'schedule' && (selectedItem ? 'Edit Schedule' : 'Add Schedule')}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modalType === 'appointment' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      value={formData.patient_id || ''}
                      onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      value={formData.appointment_type || ''}
                      onChange={(e) => setFormData({...formData, appointment_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Routine Checkup">Routine Checkup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.appointment_date || ''}
                      onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.appointment_time || ''}
                      onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration_minutes || 30}
                      onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={formData.follow_up_date || ''}
                      onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diagnosis
                  </label>
                  <textarea
                    value={formData.diagnosis || ''}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prescription
                  </label>
                  <textarea
                    value={formData.prescription || ''}
                    onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {modalType === 'patient' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact || ''}
                      onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_phone || ''}
                      onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medical_conditions || ''}
                    onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                    rows={2}
                    placeholder="Comma-separated list of conditions"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.medications || ''}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    rows={2}
                    placeholder="Comma-separated list of medications"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allergies
                  </label>
                  <textarea
                    value={formData.allergies || ''}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    rows={2}
                    placeholder="Comma-separated list of allergies"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {modalType === 'medical_record' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      value={formData.patient_id || ''}
                      onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Record Type *
                    </label>
                    <select
                      value={formData.record_type || ''}
                      onChange={(e) => setFormData({...formData, record_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Lab Results">Lab Results</option>
                      <option value="Imaging">Imaging</option>
                      <option value="Physical Exam">Physical Exam</option>
                      <option value="Surgery Report">Surgery Report</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Record Date *
                    </label>
                    <input
                      type="date"
                      value={formData.record_date || ''}
                      onChange={(e) => setFormData({...formData, record_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_critical"
                      checked={formData.is_critical || false}
                      onChange={(e) => setFormData({...formData, is_critical: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="is_critical" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Critical Record
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Results (JSON format)
                  </label>
                  <textarea
                    value={formData.test_results || ''}
                    onChange={(e) => setFormData({...formData, test_results: e.target.value})}
                    rows={4}
                    placeholder='{"blood_pressure": "120/80", "heart_rate": "72"}'
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments (comma-separated URLs)
                  </label>
                  <input
                    type="text"
                    value={formData.attachments || ''}
                    onChange={(e) => setFormData({...formData, attachments: e.target.value})}
                    placeholder="file1.pdf, file2.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {modalType === 'schedule' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Day *
                    </label>
                    <select
                      value={formData.day || ''}
                      onChange={(e) => setFormData({...formData, day: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime || ''}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime || ''}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Schedule
                  </label>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {selectedItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
      case 'appointments':
        return renderAppointments();
      case 'patients':
        return renderPatients();
      case 'medical-records':
        return renderMedicalRecords();
      case 'schedule':
        return renderSchedule();
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
    <>
      <DashboardLayout
        role="doctor"
        activeCase={activeCase}
        onNavigate={handleNavigation}
      >
        {renderContent()}
      </DashboardLayout>
      {renderModal()}
    </>
  );
};

export default DoctorDashboard;