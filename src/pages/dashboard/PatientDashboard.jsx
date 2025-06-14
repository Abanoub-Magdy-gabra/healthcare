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
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Send,
  Heart,
  Stethoscope,
  Home,
  DollarSign,
  Calendar as CalendarIcon,
  Star,
  Download,
  Upload,
  Bell,
  Shield,
  Lock,
  Save,
  X
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
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Payment method states
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Egypt'
    },
    isDefault: false
  });

  // Room booking states
  const [showRoomBooking, setShowRoomBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequirements: '',
    paymentMethodId: ''
  });

  // Message states
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    subject: '',
    content: '',
    priority: 'medium'
  });

  // Appointment states
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    notes: ''
  });

  // Nurse request states
  const [showNurseRequest, setShowNurseRequest] = useState(false);
  const [newNurseRequest, setNewNurseRequest] = useState({
    requestType: '',
    description: '',
    address: '',
    requestedDate: '',
    requestedTime: '',
    durationHours: 2,
    priority: 'medium',
    services: [],
    specialInstructions: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadPatientData();
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
        roomsData,
        statsData
      ] = await Promise.all([
        dbService.getAppointments(user.id, 'patient'),
        dbService.getMedicalRecords(user.id),
        dbService.getMessages(user.id),
        dbService.getPayments(user.id, 'patient'),
        dbService.getRoomBookings(user.id, 'patient'),
        dbService.getNurseRequests(user.id, 'patient'),
        dbService.getRooms(),
        dbService.getDashboardStats(user.id, 'patient')
      ]);

      setAppointments(appointmentsData || []);
      setMedicalRecords(recordsData || []);
      setMessages(messagesData || []);
      setPayments(paymentsData || []);
      setRoomBookings(roomBookingsData || []);
      setNurseRequests(nurseRequestsData || []);
      setRooms(roomsData || []);
      setStats(statsData || {});

      // Load saved payment methods from localStorage
      const savedPaymentMethods = JSON.parse(localStorage.getItem(`paymentMethods_${user.id}`) || '[]');
      setPaymentMethods(savedPaymentMethods);

    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (section) => {
    setActiveCase(section);
  };

  // Currency formatting function for EGP
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Payment method functions
  const detectCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.match(/^4/)) return 'Visa';
    if (number.match(/^5[1-5]/)) return 'Mastercard';
    if (number.match(/^3[47]/)) return 'American Express';
    if (number.match(/^6/)) return 'Discover';
    return 'Unknown';
  };

  const formatCardNumber = (value) => {
    const number = value.replace(/\s/g, '');
    const formatted = number.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryMonth || 
        !newPaymentMethod.expiryYear || !newPaymentMethod.cvv || 
        !newPaymentMethod.cardholderName) {
      alert('Please fill in all required fields');
      return;
    }

    const paymentMethod = {
      id: Date.now().toString(),
      ...newPaymentMethod,
      cardBrand: detectCardBrand(newPaymentMethod.cardNumber),
      lastFour: newPaymentMethod.cardNumber.slice(-4),
      createdAt: new Date().toISOString()
    };

    // If this is the first payment method or marked as default, make it default
    if (paymentMethods.length === 0 || newPaymentMethod.isDefault) {
      // Remove default from other methods
      const updatedMethods = paymentMethods.map(method => ({ ...method, isDefault: false }));
      paymentMethod.isDefault = true;
      setPaymentMethods([...updatedMethods, paymentMethod]);
    } else {
      setPaymentMethods([...paymentMethods, paymentMethod]);
    }

    // Save to localStorage
    const updatedMethods = paymentMethods.length === 0 || newPaymentMethod.isDefault 
      ? [...paymentMethods.map(method => ({ ...method, isDefault: false })), { ...paymentMethod, isDefault: true }]
      : [...paymentMethods, paymentMethod];
    
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updatedMethods));

    // Reset form
    setNewPaymentMethod({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Egypt'
      },
      isDefault: false
    });
    setShowAddPaymentMethod(false);
    alert('Payment method added successfully!');
  };

  const handleDeletePaymentMethod = (methodId) => {
    if (paymentMethods.length === 1) {
      alert('Cannot delete the last payment method');
      return;
    }

    const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
    
    // If we deleted the default method, make the first remaining method default
    const deletedMethod = paymentMethods.find(method => method.id === methodId);
    if (deletedMethod?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }

    setPaymentMethods(updatedMethods);
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updatedMethods));
    alert('Payment method deleted successfully!');
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    }));
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updatedMethods));
    alert('Default payment method updated!');
  };

  // Room booking functions
  const calculateTotalCost = () => {
    if (!selectedRoom || !bookingData.checkInDate || !bookingData.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * selectedRoom.daily_rate;
  };

  const handleRoomBooking = async () => {
    if (!selectedRoom || !bookingData.checkInDate || !bookingData.checkOutDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!bookingData.paymentMethodId) {
      alert('Please select a payment method');
      return;
    }

    const totalCost = calculateTotalCost();
    
    try {
      setLoading(true);

      // Create room booking
      const booking = {
        patient_id: user.id,
        room_id: selectedRoom.id,
        check_in_date: bookingData.checkInDate,
        check_out_date: bookingData.checkOutDate,
        total_cost: totalCost,
        special_requirements: bookingData.specialRequirements,
        status: 'pending'
      };

      const newBooking = await dbService.createRoomBooking(booking);

      // Create payment record
      const payment = {
        patient_id: user.id,
        room_booking_id: newBooking.id,
        amount: totalCost,
        description: `Room booking for ${selectedRoom.room_number} (${formatDate(bookingData.checkInDate)} - ${formatDate(bookingData.checkOutDate)})`,
        payment_method: paymentMethods.find(method => method.id === bookingData.paymentMethodId)?.cardBrand + ' ending in ' + paymentMethods.find(method => method.id === bookingData.paymentMethodId)?.lastFour,
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0]
      };

      await dbService.createPayment(payment);

      // Refresh data
      await loadPatientData();

      // Reset form
      setSelectedRoom(null);
      setBookingData({
        checkInDate: '',
        checkOutDate: '',
        specialRequirements: '',
        paymentMethodId: ''
      });
      setShowRoomBooking(false);

      alert(`Room booked successfully! Total cost: ${formatCurrency(totalCost)}`);

    } catch (error) {
      console.error('Error booking room:', error);
      alert('Failed to book room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Message functions
  const handleSendMessage = async () => {
    if (!newMessage.recipientId || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const message = {
        sender_id: user.id,
        recipient_id: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content,
        priority: newMessage.priority
      };

      await dbService.createMessage(message);
      await loadPatientData();

      setNewMessage({
        recipientId: '',
        subject: '',
        content: '',
        priority: 'medium'
      });
      setShowNewMessage(false);

      alert('Message sent successfully!');

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Appointment functions
  const handleBookAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.appointmentDate || 
        !newAppointment.appointmentTime || !newAppointment.appointmentType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const appointment = {
        patient_id: user.id,
        doctor_id: newAppointment.doctorId,
        appointment_date: newAppointment.appointmentDate,
        appointment_time: newAppointment.appointmentTime,
        appointment_type: newAppointment.appointmentType,
        notes: newAppointment.notes,
        status: 'pending'
      };

      await dbService.createAppointment(appointment);
      await loadPatientData();

      setNewAppointment({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: '',
        notes: ''
      });
      setShowNewAppointment(false);

      alert('Appointment booked successfully!');

    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Nurse request functions
  const handleNurseRequest = async () => {
    if (!newNurseRequest.requestType || !newNurseRequest.description || 
        !newNurseRequest.address || !newNurseRequest.requestedDate || 
        !newNurseRequest.requestedTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const request = {
        patient_id: user.id,
        request_type: newNurseRequest.requestType,
        description: newNurseRequest.description,
        address: newNurseRequest.address,
        requested_date: newNurseRequest.requestedDate,
        requested_time: newNurseRequest.requestedTime,
        duration_hours: newNurseRequest.durationHours,
        priority: newNurseRequest.priority,
        services: newNurseRequest.services,
        special_instructions: newNurseRequest.specialInstructions,
        status: 'pending'
      };

      await dbService.createNurseRequest(request);
      await loadPatientData();

      setNewNurseRequest({
        requestType: '',
        description: '',
        address: '',
        requestedDate: '',
        requestedTime: '',
        durationHours: 2,
        priority: 'medium',
        services: [],
        specialInstructions: ''
      });
      setShowNurseRequest(false);

      alert('Nurse request submitted successfully!');

    } catch (error) {
      console.error('Error submitting nurse request:', error);
      alert('Failed to submit nurse request. Please try again.');
    } finally {
      setLoading(false);
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
            <Mail className="h-8 w-8 text-orange-500" />
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Dr. {appointment.doctor?.full_name}
                  </p>
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
            {appointments.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No appointments scheduled
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
                  <p className="font-medium text-gray-900 dark:text-white">
                    {message.sender?.full_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {message.subject}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!message.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No messages
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h2>
        <button 
          onClick={() => setShowNewAppointment(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book Appointment
        </button>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book New Appointment</h3>
              <button 
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doctor *
                </label>
                <select
                  value={newAppointment.doctorId}
                  onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a doctor</option>
                  <option value="doc1">Dr. Sarah Johnson - Cardiologist</option>
                  <option value="doc2">Dr. Michael Chen - Neurologist</option>
                  <option value="doc3">Dr. Emily Williams - Pediatrician</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time *
                </label>
                <select
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment({...newAppointment, appointmentTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Type *
                </label>
                <select
                  value={newAppointment.appointmentType}
                  onChange={(e) => setNewAppointment({...newAppointment, appointmentType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select type</option>
                  <option value="consultation">General Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="routine-checkup">Routine Checkup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Any specific concerns or symptoms..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleBookAppointment}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        {appointment.doctor?.specialization}
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
                      <span>• {appointment.appointment_type}</span>
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
                <button 
                  onClick={() => setShowNewAppointment(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Book Your First Appointment
                </button>
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
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload Record
          </button>
        </div>
      </div>

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
                        <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Dr. {record.doctor?.full_name}</span>
                      <span>• {formatDate(record.record_date)}</span>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {record.description}
                      </p>
                    )}
                    {record.test_results && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Test Results:</strong> {JSON.stringify(record.test_results)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
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

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <button 
          onClick={() => setShowNewMessage(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h3>
              <button 
                onClick={() => setShowNewMessage(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To *
                </label>
                <select
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage({...newMessage, recipientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select recipient</option>
                  <option value="doc1">Dr. Sarah Johnson</option>
                  <option value="doc2">Dr. Michael Chen</option>
                  <option value="nurse1">Nurse Davis</option>
                  <option value="admin1">Admin Support</option>
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
                  placeholder="Message subject"
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {message.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.priority === 'urgent' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : message.priority === 'high'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {message.priority}
                      </span>
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>From: {message.sender?.full_name}</span>
                      <span>• {formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No messages</p>
                <button 
                  onClick={() => setShowNewMessage(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Send Your First Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Billing</h2>
        <button 
          onClick={() => setShowAddPaymentMethod(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
        
        {paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {method.cardBrand} •••• {method.lastFour}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.cardholderName}
                        </p>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No payment methods added</p>
            <button 
              onClick={() => setShowAddPaymentMethod(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add Your First Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Payment Method</h3>
              <button 
                onClick={() => setShowAddPaymentMethod(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={formatCardNumber(newPaymentMethod.cardNumber)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16) {
                      setNewPaymentMethod({...newPaymentMethod, cardNumber: value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {newPaymentMethod.cardNumber && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    {detectCardBrand(newPaymentMethod.cardNumber)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Month *
                  </label>
                  <select
                    value={newPaymentMethod.expiryMonth}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Month</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Year *
                  </label>
                  <select
                    value={newPaymentMethod.expiryYear}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Year</option>
                    {Array.from({length: 10}, (_, i) => (
                      <option key={i} value={new Date().getFullYear() + i}>
                        {new Date().getFullYear() + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setNewPaymentMethod({...newPaymentMethod, cvv: value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="123"
                  maxLength={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.cardholderName}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Billing Address</h4>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newPaymentMethod.billingAddress.street}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod, 
                      billingAddress: {...newPaymentMethod.billingAddress, street: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Street Address"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newPaymentMethod.billingAddress.city}
                      onChange={(e) => setNewPaymentMethod({
                        ...newPaymentMethod, 
                        billingAddress: {...newPaymentMethod.billingAddress, city: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={newPaymentMethod.billingAddress.state}
                      onChange={(e) => setNewPaymentMethod({
                        ...newPaymentMethod, 
                        billingAddress: {...newPaymentMethod.billingAddress, state: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="State"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={newPaymentMethod.billingAddress.zipCode}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod, 
                      billingAddress: {...newPaymentMethod.billingAddress, zipCode: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="setDefault"
                  checked={newPaymentMethod.isDefault}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, isDefault: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set as default payment method
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddPaymentMethod}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Add Payment Method
                </button>
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h3>
        
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {payment.description}
                    </h4>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {payment.invoice_number}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(payment.created_at)}</span>
                    {payment.payment_method && <span>• {payment.payment_method}</span>}
                    {payment.paid_date && <span>• Paid on {formatDate(payment.paid_date)}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount)}
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
                </div>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No payment history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRoomBooking = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Booking</h2>
        <button 
          onClick={() => setShowRoomBooking(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book Room
        </button>
      </div>

      {/* Room Booking Modal */}
      {showRoomBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book a Room</h3>
              <button 
                onClick={() => setShowRoomBooking(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!selectedRoom ? (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Select a Room</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {rooms.filter(room => room.status === 'available').map((room) => (
                    <div 
                      key={room.id} 
                      onClick={() => setSelectedRoom(room)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          Room {room.room_number}
                        </h5>
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                          {room.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {room.room_type} • Floor {room.floor}
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(room.daily_rate)}/night
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Capacity: {room.capacity} patient(s)
                      </p>
                      {room.equipment && room.equipment.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Equipment:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.equipment.slice(0, 3).map((item, index) => (
                              <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                {item}
                              </span>
                            ))}
                            {room.equipment.length > 3 && (
                              <span className="text-xs text-gray-500">+{room.equipment.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Selected Room: {selectedRoom.room_number}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRoom.room_type} • Floor {selectedRoom.floor} • {formatCurrency(selectedRoom.daily_rate)}/night
                  </p>
                  <button 
                    onClick={() => setSelectedRoom(null)}
                    className="text-blue-600 dark:text-blue-400 text-sm mt-2"
                  >
                    Change Room
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkInDate}
                      onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkOutDate}
                      onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={bookingData.paymentMethodId}
                    onChange={(e) => setBookingData({...bookingData, paymentMethodId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select payment method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.cardBrand} •••• {method.lastFour} {method.isDefault ? '(Default)' : ''}
                      </option>
                    ))}
                  </select>
                  {paymentMethods.length === 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Please add a payment method first
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={bookingData.specialRequirements}
                    onChange={(e) => setBookingData({...bookingData, specialRequirements: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Booking Summary</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Room:</span>
                        <span className="text-gray-900 dark:text-white">{selectedRoom.room_number} ({selectedRoom.room_type})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                        <span className="text-gray-900 dark:text-white">{formatDate(bookingData.checkInDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Check-out:</span>
                        <span className="text-gray-900 dark:text-white">{formatDate(bookingData.checkOutDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nights:</span>
                        <span className="text-gray-900 dark:text-white">
                          {Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-blue-600 dark:text-blue-400">{formatCurrency(calculateTotalCost())}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleRoomBooking}
                    disabled={loading || !bookingData.checkInDate || !bookingData.checkOutDate || !bookingData.paymentMethodId}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    {loading ? 'Processing Payment...' : `Book Room & Pay ${formatCurrency(calculateTotalCost())}`}
                  </button>
                  <button
                    onClick={() => setShowRoomBooking(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Room Bookings</h3>
        
        <div className="space-y-4">
          {roomBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Room {booking.room?.room_number}
                    </h4>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {booking.room?.room_type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</span>
                    <span>• {formatCurrency(booking.room?.daily_rate)}/night</span>
                  </div>
                  {booking.special_requirements && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Special Requirements: {booking.special_requirements}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(booking.total_cost)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {roomBookings.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No room bookings</p>
              <button 
                onClick={() => setShowRoomBooking(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Book Your First Room
              </button>
            </div>
          )}
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
                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Appointment Reminders</span>
                <input type="checkbox" className="toggle" defaultChecked />
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
                <span className="text-gray-700 dark:text-gray-300">Allow marketing communications</span>
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