import { useState, useEffect } from "react";

import {
  Clock,
  Users,
  Home,
  Activity,
  Calendar,
  FileText,
  User,
  Settings as SettingsIcon,
  Bell,
  MessageSquare,
  Save,
  Edit,
  Plus,
  Filter,
  Eye,
  Download,
  X,
  Building,
  CreditCard,
  UserCheck,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

const NurseDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedPatients: 0,
    homeRequests: 0,
    upcomingShifts: 0,
    pendingTasks: 0,
  });

  // Modal states
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Form data states
  const [reportData, setReportData] = useState({
    type: "patient_care",
    dateRange: "today",
    startDate: "",
    endDate: "",
    includeVitals: true,
    includeMedications: true,
    includeNotes: true,
    format: "pdf",
  });

  const [requestData, setRequestData] = useState({
    type: "supplies",
    priority: "medium",
    title: "",
    description: "",
    department: "",
    urgency: "normal",
  });

  const [reminderData, setReminderData] = useState({
    title: "",
    type: "medication",
    date: "",
    time: "",
    recurring: false,
    frequency: "daily",
    notes: "",
  });

  const [newPatientData, setNewPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    roomNumber: "",
    admissionDate: "",
    condition: "",
    status: "stable",
    allergies: "",
    emergencyContact: "",
    insuranceInfo: "",
    notes: "",
  });

  // Mock data
  const assignedPatients = [
    {
      id: 1,
      name: "John Doe",
      room: "101",
      status: "Stable",
      notes: "Post-op monitoring",
      age: 45,
      condition: "Recovery",
      lastVisit: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      room: "103",
      status: "Critical",
      notes: "Regular vitals check",
      age: 67,
      condition: "ICU",
      lastVisit: "30 mins ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      room: "105",
      status: "Stable",
      notes: "Medication administration",
      age: 34,
      condition: "Recovery",
      lastVisit: "1 hour ago",
    },
  ];

  const upcomingShifts = [
    {
      id: 1,
      date: "2025-05-16",
      startTime: "07:00 AM",
      endTime: "07:00 PM",
      department: "General",
      type: "Day Shift",
    },
    {
      id: 2,
      date: "2025-05-18",
      startTime: "07:00 PM",
      endTime: "07:00 AM",
      department: "ICU",
      type: "Night Shift",
    },
  ];

  const requests = [
    {
      id: 1,
      type: "Time Off",
      date: "2025-05-20",
      status: "Pending",
      reason: "Personal",
    },
    {
      id: 2,
      type: "Shift Swap",
      date: "2025-05-22",
      status: "Approved",
      reason: "Family emergency",
    },
  ];

  const reports = [
    {
      id: 1,
      title: "Patient Care Summary",
      date: "2025-05-15",
      type: "Daily Report",
    },
    {
      id: 2,
      title: "Medication Administration",
      date: "2025-05-14",
      type: "Weekly Report",
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        assignedPatients: 5,
        homeRequests: 2,
        upcomingShifts: 3,
        pendingTasks: 7,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handler functions
  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generating report:", reportData);
    alert("Report generated successfully! Download will start shortly.");
    setShowGenerateReportModal(false);
  };

  const handleNewRequest = (e) => {
    e.preventDefault();
    console.log("Submitting request:", requestData);
    alert("Request submitted successfully!");
    setShowNewRequestModal(false);
    setRequestData({
      type: "supplies",
      priority: "medium",
      title: "",
      description: "",
      department: "",
      urgency: "normal",
    });
  };

  const handleSetReminder = (e) => {
    e.preventDefault();
    console.log("Setting reminder:", reminderData);
    alert("Reminder set successfully!");
    setShowReminderModal(false);
    setReminderData({
      title: "",
      type: "medication",
      date: "",
      time: "",
      recurring: false,
      frequency: "daily",
      notes: "",
    });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    console.log("Adding patient:", newPatientData);
    alert("Patient added successfully!");
    setShowAddPatientModal(false);
    setNewPatientData({
      name: "",
      age: "",
      gender: "",
      roomNumber: "",
      admissionDate: "",
      condition: "",
      status: "stable",
      allergies: "",
      emergencyContact: "",
      insuranceInfo: "",
      notes: "",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow duration-200`}
    >
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
    </div>
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Nurse {user?.name || "Nurse"}!
        </h1>
        <p className="text-purple-100">
          Today is{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700"
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
            title="Assigned Patients"
            value={stats.assignedPatients}
            icon={Users}
            color="border-blue-500 dark:border-blue-400"
          />
          <StatCard
            title="Home Requests"
            value={stats.homeRequests}
            icon={Home}
            color="border-green-500 dark:border-green-400"
          />
          <StatCard
            title="Upcoming Shifts"
            value={stats.upcomingShifts}
            icon={Clock}
            color="border-purple-500 dark:border-purple-400"
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Activity}
            color="border-orange-500 dark:border-orange-400"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Assigned Patients
            </h2>
            <button
              onClick={() => setActiveCase("patients")}
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {assignedPatients.slice(0, 2).map((patient) => (
              <div
                key={patient.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Room {patient.room} • Age {patient.age}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${
                      patient.status === "Stable"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {patient.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Shifts
            </h2>
            <button
              onClick={() => setActiveCase("shifts")}
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {upcomingShifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(shift.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {shift.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Patients Management Component
  const PatientsSection = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    const [vitalsData, setVitalsData] = useState({
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      notes: "",
    });

    const handleVitalsSubmit = (e) => {
      e.preventDefault();
      console.log("Recording vitals for patient:", selectedPatient, vitalsData);
      alert("Vitals recorded successfully!");
      setShowVitalsModal(false);
      setVitalsData({
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        notes: "",
      });
    };

    const filteredPatients = assignedPatients.filter((patient) => {
      if (filterStatus === "all") return true;
      return patient.status.toLowerCase() === filterStatus;
    });

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Patient Management</h1>
          <p className="text-blue-100">
            Manage and monitor your assigned patients
          </p>
        </div>

        {/* Filter and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {assignedPatients.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Patients
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              {assignedPatients.filter((p) => p.status === "Stable").length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stable</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              {assignedPatients.filter((p) => p.status === "Critical").length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {
                assignedPatients.filter((p) => p.condition === "Recovery")
                  .length
              }
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recovery</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Patient List ({filteredPatients.length})
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="stable">Stable</option>
                <option value="critical">Critical</option>
              </select>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Room {patient.room} • Age {patient.age} •{" "}
                        {patient.condition}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Last visit: {patient.lastVisit}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {patient.notes}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                        patient.status === "Stable"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {patient.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowVitalsModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors"
                        title="Record Vitals"
                      >
                        <Activity className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors"
                        title="Update Notes"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Recording Modal */}
        {showVitalsModal && selectedPatient && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <form onSubmit={handleVitalsSubmit}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Record Vitals - {selectedPatient.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowVitalsModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Blood Pressure
                          </label>
                          <input
                            type="text"
                            value={vitalsData.bloodPressure}
                            onChange={(e) =>
                              setVitalsData({
                                ...vitalsData,
                                bloodPressure: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Heart Rate
                          </label>
                          <input
                            type="text"
                            value={vitalsData.heartRate}
                            onChange={(e) =>
                              setVitalsData({
                                ...vitalsData,
                                heartRate: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="72 bpm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Temperature
                          </label>
                          <input
                            type="text"
                            value={vitalsData.temperature}
                            onChange={(e) =>
                              setVitalsData({
                                ...vitalsData,
                                temperature: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="98.6°F"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Resp. Rate
                          </label>
                          <input
                            type="text"
                            value={vitalsData.respiratoryRate}
                            onChange={(e) =>
                              setVitalsData({
                                ...vitalsData,
                                respiratoryRate: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="16/min"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Oxygen Saturation
                        </label>
                        <input
                          type="text"
                          value={vitalsData.oxygenSaturation}
                          onChange={(e) =>
                            setVitalsData({
                              ...vitalsData,
                              oxygenSaturation: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="98%"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notes
                        </label>
                        <textarea
                          value={vitalsData.notes}
                          onChange={(e) =>
                            setVitalsData({
                              ...vitalsData,
                              notes: e.target.value,
                            })
                          }
                          rows="3"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Additional observations..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Record Vitals
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVitalsModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Shifts Management Component
  const ShiftsSection = () => {
    const [showTimeOffModal, setShowTimeOffModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [viewMode, setViewMode] = useState("upcoming");

    const [timeOffData, setTimeOffData] = useState({
      startDate: "",
      endDate: "",
      reason: "",
      type: "vacation",
    });

    const [swapData, setSwapData] = useState({
      currentShift: "",
      desiredShift: "",
      reason: "",
      colleague: "",
    });

    const pastShifts = [
      {
        id: 3,
        date: "2025-05-10",
        startTime: "07:00 AM",
        endTime: "07:00 PM",
        department: "General",
        type: "Day Shift",
        status: "completed",
      },
      {
        id: 4,
        date: "2025-05-08",
        startTime: "07:00 PM",
        endTime: "07:00 AM",
        department: "ICU",
        type: "Night Shift",
        status: "completed",
      },
    ];

    const handleTimeOffSubmit = (e) => {
      e.preventDefault();
      console.log("Time off request:", timeOffData);
      alert("Time off request submitted successfully!");
      setShowTimeOffModal(false);
      setTimeOffData({
        startDate: "",
        endDate: "",
        reason: "",
        type: "vacation",
      });
    };

    const handleSwapSubmit = (e) => {
      e.preventDefault();
      console.log("Shift swap request:", swapData);
      alert("Shift swap request submitted successfully!");
      setShowSwapModal(false);
      setSwapData({
        currentShift: "",
        desiredShift: "",
        reason: "",
        colleague: "",
      });
    };

    const getShiftTypeColor = (type) => {
      switch (type) {
        case "Day Shift":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "Night Shift":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "Evening Shift":
          return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      }
    };

    const currentShifts = viewMode === "upcoming" ? upcomingShifts : pastShifts;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Shift Management</h1>
          <p className="text-green-100">View and manage your work schedule</p>
        </div>

        {/* Shift Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {upcomingShifts.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upcoming Shifts
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              40
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hours This Week
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              15
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Days This Month
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
            <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              5
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overtime Hours
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shifts List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Shifts
              </h2>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("upcoming")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === "upcoming"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setViewMode("past")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === "past"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {currentShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {shift.type}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(shift.date).toLocaleDateString()} •{" "}
                          {shift.department}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getShiftTypeColor(
                          shift.type
                        )}`}
                      >
                        {shift.type}
                      </span>
                      {viewMode === "upcoming" && (
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                            <Edit className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowTimeOffModal(true)}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
              >
                <Clock className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Request Time Off
                </span>
              </button>
              <button
                onClick={() => setShowSwapModal(true)}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
              >
                <Users className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shift Swap
                </span>
              </button>
              <button
                onClick={() => setShowReminderModal(true)}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
              >
                <Bell className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Set Reminders
                </span>
              </button>
              <button
                onClick={() => setShowCalendarModal(true)}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
              >
                <Calendar className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  View Calendar
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Time Off Request Modal */}
        {showTimeOffModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <form onSubmit={handleTimeOffSubmit}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Request Time Off
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowTimeOffModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Type
                        </label>
                        <select
                          value={timeOffData.type}
                          onChange={(e) =>
                            setTimeOffData({
                              ...timeOffData,
                              type: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="vacation">Vacation</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={timeOffData.startDate}
                          onChange={(e) =>
                            setTimeOffData({
                              ...timeOffData,
                              startDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={timeOffData.endDate}
                          onChange={(e) =>
                            setTimeOffData({
                              ...timeOffData,
                              endDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reason
                        </label>
                        <textarea
                          value={timeOffData.reason}
                          onChange={(e) =>
                            setTimeOffData({
                              ...timeOffData,
                              reason: e.target.value,
                            })
                          }
                          rows="3"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Please provide a reason for your time off request..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTimeOffModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Shift Swap Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <form onSubmit={handleSwapSubmit}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Request Shift Swap
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowSwapModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Your Current Shift
                        </label>
                        <select
                          value={swapData.currentShift}
                          onChange={(e) =>
                            setSwapData({
                              ...swapData,
                              currentShift: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select your shift</option>
                          {upcomingShifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>
                              {shift.type} -{" "}
                              {new Date(shift.date).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Colleague
                        </label>
                        <select
                          value={swapData.colleague}
                          onChange={(e) =>
                            setSwapData({
                              ...swapData,
                              colleague: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select colleague</option>
                          <option value="nurse1">Nurse Johnson</option>
                          <option value="nurse2">Nurse Williams</option>
                          <option value="nurse3">Nurse Brown</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Desired Shift Date
                        </label>
                        <input
                          type="date"
                          value={swapData.desiredShift}
                          onChange={(e) =>
                            setSwapData({
                              ...swapData,
                              desiredShift: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reason for Swap
                        </label>
                        <textarea
                          value={swapData.reason}
                          onChange={(e) =>
                            setSwapData({ ...swapData, reason: e.target.value })
                          }
                          rows="3"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Please provide a reason for the shift swap..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSwapModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Requests Section Component
  const RequestsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Requests </h1>
        <p className="text-orange-100">Manage your requests and applications</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Requests ({requests.length})
          </h2>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {request.type}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date: {new Date(request.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reason: {request.reason}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    request.status === "Approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Reports Section Component
  const ReportsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Reports </h1>
        <p className="text-indigo-100">View and generate your reports</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Reports ({reports.length})
          </h2>
          <button
            onClick={() => setShowGenerateReportModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.type} • {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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

  // Profile Section Component
  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: user?.name || "Nurse Smith",
      email: user?.email || "nurse.smith@hospital.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-20",
      address: "456 Healthcare Ave, Medical City, MC 54321",
      emergencyContact: "John Smith - +1 (555) 987-6543",
      licenseNumber: "RN123456789",
      department: "General",
      yearsExperience: "8",
      specializations: "Critical Care, Emergency Medicine",
      certifications: "BLS, ACLS, PALS",
      education: "BSN - University of Medicine",
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
      console.log("Saving nurse profile:", profileData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Profile</h1>
              <p className="text-pink-100">
                Manage your professional information
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
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
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
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
                Registered Nurse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.department} Department
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

              {/* Professional Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="licenseNumber"
                        value={profileData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.licenseNumber}
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
                        <option value="General">General</option>
                        <option value="ICU">ICU</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Cardiology">Cardiology</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.department}
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
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specializations
                    </label>
                    {isEditing ? (
                      <textarea
                        name="specializations"
                        value={profileData.specializations}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List your specializations..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.specializations}
                      </p>
                    )}
                  </div>

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
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
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

  // Settings Section Component
  const SettingsSection = () => {
    const [notifications, setNotifications] = useState({
      emailNotifications: true,
      smsNotifications: false,
      shiftReminders: true,
      patientAlerts: true,
      emergencyNotifications: true,
      scheduleChanges: true,
      systemUpdates: false,
    });

    const [privacy, setPrivacy] = useState({
      shareDataWithDoctors: true,
      shareDataForResearch: false,
      allowDataExport: true,
    });

    const [preferences, setPreferences] = useState({
      language: "english",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12",
      theme: "auto",
    });

    const handleNotificationChange = (key, value) => {
      setNotifications((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handlePrivacyChange = (key, value) => {
      setPrivacy((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handlePreferenceChange = (key, value) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handleSaveSettings = () => {
      console.log("Saving settings:", { notifications, privacy, preferences });
      alert("Settings saved successfully!");
    };

    const handleExportData = () => {
      alert(
        "Your data export has been requested. You will receive an email with your data within 24 hours."
      );
    };

    const handleDeleteAccount = () => {
      if (
        window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        alert(
          "Account deletion request submitted. Please contact HR to complete the process."
        );
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-300">
            Configure your dashboard preferences and notifications
          </p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "emailNotifications" &&
                      "Receive notifications via email"}
                    {key === "smsNotifications" &&
                      "Receive urgent notifications via SMS"}
                    {key === "shiftReminders" &&
                      "Get reminders for upcoming shifts"}
                    {key === "patientAlerts" &&
                      "Get notified about patient status changes"}
                    {key === "emergencyNotifications" &&
                      "Receive emergency alerts"}
                    {key === "scheduleChanges" &&
                      "Get notified about schedule changes"}
                    {key === "systemUpdates" &&
                      "Receive system maintenance notifications"}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
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

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Privacy & Data Settings
          </h2>
          <div className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "shareDataWithDoctors" &&
                      "Allow healthcare providers to access your data"}
                    {key === "shareDataForResearch" &&
                      "Allow anonymized data to be used for medical research"}
                    {key === "allowDataExport" &&
                      "Allow you to export your personal data"}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
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
            General Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  handlePreferenceChange("language", e.target.value)
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
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) =>
                  handlePreferenceChange("timezone", e.target.value)
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
                value={preferences.dateFormat}
                onChange={(e) =>
                  handlePreferenceChange("dateFormat", e.target.value)
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
                value={preferences.timeFormat}
                onChange={(e) =>
                  handlePreferenceChange("timeFormat", e.target.value)
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
                value={preferences.theme}
                onChange={(e) =>
                  handlePreferenceChange("theme", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="auto">Auto (System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update your account password
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security
                </p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Export Your Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Download a copy of all your professional data
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
                  Delete Account
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Save All Settings
          </button>
        </div>
      </div>
    );
  };

  // Messages Section Component
  const MessagesSection = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [messageText, setMessageText] = useState("");

    const messages = [
      {
        id: 1,
        sender: "Dr. Anderson",
        senderRole: "Attending Physician",
        subject: "Patient Care Update",
        message:
          "Please monitor patient in room 305 for any changes in vital signs. Blood pressure has been slightly elevated. Continue with current medication regimen and report any concerns immediately.",
        timestamp: "2024-03-15 2:45 PM",
        read: false,
        type: "medical",
      },
      {
        id: 2,
        sender: "Charge Nurse",
        senderRole: "Nurse Manager",
        subject: "Schedule Change Notice",
        message:
          "Your shift for tomorrow has been changed from day to evening shift (3 PM - 11 PM). Please confirm that you received this message and can accommodate the change.",
        timestamp: "2024-03-15 11:30 AM",
        read: true,
        type: "administrative",
      },
      {
        id: 3,
        sender: "Dr. Smith",
        senderRole: "Cardiologist",
        subject: "Medication Orders",
        message:
          "New medication orders for patient John Doe (Room 302): Start Metoprolol 25mg twice daily. Please ensure patient is monitored for bradycardia and hypotension.",
        timestamp: "2024-03-14 4:20 PM",
        read: false,
        type: "medication",
      },
      {
        id: 4,
        sender: "HR Department",
        senderRole: "Human Resources",
        subject: "Annual Training Reminder",
        message:
          "This is a reminder that your annual CPR/BLS certification expires next month. Please schedule your renewal training through the employee portal.",
        timestamp: "2024-03-13 9:00 AM",
        read: true,
        type: "training",
      },
    ];

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (messageText.trim()) {
        console.log("Sending message:", messageText);
        setMessageText("");
        setShowCompose(false);
        alert("Message sent successfully!");
      }
    };

    const getMessageTypeColor = (type) => {
      switch (type) {
        case "medical":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "medication":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "administrative":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "training":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Messages</h1>
              <p className="text-purple-100">
                Communicate with doctors and hospital staff
              </p>
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              New Message
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Inbox
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full p-4 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedMessage?.id === message.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    } ${!message.read ? "bg-blue-25 dark:bg-blue-950" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p
                        className={`font-medium text-sm ${
                          !message.read
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {message.sender}
                      </p>
                      {!message.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm mb-1 ${
                        !message.read
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {message.timestamp}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getMessageTypeColor(
                        message.type
                      )}`}
                    >
                      {message.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              {selectedMessage ? (
                <div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedMessage.sender}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedMessage.senderRole}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedMessage.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Reply
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      Forward
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      Mark as Read
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a message
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a message from your inbox to read
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compose Message Modal */}
        {showCompose && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSendMessage}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Compose Message
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowCompose(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          To
                        </label>
                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>Dr. Anderson - Attending Physician</option>
                          <option>Dr. Smith - Cardiologist</option>
                          <option>Charge Nurse</option>
                          <option>HR Department</option>
                          <option>Pharmacy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter subject..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Message
                        </label>
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows="4"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Type your message here..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCompose(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  // Render different cases
  const renderActiveCase = () => {
    switch (activeCase) {
      case "dashboard":
        return <DashboardOverview />;
      case "patients":
        return <PatientsSection />;
      case "shifts":
        return <ShiftsSection />;
      case "requests":
        return <RequestsSection />;
      case "reports":
        return <ReportsSection />;
      case "messages":
        return <MessagesSection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div>
      <DashboardLayout
        role="nurse"
        activeCase={activeCase}
        onNavigate={setActiveCase}
      >
        <div className="space-y-6">{renderActiveCase()}</div>
      </DashboardLayout>

      {/* All Modals at Component Level */}

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleGenerateReport}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Generate Report
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowGenerateReportModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Report Type
                      </label>
                      <select
                        value={reportData.type}
                        onChange={(e) => setReportData({...reportData, type: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="patient_care">Patient Care Summary</option>
                        <option value="medication">Medication Administration</option>
                        <option value="vitals">Vitals Overview</option>
                        <option value="shift_summary">Shift Summary</option>
                        <option value="incident">Incident Reports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date Range
                      </label>
                      <select
                        value={reportData.dateRange}
                        onChange={(e) => setReportData({...reportData, dateRange: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {reportData.dateRange === 'custom' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={reportData.startDate}
                            onChange={(e) => setReportData({...reportData, startDate: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={reportData.endDate}
                            onChange={(e) => setReportData({...reportData, endDate: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Format
                      </label>
                      <select
                        value={reportData.format}
                        onChange={(e) => setReportData({...reportData, format: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Generate Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGenerateReportModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleNewRequest}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Submit New Request
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewRequestModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Request Type
                      </label>
                      <select
                        value={requestData.type}
                        onChange={(e) => setRequestData({...requestData, type: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="supplies">Medical Supplies</option>
                        <option value="equipment">Equipment Request</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="staffing">Staffing Support</option>
                        <option value="training">Training Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Priority Level
                      </label>
                      <select
                        value={requestData.priority}
                        onChange={(e) => setRequestData({...requestData, priority: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        value={requestData.title}
                        onChange={(e) => setRequestData({...requestData, title: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief title for your request"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={requestData.description}
                        onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Detailed description of your request..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Set Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSetReminder}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Set Reminder
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowReminderModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reminder Title
                      </label>
                      <input
                        type="text"
                        value={reminderData.title}
                        onChange={(e) => setReminderData({...reminderData, title: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter reminder title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reminder Type
                      </label>
                      <select
                        value={reminderData.type}
                        onChange={(e) => setReminderData({...reminderData, type: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="medication">Medication</option>
                        <option value="appointment">Appointment</option>
                        <option value="rounds">Rounds</option>
                        <option value="vitals">Vitals Check</option>
                        <option value="break">Break</option>
                        <option value="handoff">Shift Handoff</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          value={reminderData.date}
                          onChange={(e) => setReminderData({...reminderData, date: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time
                        </label>
                        <input
                          type="time"
                          value={reminderData.time}
                          onChange={(e) => setReminderData({...reminderData, time: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={reminderData.recurring}
                          onChange={(e) => setReminderData({...reminderData, recurring: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recurring reminder</span>
                      </label>
                    </div>

                    {reminderData.recurring && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Frequency
                        </label>
                        <select
                          value={reminderData.frequency}
                          onChange={(e) => setReminderData({...reminderData, frequency: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </label>
                      <textarea
                        value={reminderData.notes}
                        onChange={(e) => setReminderData({...reminderData, notes: e.target.value})}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Additional notes for this reminder..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Set Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReminderModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Calendar View
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCalendarModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        December 2024
                      </h4>
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
                        Today
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md">
                        Week
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md">
                        Month
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 4; // Offset for December 1st starting on Sunday
                      const isCurrentMonth = day > 0 && day <= 31;
                      const isToday = day === 15; // Mock today as 15th
                      const hasEvent = [3, 7, 12, 18, 22, 28].includes(day);

                      return (
                        <div
                          key={i}
                          className={`min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 ${
                            isCurrentMonth
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-900"
                          } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                        >
                          {isCurrentMonth && (
                            <>
                              <div
                                className={`text-sm ${
                                  isToday
                                    ? "text-blue-600 font-bold"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {day}
                              </div>
                              {hasEvent && (
                                <div className="mt-1">
                                  <div className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1 rounded">
                                    Shift
                                  </div>
                                  {day === 12 && (
                                    <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1 rounded mt-1">
                                      Training
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Upcoming Events */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Upcoming Events
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Night Shift - ICU
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Dec 16, 10:00 PM - 6:00 AM
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            CPR Certification Renewal
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Dec 18, 2:00 PM - 4:00 PM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowCalendarModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Patient Modal */}
        {showAddPatientModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <form onSubmit={handleAddPatient}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Add New Patient
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddPatientModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newPatientData.name}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter patient's full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Age
                        </label>
                        <input
                          type="number"
                          value={newPatientData.age}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              age: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Age"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gender
                        </label>
                        <select
                          value={newPatientData.gender}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              gender: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Room Number
                        </label>
                        <input
                          type="text"
                          value={newPatientData.roomNumber}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              roomNumber: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Room number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Admission Date
                        </label>
                        <input
                          type="date"
                          value={newPatientData.admissionDate}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              admissionDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <select
                          value={newPatientData.status}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              status: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="stable">Stable</option>
                          <option value="critical">Critical</option>
                          <option value="improving">Improving</option>
                          <option value="monitoring">Under Monitoring</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Medical Condition
                        </label>
                        <input
                          type="text"
                          value={newPatientData.condition}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              condition: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Primary diagnosis or condition"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Known Allergies
                        </label>
                        <input
                          type="text"
                          value={newPatientData.allergies}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              allergies: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="List any known allergies"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          value={newPatientData.emergencyContact}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              emergencyContact: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Emergency contact number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Insurance Information
                        </label>
                        <input
                          type="text"
                          value={newPatientData.insuranceInfo}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              insuranceInfo: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Insurance provider and policy number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Additional Notes
                        </label>
                        <textarea
                          value={newPatientData.notes}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              notes: e.target.value,
                            })
                          }
                          rows="3"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Any additional notes about the patient..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPatientModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    switch (activeCase) {
      case "dashboard":
        return <DashboardOverview />;
      case "patients":
        return <PatientsSection />;
      case "shifts":
        return <ShiftsSection />;
      case "requests":
        return <RequestsSection />;
      case "reports":
        return <ReportsSection />;
      case "messages":
        return <MessagesSection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
 

  return (
    <div>
      <DashboardLayout
        role="nurse"
        activeCase={activeCase}
        onNavigate={setActiveCase}
      >
        <div className="space-y-6">{renderActiveCase()}</div>
      </DashboardLayout>

    

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleGenerateReport}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Generate Report
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowGenerateReportModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Report Type
                      </label>
                      <select
                        value={reportData.type}
                        onChange={(e) =>
                          setReportData({ ...reportData, type: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="patient_care">
                          Patient Care Summary
                        </option>
                        <option value="medication">
                          Medication Administration
                        </option>
                        <option value="vitals">Vitals Overview</option>
                        <option value="shift_summary">Shift Summary</option>
                        <option value="incident">Incident Reports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {reportData.dateRange === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={reportData.endDate}
                            onChange={(e) =>
                              setReportData({
                                ...reportData,
                                endDate: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Format
                      </label>
                      <select
                        value={reportData.format}
                        onChange={(e) =>
                          setReportData({
                            ...reportData,
                            format: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Generate Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGenerateReportModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleNewRequest}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Submit New Request
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewRequestModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Request Type
                      </label>
                      <select
                        value={requestData.type}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            type: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="supplies">Medical Supplies</option>
                        <option value="equipment">Equipment Request</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="staffing">Staffing Support</option>
                        <option value="training">Training Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Priority Level
                      </label>
                      <select
                        value={requestData.priority}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            priority: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        value={requestData.title}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief title for your request"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={requestData.description}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            description: e.target.value,
                          })
                        }
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Detailed description of your request..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Set Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSetReminder}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Set Reminder
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowReminderModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reminder Title
                      </label>
                      <input
                        type="text"
                        value={reminderData.title}
                        onChange={(e) =>
                          setReminderData({
                            ...reminderData,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter reminder title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reminder Type
                      </label>
                      <select
                        value={reminderData.type}
                        onChange={(e) =>
                          setReminderData({
                            ...reminderData,
                            type: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="medication">Medication</option>
                        <option value="appointment">Appointment</option>
                        <option value="rounds">Rounds</option>
                        <option value="vitals">Vitals Check</option>
                        <option value="break">Break</option>
                        <option value="handoff">Shift Handoff</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          value={reminderData.date}
                          onChange={(e) =>
                            setReminderData({
                              ...reminderData,
                              date: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time
                        </label>
                        <input
                          type="time"
                          value={reminderData.time}
                          onChange={(e) =>
                            setReminderData({
                              ...reminderData,
                              time: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={reminderData.recurring}
                          onChange={(e) =>
                            setReminderData({
                              ...reminderData,
                              recurring: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-purple-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Recurring reminder
                        </span>
                      </label>
                    </div>

                    {reminderData.recurring && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Frequency
                        </label>
                        <select
                          value={reminderData.frequency}
                          onChange={(e) =>
                            setReminderData({
                              ...reminderData,
                              frequency: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </label>
                      <textarea
                        value={reminderData.notes}
                        onChange={(e) =>
                          setReminderData({
                            ...reminderData,
                            notes: e.target.value,
                          })
                        }
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Additional notes for this reminder..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Set Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReminderModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Calendar View
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCalendarModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      December 2024
                    </h4>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
                      Today
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md">
                      Week
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md">
                      Month
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 4;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isToday = day === 15;
                    const hasEvent = [3, 7, 12, 18, 22, 28].includes(day);

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 ${
                          isCurrentMonth
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                      >
                        {isCurrentMonth && (
                          <>
                            <div
                              className={`text-sm ${
                                isToday
                                  ? "text-blue-600 font-bold"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {day}
                            </div>
                            {hasEvent && (
                              <div className="mt-1">
                                <div className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1 rounded">
                                  Shift
                                </div>
                                {day === 12 && (
                                  <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1 rounded mt-1">
                                    Training
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Upcoming Events
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Night Shift - ICU
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Dec 16, 10:00 PM - 6:00 AM
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          CPR Certification Renewal
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Dec 18, 2:00 PM - 4:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleAddPatient}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Add New Patient
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddPatientModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={newPatientData.name}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter patient's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Age
                      </label>
                      <input
                        type="number"
                        value={newPatientData.age}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            age: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Age"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </label>
                      <select
                        value={newPatientData.gender}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            gender: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Room Number
                      </label>
                      <input
                        type="text"
                        value={newPatientData.roomNumber}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            roomNumber: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Room number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Admission Date
                      </label>
                      <input
                        type="date"
                        value={newPatientData.admissionDate}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            admissionDate: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Medical Condition
                      </label>
                      <input
                        type="text"
                        value={newPatientData.condition}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            condition: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Primary diagnosis or condition"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPatientModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
);

};

export default NurseDashboard;