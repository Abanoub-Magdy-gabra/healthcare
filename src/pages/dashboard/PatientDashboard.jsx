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
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Heart,
  Stethoscope,
  ArrowLeft,
  Wifi,
  Tv,
  Car,
  Coffee,
  Shield,
  Search,
  Filter
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Room booking states
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState('browse'); // 'browse', 'book'
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequirements: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

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
        roomsData,
        statsData
      ] = await Promise.all([
        dbService.getAppointments(user.id, 'patient'),
        dbService.getMedicalRecords(user.id),
        dbService.getMessages(user.id),
        dbService.getPayments(user.id, 'patient'),
        dbService.getRoomBookings(user.id, 'patient'),
        dbService.getRooms(),
        dbService.getDashboardStats(user.id, 'patient')
      ]);

      setAppointments(appointmentsData || []);
      setMedicalRecords(recordsData || []);
      setMessages(messagesData || []);
      setPayments(paymentsData || []);
      setRoomBookings(roomBookingsData || []);
      setRooms(roomsData || []);
      setStats(statsData || {});

    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (section) => {
    setActiveCase(section);
    // Reset room booking state when navigating away
    if (section !== 'room-booking') {
      setBookingStep('browse');
      setSelectedRoom(null);
      setBookingForm({
        checkInDate: '',
        checkOutDate: '',
        specialRequirements: ''
      });
    }
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

  const calculateTotalCost = () => {
    if (!selectedRoom || !bookingForm.checkInDate || !bookingForm.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * parseFloat(selectedRoom.daily_rate);
  };

  const handleRoomBooking = async () => {
    if (!selectedRoom || !bookingForm.checkInDate || !bookingForm.checkOutDate) {
      alert('Please fill in all required fields');
      return;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      alert('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);
    try {
      const totalCost = calculateTotalCost();
      
      const bookingData = {
        patient_id: user.id,
        room_id: selectedRoom.id,
        check_in_date: bookingForm.checkInDate,
        check_out_date: bookingForm.checkOutDate,
        total_cost: totalCost,
        special_requirements: bookingForm.specialRequirements || null,
        status: 'pending'
      };

      console.log('Booking room with data:', bookingData);

      const newBooking = await dbService.createRoomBooking(bookingData);
      
      if (newBooking) {
        alert('Room booked successfully! Your booking is pending confirmation.');
        
        // Reset form and go back to browse
        setBookingForm({
          checkInDate: '',
          checkOutDate: '',
          specialRequirements: ''
        });
        setSelectedRoom(null);
        setBookingStep('browse');
        
        // Reload room bookings
        const updatedBookings = await dbService.getRoomBookings(user.id, 'patient');
        setRoomBookings(updatedBookings || []);
      }
    } catch (error) {
      console.error('Error booking room:', error);
      alert('Failed to book room. Please try again.');
    } finally {
      setBookingLoading(false);
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
                  <p className="font-medium text-gray-900 dark:text-white">{message.sender?.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{message.subject}</p>
                </div>
                {!message.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
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

  const renderRoomBooking = () => {
    if (bookingStep === 'book' && selectedRoom) {
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setBookingStep('browse');
                setSelectedRoom(null);
                setBookingForm({
                  checkInDate: '',
                  checkOutDate: '',
                  specialRequirements: ''
                });
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Room {selectedRoom.room_number}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Room Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedRoom.room_number}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedRoom.room_type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Floor:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedRoom.floor}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedRoom.capacity} patient(s)</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Rate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${selectedRoom.daily_rate}</span>
                </div>

                {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Equipment:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRoom.equipment.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkInDate}
                    onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkOutDate}
                    onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
                    min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={bookingForm.specialRequirements}
                    onChange={(e) => setBookingForm({...bookingForm, specialRequirements: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {bookingForm.checkInDate && bookingForm.checkOutDate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="text-gray-900 dark:text-white">
                          {Math.ceil((new Date(bookingForm.checkOutDate) - new Date(bookingForm.checkInDate)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Daily Rate:</span>
                        <span className="text-gray-900 dark:text-white">${selectedRoom.daily_rate}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span className="text-gray-900 dark:text-white">Total Cost:</span>
                        <span className="text-blue-600 dark:text-blue-400">${calculateTotalCost()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRoomBooking}
                  disabled={bookingLoading || !bookingForm.checkInDate || !bookingForm.checkOutDate}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking Room...
                    </>
                  ) : (
                    'Book Room'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Booking</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setBookingStep('browse')}
              className={`px-4 py-2 rounded-lg ${
                bookingStep === 'browse'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Available Rooms
            </button>
            <button
              onClick={() => setBookingStep('my-bookings')}
              className={`px-4 py-2 rounded-lg ${
                bookingStep === 'my-bookings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              My Bookings ({roomBookings.length})
            </button>
          </div>
        </div>

        {bookingStep === 'browse' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Rooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms
                  .filter(room => room.status === 'available')
                  .map((room) => (
                  <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Room {room.room_number}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {room.room_type} • Floor {room.floor}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Daily Rate:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${room.daily_rate}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Capacity:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{room.capacity} patient(s)</span>
                      </div>

                      {room.equipment && room.equipment.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {room.equipment.slice(0, 4).map((item, index) => {
                              const getIcon = (equipment) => {
                                switch(equipment.toLowerCase()) {
                                  case 'wifi': return <Wifi className="h-3 w-3" />;
                                  case 'tv': return <Tv className="h-3 w-3" />;
                                  case 'parking': return <Car className="h-3 w-3" />;
                                  case 'coffee': return <Coffee className="h-3 w-3" />;
                                  default: return <Shield className="h-3 w-3" />;
                                }
                              };
                              
                              return (
                                <div key={index} className="flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                  {getIcon(item)}
                                  <span className="ml-1">{item}</span>
                                </div>
                              );
                            })}
                            {room.equipment.length > 4 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{room.equipment.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setBookingStep('book');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Select Room
                    </button>
                  </div>
                ))}
              </div>
              
              {rooms.filter(room => room.status === 'available').length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No rooms available at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {bookingStep === 'my-bookings' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Room Bookings</h3>
            <div className="space-y-4">
              {roomBookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Room {booking.room?.room_number}
                        </h4>
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {booking.room?.room_type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Check-in:</span> {formatDate(booking.check_in_date)}
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span> {formatDate(booking.check_out_date)}
                        </div>
                        <div>
                          <span className="font-medium">Total Cost:</span> ${booking.total_cost}
                        </div>
                      </div>
                      {booking.special_requirements && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span className="font-medium">Special Requirements:</span> {booking.special_requirements}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : booking.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
              
              {roomBookings.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No room bookings yet</p>
                  <button
                    onClick={() => setBookingStep('browse')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Book Your First Room
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {appointment.status}
                  </span>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Request Record
        </button>
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
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Dr. {record.doctor?.full_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(record.record_date)}
                      </div>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {record.description}
                      </p>
                    )}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Eye className="h-4 w-4" />
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

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>

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
                      {!message.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>From: {message.sender?.full_name}</span>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
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
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No messages</p>
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
                <span className="text-gray-700 dark:text-gray-300">Prescription Refills</span>
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