import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  Activity,
  FileText,
  User,
  Settings as SettingsIcon,
  Save,
  Edit,
  Plus,
  Eye,
  Download,
  X,
  Building,
  CreditCard,
  UserCheck,
  Phone,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageSquare,
  Filter,
  Stethoscope,
  Pill,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeCase, setActiveCase] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingReports: 0,
    scheduledSurgeries: 0,
  });

  // Modal states
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);

  // Form data states
  const [reportData, setReportData] = useState({
    type: "patient_summary",
    dateRange: "today",
    startDate: "",
    endDate: "",
    includeDiagnosis: true,
    includeTreatment: true,
    includeNotes: true,
    format: "pdf",
  });

  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    type: "consultation",
    date: "",
    time: "",
    duration: "30",
    notes: "",
    priority: "normal",
  });

  const [prescriptionData, setPrescriptionData] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: "0",
  });

  const [surgeryData, setSurgeryData] = useState({
    patientName: "",
    procedure: "",
    date: "",
    time: "",
    duration: "",
    team: "",
    notes: "",
    priority: "routine",
  });

  const [newPatientData, setNewPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    insuranceInfo: "",
  });

  const [diagnosisData, setDiagnosisData] = useState({
    patientId: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    followUp: "",
    notes: "",
    severity: "mild",
  });

  // Check for profile section navigation from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section) {
      setActiveCase(section);
    }
  }, [location]);

  // Handler functions
  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generating report:", reportData);
    alert("Report generated successfully! Download will start shortly.");
    setShowGenerateReportModal(false);
  };

  const handleNewAppointment = (e) => {
    e.preventDefault();
    console.log("Creating appointment:", appointmentData);
    alert("Appointment scheduled successfully!");
    setShowNewAppointmentModal(false);
    setAppointmentData({
      patientName: "",
      type: "consultation",
      date: "",
      time: "",
      duration: "30",
      notes: "",
      priority: "normal",
    });
  };

  const handlePrescription = (e) => {
    e.preventDefault();
    console.log("Creating prescription:", prescriptionData);
    alert("Prescription created successfully!");
    setShowPrescriptionModal(false);
    setPrescriptionData({
      patientId: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      refills: "0",
    });
  };

  const handleSurgery = (e) => {
    e.preventDefault();
    console.log("Scheduling surgery:", surgeryData);
    alert("Surgery scheduled successfully!");
    setShowSurgeryModal(false);
    setSurgeryData({
      patientName: "",
      procedure: "",
      date: "",
      time: "",
      duration: "",
      team: "",
      notes: "",
      priority: "routine",
    });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    console.log("Adding patient:", newPatientData);
    alert("Patient added successfully!");
    setShowPatientModal(false);
    setNewPatientData({
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
      insuranceInfo: "",
    });
  };

  const handleDiagnosis = (e) => {
    e.preventDefault();
    console.log("Recording diagnosis:", diagnosisData);
    alert("Diagnosis recorded successfully!");
    setShowDiagnosisModal(false);
    setDiagnosisData({
      patientId: "",
      symptoms: "",
      diagnosis: "",
      treatment: "",
      followUp: "",
      notes: "",
      severity: "mild",
    });
  };

  // Mock data
  const upcomingAppointments = [
    {
      id: 1,
      patientName: "John Doe",
      type: "Check-up",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      type: "Follow-up",
      time: "11:30 AM",
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      type: "Consultation",
      time: "2:00 PM",
      status: "pending",
    },
  ];

  const patients = [
    {
      id: 1,
      name: "John Doe",
      lastVisit: "2025-05-15",
      condition: "Hypertension",
      age: 45,
      phone: "(555) 123-4567",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastVisit: "2025-05-14",
      condition: "Diabetes",
      age: 62,
      phone: "(555) 234-5678",
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastVisit: "2025-05-12",
      condition: "Asthma",
      age: 34,
      phone: "(555) 345-6789",
    },
  ];

  const scheduleItems = [
    {
      id: 1,
      title: "Surgery - Heart Bypass",
      time: "08:00 AM - 12:00 PM",
      date: "2025-05-16",
      type: "Surgery",
    },
    {
      id: 2,
      title: "Consultation Hours",
      time: "02:00 PM - 05:00 PM",
      date: "2025-05-16",
      type: "Consultation",
    },
  ];

  const reports = [
    {
      id: 1,
      title: "Monthly Patient Summary",
      date: "2025-05-15",
      type: "Monthly Report",
      status: "Completed",
    },
    {
      id: 2,
      title: "Surgery Outcomes Report",
      date: "2025-05-14",
      type: "Surgery Report",
      status: "Pending",
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        todayAppointments: 8,
        totalPatients: 124,
        pendingReports: 3,
        scheduledSurgeries: 2,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, Dr. {user?.name || "Doctor"}!
            </h1>
            <p className="text-green-100">
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
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              New Appointment
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
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
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-gray-200 dark:border-gray-700"
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
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            color="border-blue-500 dark:border-blue-400"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            color="border-green-500 dark:border-green-400"
          />
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={Activity}
            color="border-purple-500 dark:border-purple-400"
          />
          <StatCard
            title="Scheduled Surgeries"
            value={stats.scheduledSurgeries}
            icon={Clock}
            color="border-orange-500 dark:border-orange-400"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Today's Schedule
            </h2>
            <button
              onClick={() => setActiveCase("appointments")}
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {upcomingAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Patients
            </h2>
            <button
              onClick={() => setActiveCase("patients")}
              className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {patients.slice(0, 3).map((patient) => (
              <div
                key={patient.id}
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                  {patient.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(patient.lastVisit).toLocaleDateString()} •{" "}
                    {patient.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Appointments Section
  const AppointmentsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Appointments Management</h1>
            <p className="text-blue-100">
              Manage your patient appointments and schedule
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </button>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Pill className="h-4 w-4 mr-2" />
              Prescription
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Appointments ({upcomingAppointments.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDiagnosisModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Record Diagnosis
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.type} • {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {appointment.status}
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

  // Patients Section
  const PatientsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Patient Management</h1>
            <p className="text-purple-100">
              View and manage your patient records
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPatientModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </button>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Patients ({patients.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDiagnosisModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Heart className="h-4 w-4 mr-2" />
              Record Vitals
            </button>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Pill className="h-4 w-4 mr-2" />
              Prescribe
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Age {patient.age} • {patient.condition}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Last visit:{" "}
                      {new Date(patient.lastVisit).toLocaleDateString()} •{" "}
                      {patient.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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

  // Schedule Section
  const ScheduleSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Schedule Management</h1>
            <p className="text-orange-100">
              Manage your daily and weekly schedule
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSurgeryModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Activity className="h-4 w-4 mr-2" />
              Schedule Surgery
            </button>
            <button
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Today's Schedule ({scheduleItems.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              New Appointment
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString()} • {item.time}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Reports Section
  const ReportsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reports</h1>
            <p className="text-indigo-100">Generate and view medical reports</p>
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
              onClick={() => setShowDiagnosisModal(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              New Diagnosis
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Reports ({reports.length})
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
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      report.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
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

  // Profile Section
  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: user?.name || "Dr. Smith",
      email: user?.email || "dr.smith@hospital.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1980-05-15",
      address: "123 Medical Center Dr, Healthcare City, HC 12345",
      emergencyContact: "Jane Smith - +1 (555) 987-6543",
      licenseNumber: "MD123456789",
      specialty: "Cardiology",
      yearsExperience: "15",
      education: "MD - Harvard Medical School",
      boardCertifications:
        "American Board of Internal Medicine, American Board of Cardiovascular Disease",
      hospitalAffiliations: "General Hospital, Heart Institute",
      researchInterests: "Interventional Cardiology, Heart Failure",
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
      console.log("Saving doctor profile:", profileData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Profile</h1>
              <p className="text-green-100">
                Manage your professional information
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
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
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
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
                Medical Doctor
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.specialty} Specialist
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
                      Medical License
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
                      Specialty
                    </label>
                    {isEditing ? (
                      <select
                        name="specialty"
                        value={profileData.specialty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Internal Medicine">
                          Internal Medicine
                        </option>
                        <option value="Emergency Medicine">
                          Emergency Medicine
                        </option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Oncology">Oncology</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.specialty}
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
                      Board Certifications
                    </label>
                    {isEditing ? (
                      <textarea
                        name="boardCertifications"
                        value={profileData.boardCertifications}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List your board certifications..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.boardCertifications}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hospital Affiliations
                    </label>
                    {isEditing ? (
                      <textarea
                        name="hospitalAffiliations"
                        value={profileData.hospitalAffiliations}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List your hospital affiliations..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.hospitalAffiliations}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Research Interests
                  </label>
                  {isEditing ? (
                    <textarea
                      name="researchInterests"
                      value={profileData.researchInterests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe your research interests..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {profileData.researchInterests}
                    </p>
                  )}
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
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

  // Settings Section
  const SettingsSection = () => {
    const [notifications, setNotifications] = useState({
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      patientAlerts: true,
      emergencyNotifications: true,
      surgeryReminders: true,
      systemUpdates: false,
      labResults: true,
    });

    const [privacy, setPrivacy] = useState({
      shareDataWithColleagues: true,
      shareDataForResearch: false,
      allowDataExport: true,
      allowPatientPortalAccess: true,
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
          "Account deletion request submitted. Please contact administration to complete the process."
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
                    {key === "appointmentReminders" &&
                      "Get reminders for upcoming appointments"}
                    {key === "patientAlerts" &&
                      "Get notified about patient status changes"}
                    {key === "emergencyNotifications" &&
                      "Receive emergency alerts"}
                    {key === "surgeryReminders" &&
                      "Get notified about scheduled surgeries"}
                    {key === "systemUpdates" &&
                      "Receive system maintenance notifications"}
                    {key === "labResults" &&
                      "Get notified when lab results are available"}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    value ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
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
                    {key === "shareDataWithColleagues" &&
                      "Allow other healthcare providers to access relevant patient data"}
                    {key === "shareDataForResearch" &&
                      "Allow anonymized data to be used for medical research"}
                    {key === "allowDataExport" &&
                      "Allow you to export your professional data"}
                    {key === "allowPatientPortalAccess" &&
                      "Allow patients to view their care information through portal"}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    value ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
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
                  Update your account password for security
                </p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to protect patient data
                </p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Session Management
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View and manage active sessions
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Manage
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
                  Download a copy of all your professional data and patient
                  records
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Export Data
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Backup Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configure automatic backup of your preferences and data
                </p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <h3 className="text-sm font-medium text-red-900 dark:text-red-200">
                  Delete Account
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Permanently delete your account and all associated data
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
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </button>
        </div>
      </div>
    );
  };

  // Modal Components
  const GenerateReportModal = () =>
    showGenerateReportModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Generate Report
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportData.type}
                    onChange={(e) =>
                      setReportData({ ...reportData, type: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="patient_summary">Patient Summary</option>
                    <option value="treatment_report">Treatment Report</option>
                    <option value="surgery_report">Surgery Report</option>
                    <option value="diagnostic_report">Diagnostic Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includeDiagnosis}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includeDiagnosis: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Include Diagnosis Information
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includeTreatment}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includeTreatment: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Include Treatment Plans
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.includeNotes}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        includeNotes: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Include Clinical Notes
                  </span>
                </label>
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const NewAppointmentModal = () =>
    showNewAppointmentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Schedule New Appointment
              </h2>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNewAppointment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={appointmentData.patientName}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentData.type}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        type: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="check-up">Check-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        date: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        time: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={appointmentData.notes}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const PrescriptionModal = () =>
    showPrescriptionModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Prescription
              </h2>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePrescription} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient
                  </label>
                  <select
                    value={prescriptionData.patientId}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medication
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.medication}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        medication: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.dosage}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        dosage: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={prescriptionData.frequency}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="once_daily">Once Daily</option>
                    <option value="twice_daily">Twice Daily</option>
                    <option value="three_times">Three Times Daily</option>
                    <option value="four_times">Four Times Daily</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.duration}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7 days, 2 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Refills
                  </label>
                  <select
                    value={prescriptionData.refills}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        refills: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">No Refills</option>
                    <option value="1">1 Refill</option>
                    <option value="2">2 Refills</option>
                    <option value="3">3 Refills</option>
                    <option value="5">5 Refills</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructions
                </label>
                <textarea
                  value={prescriptionData.instructions}
                  onChange={(e) =>
                    setPrescriptionData({
                      ...prescriptionData,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Special instructions for the patient..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const SurgeryModal = () =>
    showSurgeryModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Schedule Surgery
              </h2>
              <button
                onClick={() => setShowSurgeryModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSurgery} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={surgeryData.patientName}
                    onChange={(e) =>
                      setSurgeryData({
                        ...surgeryData,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Procedure
                  </label>
                  <input
                    type="text"
                    value={surgeryData.procedure}
                    onChange={(e) =>
                      setSurgeryData({
                        ...surgeryData,
                        procedure: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={surgeryData.date}
                    onChange={(e) =>
                      setSurgeryData({ ...surgeryData, date: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={surgeryData.time}
                    onChange={(e) =>
                      setSurgeryData({ ...surgeryData, time: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={surgeryData.duration}
                    onChange={(e) =>
                      setSurgeryData({
                        ...surgeryData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                    step="0.5"
                    min="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={surgeryData.priority}
                    onChange={(e) =>
                      setSurgeryData({
                        ...surgeryData,
                        priority: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surgical Team
                </label>
                <input
                  type="text"
                  value={surgeryData.team}
                  onChange={(e) =>
                    setSurgeryData({ ...surgeryData, team: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                  placeholder="Lead surgeon, anesthesiologist, nurses..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pre-operative Notes
                </label>
                <textarea
                  value={surgeryData.notes}
                  onChange={(e) =>
                    setSurgeryData({ ...surgeryData, notes: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSurgeryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Schedule Surgery
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const AddPatientModal = () =>
    showPatientModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Patient
              </h2>
              <button
                onClick={() => setShowPatientModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age *
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    min="0"
                    max="150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={newPatientData.gender}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        gender: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newPatientData.phone}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newPatientData.email}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={newPatientData.address}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Insurance Information
                  </label>
                  <textarea
                    value={newPatientData.insuranceInfo}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        insuranceInfo: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={newPatientData.medicalHistory}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        medicalHistory: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Known Allergies
                  </label>
                  <textarea
                    value={newPatientData.allergies}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        allergies: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Medications
                </label>
                <textarea
                  value={newPatientData.currentMedications}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      currentMedications: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  const DiagnosisModal = () =>
    showDiagnosisModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Record Diagnosis
              </h2>
              <button
                onClick={() => setShowDiagnosisModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDiagnosis} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient
                  </label>
                  <select
                    value={diagnosisData.patientId}
                    onChange={(e) =>
                      setDiagnosisData({
                        ...diagnosisData,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>
                  <select
                    value={diagnosisData.severity}
                    onChange={(e) =>
                      setDiagnosisData({
                        ...diagnosisData,
                        severity: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symptoms *
                </label>
                <textarea
                  value={diagnosisData.symptoms}
                  onChange={(e) =>
                    setDiagnosisData({
                      ...diagnosisData,
                      symptoms: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={diagnosisData.diagnosis}
                  onChange={(e) =>
                    setDiagnosisData({
                      ...diagnosisData,
                      diagnosis: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Treatment Plan *
                </label>
                <textarea
                  value={diagnosisData.treatment}
                  onChange={(e) =>
                    setDiagnosisData({
                      ...diagnosisData,
                      treatment: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Follow-up Instructions
                </label>
                <textarea
                  value={diagnosisData.followUp}
                  onChange={(e) =>
                    setDiagnosisData({
                      ...diagnosisData,
                      followUp: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={diagnosisData.notes}
                  onChange={(e) =>
                    setDiagnosisData({
                      ...diagnosisData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  rows="2"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowDiagnosisModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Record Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  // Render different cases
  const renderActiveCase = () => {
    switch (activeCase) {
      case "dashboard":
        return <DashboardOverview />;
      case "appointments":
        return <AppointmentsSection />;
      case "patients":
        return <PatientsSection />;
      case "schedule":
        return <ScheduleSection />;
      case "reports":
        return <ReportsSection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout
      role="doctor"
      activeCase={activeCase}
      onNavigate={setActiveCase}
    >
      <div className="space-y-6">{renderActiveCase()}</div>

      {/* Modals */}
      <GenerateReportModal />
      <NewAppointmentModal />
      <PrescriptionModal />
      <SurgeryModal />
      <AddPatientModal />
      <DiagnosisModal />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
