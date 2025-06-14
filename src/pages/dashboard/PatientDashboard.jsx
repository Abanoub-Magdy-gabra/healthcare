import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { dbService } from '../../lib/supabase.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  Calendar,
  FileText,
  Users,
  CreditCard,
  Building,
  Activity,
  User,
  Settings,
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Send,
  MessageSquare,
  Paperclip,
  Star,
  Filter,
  Download,
  Heart,
  Stethoscope,
  Pill
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [nurseRequests, setNurseRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Message form state
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    content: '',
    priority: 'medium'
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadPatientData();
      loadDoctors();
    }
  }, [user]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [
        appointmentsData,
        recordsData,
        messagesData,
        paymentsData,
        roomBookingsData,
        nurseRequestsData,
        statsData
      ] = await Promise.all([
        dbService.getAppointments(user.id, 'patient'),
        dbService.getMedicalRecords(user.id),
        dbService.getMessages(user.id),
        dbService.getPayments(user.id, 'patient'),
        dbService.getRoomBookings(user.id, 'patient'),
        dbService.getNurseRequests(user.id, 'patient'),
        dbService.getDashboardStats(user.id, 'patient')
      ]);

      setAppointments(appointmentsData || []);
      setMedicalRecords(recordsData || []);
      setMessages(messagesData || []);
      setPayments(paymentsData || []);
      setRoomBookings(roomBookingsData || []);
      setNurseRequests(nurseRequestsData || []);
      setStats(statsData || {});

    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      // Get all users with doctor role
      const allUsers = await dbService.getAllUsers();
      const doctorsList = allUsers.filter(user => user.role === 'doctor');
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.recipient_id || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all required fields');
      return;
    }

    setSendingMessage(true);
    try {
      const messageData = {
        sender_id: user.id,
        recipient_id: newMessage.recipient_id,
        subject: newMessage.subject,
        content: newMessage.content,
        priority: newMessage.priority
      };

      console.log('Sending message:', messageData);

      await dbService.createMessage(messageData);
      
      // Reset form
      setNewMessage({
        recipient_id: '',
        subject: '',
        content: '',
        priority: 'medium'
      });

      // Reload messages
      const updatedMessages = await dbService.getMessages(user.id);
      setMessages(updatedMessages || []);

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await dbService.markMessageAsRead(messageId);
      // Reload messages to update read status
      const updatedMessages = await dbService.getMessages(user.id);
      setMessages(updatedMessages || []);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name}!</h1>
        <p className="text-blue-100">Here's your health overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingAppointments || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Medical Records</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.medicalRecords || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unreadMessages || 0}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingPayments || 0}</p>
            </div>
            <CreditCard className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {appointments
              .filter(appointment => new Date(appointment.appointment_date) >= new Date())
              .slice(0, 3)
              .map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dr. {appointment.doctor?.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
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
            {appointments.filter(a => new Date(a.appointment_date) >= new Date()).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming appointments
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{message.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    From: {message.sender?.full_name}
                  </p>
                </div>
                {!message.is_read && message.recipient_id === user.id && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No messages yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <button 
          onClick={() => setActiveCase('compose-message')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Compose Message
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !message.is_read && message.recipient_id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => {
                  if (!message.is_read && message.recipient_id === user.id) {
                    markMessageAsRead(message.id);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {message.subject}
                      </h3>
                      {!message.is_read && message.recipient_id === user.id && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                          New
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : message.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {message.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>
                        {message.sender_id === user.id ? 'To' : 'From'}: {
                          message.sender_id === user.id 
                            ? message.recipient?.full_name 
                            : message.sender?.full_name
                        }
                      </span>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComposeMessage = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setActiveCase('messages')}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to Messages
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compose Message</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSendMessage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Send to *
            </label>
            <select
              value={newMessage.recipient_id}
              onChange={(e) => setNewMessage({...newMessage, recipient_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.full_name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter message subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={newMessage.priority}
              onChange={(e) => setNewMessage({...newMessage, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={sendingMessage}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center disabled:cursor-not-allowed"
            >
              {sendingMessage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveCase('messages')}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Book Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dr. {appointment.doctor?.full_name}
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
                        {formatTime(appointment.appointment_time)}
                      </div>
                      <span>Duration: {appointment.duration_minutes} min</span>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {appointment.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalRecords = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {medicalRecords.map((record) => (
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
                        <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Dr. {record.doctor?.full_name}</span>
                      <span>{formatDate(record.record_date)}</span>
                    </div>
                    {record.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {record.description}
                      </p>
                    )}
                    {record.test_results && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Results:</p>
                        <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
                          {JSON.stringify(record.test_results, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {medicalRecords.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No medical records available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Billing</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {payment.description}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {payment.invoice_number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Amount: ${payment.amount}</span>
                      <span>Due: {formatDate(payment.due_date)}</span>
                      {payment.payment_method && <span>Method: {payment.payment_method}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {payment.status}
                    </span>
                    {payment.status === 'pending' && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                        Pay Now
                      </button>
                    )}
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

  const renderRoomBooking = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Bookings</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Book Room
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {roomBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Room {booking.room?.room_number}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {booking.room?.room_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Check-in: {formatDate(booking.check_in_date)}</span>
                      <span>Check-out: {formatDate(booking.check_out_date)}</span>
                      <span>Total: ${booking.total_cost}</span>
                    </div>
                    {booking.special_requirements && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Special Requirements: {booking.special_requirements}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            {roomBookings.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No room bookings</p>
              </div>
            )}
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
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Patient</p>
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
              Phone Number
            </label>
            <input
              type="tel"
              value={user?.phone || ''}
              placeholder="Add phone number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={user?.date_of_birth || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            value={user?.address || ''}
            placeholder="Add your address"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
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
                <span className="text-gray-700 dark:text-gray-300">Appointment Reminders</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Test Results</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Payment Reminders</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Share data with doctors</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Marketing communications</span>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeCase) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'appointments':
        return renderAppointments();
      case 'medical-records':
        return renderMedicalRecords();
      case 'messages':
        return renderMessages();
      case 'compose-message':
        return renderComposeMessage();
      case 'payments':
        return renderPayments();
      case 'room-booking':
        return renderRoomBooking();
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
      role="patient"
      activeCase={activeCase}
      onNavigate={handleNavigation}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default PatientDashboard;