import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  Users,
  CreditCard,
  Building,
  Clock,
  User,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial section from URL params or default to dashboard
  const initialSection = searchParams.get("section") || "dashboard";
  const [activeCase, setActiveCase] = useState(initialSection);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pendingBills: 0,
    newMessages: 0,
    medicalRecords: 0,
  });

  // Update URL when section changes
  useEffect(() => {
    if (activeCase !== "dashboard") {
      navigate(`/dashboard?section=${activeCase}`, { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [activeCase, navigate]);

  // Handle initial URL params
  useEffect(() => {
    const section = searchParams.get("section");
    const doctorId = searchParams.get("doctor");

    if (section === "appointments" && doctorId) {
      setActiveCase("appointments");
      // You can pass doctorId to the Appointments component if needed
    } else if (section && section !== activeCase) {
      setActiveCase(section);
    }
  }, [searchParams]);

  // Mock data - in a real app, this would come from an API
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Smith",
      specialty: "Cardiology",
      date: "2025-05-20",
      time: "10:00 AM",
    },
    {
      id: 2,
      doctorName: "Dr. Johnson",
      specialty: "Neurology",
      date: "2025-05-25",
      time: "2:30 PM",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      activity: "Blood test results uploaded",
      date: "2025-05-15",
      time: "11:30 AM",
    },
    {
      id: 2,
      activity: "Appointment with Dr. Wilson completed",
      date: "2025-05-12",
      time: "3:00 PM",
    },
    {
      id: 3,
      activity: "Prescription refill requested",
      date: "2025-05-10",
      time: "9:15 AM",
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        upcomingAppointments: 2,
        pendingBills: 1,
        newMessages: 3,
        medicalRecords: 5,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const QuickAccessCard = ({ title, icon: Icon, count, section, color }) => (
    <button
      onClick={() => setActiveCase(section)}
      className={`block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${color} group w-full text-left`}
    >
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full ${color
            .replace("border-", "bg-")
            .replace(
              "dark:border-",
              "dark:bg-"
            )} bg-opacity-10 dark:bg-opacity-10 group-hover:bg-opacity-20`}
        >
          <Icon
            className={`h-6 w-6 ${color
              .replace("border-", "text-")
              .replace("dark:border-", "dark:text-")}`}
          />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-2xl font-bold mt-1 text-gray-700 dark:text-gray-300">
            {count}
          </p>
        </div>
      </div>
    </button>
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || "Patient"}!
        </h1>
        <p className="text-blue-100">
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
          <QuickAccessCard
            title="Appointments"
            icon={Calendar}
            count={stats.upcomingAppointments}
            section="appointments"
            color="border-blue-500 dark:border-blue-400"
          />
          <QuickAccessCard
            title="Medical Records"
            icon={FileText}
            count={stats.medicalRecords}
            section="medical-records"
            color="border-green-500 dark:border-green-400"
          />
          <QuickAccessCard
            title="Messages"
            icon={Users}
            count={stats.newMessages}
            section="messages"
            color="border-purple-500 dark:border-purple-400"
          />
          <QuickAccessCard
            title="Pending Bills"
            icon={CreditCard}
            count={stats.pendingBills}
            section="payments"
            color="border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Appointments
            </h2>
            <button
              onClick={() => setActiveCase("appointments")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              View all →
            </button>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                >
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {appointment.doctorName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.specialty}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          { weekday: "short", month: "short", day: "numeric" }
                        )}{" "}
                        at {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No upcoming appointments
              </p>
              <button
                onClick={() => setActiveCase("appointments")}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Schedule an appointment →
              </button>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500 mt-2"></div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent activities
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Access
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveCase("room-booking")}
            className="bg-blue-50 dark:bg-blue-900 bg-opacity-50 dark:bg-opacity-20 p-4 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200 group"
          >
            <Building className="h-8 w-8 mx-auto text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Book Room
            </span>
          </button>

          <button
            onClick={() => setActiveCase("nurse-requests")}
            className="bg-green-50 dark:bg-green-900 bg-opacity-50 dark:bg-opacity-20 p-4 rounded-lg text-center hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200 group"
          >
            <Users className="h-8 w-8 mx-auto text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" />
            <span className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Request Nurse
            </span>
          </button>

          <button
            onClick={() => setActiveCase("medical-records")}
            className="bg-purple-50 dark:bg-purple-900 bg-opacity-50 dark:bg-opacity-20 p-4 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-200 group"
          >
            <FileText className="h-8 w-8 mx-auto text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              View Records
            </span>
          </button>

          <button
            onClick={() => setActiveCase("emergency")}
            className="bg-red-50 dark:bg-red-900 bg-opacity-50 dark:bg-opacity-20 p-4 rounded-lg text-center hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-200 group"
          >
            <Clock className="h-8 w-8 mx-auto text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
            <span className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // Appointments Component
  const AppointmentsSection = () => {
    // Mock data for appointments
    const appointmentsData = [
      {
        id: 1,
        doctorName: "Dr. Smith",
        specialty: "Cardiology",
        date: "2025-05-20",
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: 2,
        doctorName: "Dr. Johnson",
        specialty: "Neurology",
        date: "2025-05-25",
        time: "2:30 PM",
        status: "confirmed",
      },
    ];

    const pastAppointments = [
      {
        id: 3,
        doctorName: "Dr. Wilson",
        specialty: "General",
        date: "2025-05-10",
        time: "9:00 AM",
        status: "completed",
      },
      {
        id: 4,
        doctorName: "Dr. Anderson",
        specialty: "Orthopedics",
        date: "2025-05-05",
        time: "11:30 AM",
        status: "cancelled",
      },
    ];

    const doctors = [
      { id: 1, name: "Dr. Smith", specialty: "Cardiology" },
      { id: 2, name: "Dr. Johnson", specialty: "Neurology" },
      { id: 3, name: "Dr. Wilson", specialty: "General" },
      { id: 4, name: "Dr. Anderson", specialty: "Orthopedics" },
    ];

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Appointments</h1>
              <p className="text-blue-100">Manage your medical appointments</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upcoming Appointments
          </h2>

          {appointmentsData.length > 0 ? (
            <div className="space-y-4">
              {appointmentsData.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          { weekday: "short", month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {appointment.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150">
                      Reschedule
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-150">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming appointments
              </p>
              <button
                onClick={() => setShowBookModal(true)}
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Past Appointments
          </h2>

          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          { weekday: "short", month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {appointment.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No past appointments
              </p>
            </div>
          )}
        </div>

        {/* Book Appointment Modal */}
        {showBookModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Book an Appointment
                    </h3>
                    <button
                      onClick={() => setShowBookModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="doctor"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Select Doctor
                      </label>
                      <select
                        id="doctor"
                        name="doctor"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Select Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Select Time
                      </label>
                      <select
                        id="time"
                        name="time"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Reason for visit (optional)
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        rows="3"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief description of symptoms or reason for appointment"
                      ></textarea>
                    </div>
                  </form>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                    onClick={() => setShowBookModal(false)}
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                    onClick={() => setShowBookModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Medical Records Component
  const MedicalRecordsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Medical Records</h1>
        <p className="text-green-100">View your medical history and records</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Records
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    General Checkup
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date: March 10, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Doctor: Dr. Smith
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Blood pressure: 120/80, Temperature: 98.6°F
                  </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  View Details
                </button>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Lab Results
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date: March 5, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type: Blood Test
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    All results within normal range
                  </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Medical History
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                Allergies
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Penicillin, Pollen
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                Chronic Conditions
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                None reported
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                Past Surgeries
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Appendectomy (2020)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Messages Component
  const MessagesSection = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [messageText, setMessageText] = useState("");

    const messages = [
      {
        id: 1,
        sender: "Dr. Smith",
        senderRole: "Cardiologist",
        subject: "Lab Results Available",
        message:
          "Your recent blood work results are now available. All values appear to be within normal ranges. Please schedule a follow-up appointment to discuss the results in detail.",
        timestamp: "2024-03-15 10:30 AM",
        read: false,
        type: "medical",
      },
      {
        id: 2,
        sender: "Nurse Johnson",
        senderRole: "Registered Nurse",
        subject: "Appointment Reminder",
        message:
          "This is a reminder that you have an appointment scheduled for tomorrow at 2:30 PM with Dr. Wilson. Please arrive 15 minutes early for check-in.",
        timestamp: "2024-03-14 2:00 PM",
        read: true,
        type: "appointment",
      },
      {
        id: 3,
        sender: "Reception",
        senderRole: "Front Desk",
        subject: "Insurance Update Required",
        message:
          "We need to update your insurance information. Please bring your updated insurance card to your next appointment or upload it through the patient portal.",
        timestamp: "2024-03-12 9:15 AM",
        read: true,
        type: "administrative",
      },
      {
        id: 4,
        sender: "Dr. Anderson",
        senderRole: "Orthopedic Surgeon",
        subject: "Post-Surgery Follow-up",
        message:
          "I hope your recovery is going well. Please let me know if you experience any unusual pain or discomfort. Your next follow-up is scheduled for next week.",
        timestamp: "2024-03-10 4:45 PM",
        read: false,
        type: "medical",
      },
    ];

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (messageText.trim()) {
        // Handle sending message logic here
        console.log("Sending message:", messageText);
        setMessageText("");
        setShowCompose(false);
      }
    };

    const getMessageTypeColor = (type) => {
      switch (type) {
        case "medical":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "appointment":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "administrative":
          return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Messages </h1>
              <p className="text-purple-100">
                Communicate with your healthcare providers
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
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                          <option>Dr. Smith - Cardiology</option>
                          <option>Dr. Johnson - Neurology</option>
                          <option>Nurse Johnson</option>
                          <option>Reception</option>
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

  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: user?.name || "John Doe",
      email: user?.email || "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-01-15",
      gender: "Male",
      address: "123 Main Street, City, State 12345",
      emergencyContact: "Jane Doe - +1 (555) 987-6543",
      bloodType: "O+",
      allergies: "Penicillin, Pollen",
      chronicConditions: "None",
      insurance: "Blue Cross Blue Shield",
      insuranceId: "BC123456789",
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
      // Handle save profile logic here
      console.log("Saving profile:", profileData);
      setIsEditing(false);
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Profile</h1>
              <p className="text-pink-100">Manage your personal information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
            >
              {isEditing ? "Cancel " : "Edit Profile "}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                Patient
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since 2024
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

          {/* Personal Information */}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Male">Male </option>
                        <option value="Female">Female </option>
                        <option value="Other">Other </option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Type
                    </label>
                    {isEditing ? (
                      <select
                        name="bloodType"
                        value={profileData.bloodType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.bloodType}
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

              {/* Medical Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Medical Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allergies
                    </label>
                    {isEditing ? (
                      <textarea
                        name="allergies"
                        value={profileData.allergies}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List any allergies..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.allergies}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chronic Conditions
                    </label>
                    {isEditing ? (
                      <textarea
                        name="chronicConditions"
                        value={profileData.chronicConditions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List any chronic conditions..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.chronicConditions}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Insurance Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="insurance"
                        value={profileData.insurance}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.insurance}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance ID
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="insuranceId"
                        value={profileData.insuranceId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.insuranceId}
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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

  // Room Booking Component
  const RoomBookingSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Room Booking</h1>
        <p className="text-indigo-100">Book hospital rooms and facilities</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Book a Room
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Room Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Deluxe Suite</option>
                <option>ICU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Check-in Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Expected Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Special Requirements
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Book Room
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Bookings
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Single Room #304
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check-in: March 20, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: 3 days
                  </p>
                </div>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Nurse Requests Component
  const NurseRequestsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Home Nurse Requests</h1>
        <p className="text-green-100">
          Request professional nursing care at home
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Request a Home Nurse
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Date Required
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Special Requirements
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Submit Request
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Requests
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Request #123
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date: March 15, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: 5 days
                  </p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Payments Component
  const PaymentsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Payments</h1>
        <p className="text-orange-100">
          Manage your medical bills and payments
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Payment Methods
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Visa ending in 4242
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                  Remove
                </button>
              </div>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              + Add Payment Method
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Consultation Fee
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    March 10, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dr. Smith
                  </p>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  $150.00
                </p>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Lab Tests
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    March 5, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Blood Work
                  </p>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  $75.00
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Pending Payments
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Room Booking
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: March 20, 2024
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Single Room #304
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    $300.00
                  </p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Emergency Section
  const EmergencySection = () => {
    const [emergencyType, setEmergencyType] = useState("");
    const [showEmergencyForm, setShowEmergencyForm] = useState(false);
    const [emergencyDescription, setEmergencyDescription] = useState("");

    const emergencyContacts = [
      { name: "Emergency Services", number: "911", type: "emergency" },
      { name: "Hospital Main", number: "+1 (555) 123-4567", type: "hospital" },
      {
        name: "Dr. Smith (Cardiologist)",
        number: "+1 (555) 234-5678",
        type: "doctor",
      },
      { name: "Nurse Hotline", number: "+1 (555) 345-6789", type: "nurse" },
      {
        name: "Emergency Contact (Jane Doe)",
        number: "+1 (555) 987-6543",
        type: "personal",
      },
    ];

    const handleEmergencyCall = (number) => {
      // In a real app, this would trigger a call
      window.open(`tel:${number}`);
    };

    const handleEmergencySubmit = (e) => {
      e.preventDefault();
      // Handle emergency request submission
      console.log("Emergency request:", {
        emergencyType,
        emergencyDescription,
      });
      alert("Emergency request submitted. Help is on the way!");
      setShowEmergencyForm(false);
      setEmergencyType("");
      setEmergencyDescription("");
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Emergency</h1>
              <p className="text-red-100">
                Quick access to emergency services and contacts
              </p>
            </div>
            <button
              onClick={() => handleEmergencyCall("911")}
              className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 font-bold text-lg"
            >
              CALL 911
            </button>
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Emergency Protocol
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>• For life-threatening emergencies, call 911 immediately</p>
                <p>
                  • For urgent medical issues, contact the hospital directly
                </p>
                <p>• For non-urgent questions, use the messaging system</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Emergency Contacts
            </h2>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-4 ${
                        contact.type === "emergency"
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                          : contact.type === "hospital"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : contact.type === "doctor"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          : contact.type === "nurse"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.number}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEmergencyCall(contact.number)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Request Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Request Emergency Assistance
            </h2>

            {!showEmergencyForm ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Need immediate medical assistance?
                </p>
                <button
                  onClick={() => setShowEmergencyForm(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Request Help
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmergencySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Type
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select emergency type</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="chest-pain">Chest Pain</option>
                    <option value="breathing">Breathing Difficulty</option>
                    <option value="fall">Fall/Injury</option>
                    <option value="medication">Medication Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={emergencyDescription}
                    onChange={(e) => setEmergencyDescription(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your emergency situation..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                  >
                    Submit Emergency Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmergencyForm(false)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Emergency Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleEmergencyCall("911")}
              className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors duration-200 text-center"
            >
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <span className="block font-semibold">Emergency Services</span>
              <span className="block text-sm">Call 911</span>
            </button>

            <button
              onClick={() => handleEmergencyCall("+1 (555) 123-4567")}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              <Building className="h-8 w-8 mx-auto mb-2" />
              <span className="block font-semibold">Hospital Direct</span>
              <span className="block text-sm">Main Line</span>
            </button>

            <button
              onClick={() => setActiveCase("appointments")}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <span className="block font-semibold">Urgent Appointment</span>
              <span className="block text-sm">Book Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SettingsSection = () => {
    const [notifications, setNotifications] = useState({
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      testResults: true,
      medicationReminders: true,
      marketingEmails: false,
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
      // Handle save settings logic
      console.log("Saving settings:", { notifications, privacy, preferences });
      alert("Settings saved successfully!");
    };

    const handleExportData = () => {
      // Handle data export
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
          "Account deletion request submitted. Please contact support to complete the process."
        );
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-300">
            Configure your preferences and account settings
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
                      "Receive notifications via SMS"}
                    {key === "appointmentReminders" &&
                      "Get reminders for upcoming appointments"}
                    {key === "testResults" &&
                      "Get notified when test results are available"}
                    {key === "medicationReminders" &&
                      "Receive medication reminders"}
                    {key === "marketingEmails" &&
                      "Receive promotional emails and newsletters"}
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
                  Download a copy of all your personal data
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

  // Render different cases
  const renderActiveCase = () => {
    switch (activeCase) {
      case "dashboard":
        return <DashboardOverview />;
      case "appointments":
        return <AppointmentsSection />;
      case "medical-records":
        return <MedicalRecordsSection />;
      case "messages":
        return <MessagesSection />;
      case "payments":
        return <PaymentsSection />;
      case "room-booking":
        return <RoomBookingSection />;
      case "nurse-requests":
        return <NurseRequestsSection />;
      case "emergency":
        return <EmergencySection />;
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
      role="patient"
      activeCase={activeCase}
      onNavigate={setActiveCase}
    >
      <div className="space-y-6">{renderActiveCase()}</div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
