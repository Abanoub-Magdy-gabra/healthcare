import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export const dbService = {
  // Profile operations
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist
          return null;
        }
        console.error('Error fetching profile:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  },

  async createProfile(profile) {
    try {
      console.log('Creating profile in database with data:', profile);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating profile:', error)
        throw error
      }
      
      console.log('Profile created successfully in database:', data);
      return data
    } catch (error) {
      console.error('Profile creation error:', error)
      throw error
    }
  },

  async deleteProfile(userId) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (error) {
        console.error('Error deleting profile:', error)
        throw error
      }
    } catch (error) {
      console.error('Profile deletion error:', error)
      throw error
    }
  },

  // Appointments operations
  async getAppointments(userId, role) {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(full_name, email),
          doctor:profiles!appointments_doctor_id_fkey(full_name, email, specialization)
        `)

      if (role === 'patient') {
        query = query.eq('patient_id', userId)
      } else if (role === 'doctor') {
        query = query.eq('doctor_id', userId)
      }

      const { data, error } = await query.order('appointment_date', { ascending: true })
      
      if (error) {
        console.error('Error fetching appointments:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Appointments fetch error:', error)
      return []
    }
  },

  async createAppointment(appointment) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating appointment:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Appointment creation error:', error)
      throw error
    }
  },

  async updateAppointment(id, updates) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating appointment:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Appointment update error:', error)
      throw error
    }
  },

  async deleteAppointment(id) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting appointment:', error)
        throw error
      }
    } catch (error) {
      console.error('Appointment deletion error:', error)
      throw error
    }
  },

  // Medical records operations
  async getMedicalRecords(patientId) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          doctor:profiles!medical_records_doctor_id_fkey(full_name, specialization)
        `)
        .eq('patient_id', patientId)
        .order('record_date', { ascending: false })
      
      if (error) {
        console.error('Error fetching medical records:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Medical records fetch error:', error)
      return []
    }
  },

  async createMedicalRecord(record) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert(record)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating medical record:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Medical record creation error:', error)
      throw error
    }
  },

  async updateMedicalRecord(id, updates) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating medical record:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Medical record update error:', error)
      throw error
    }
  },

  async deleteMedicalRecord(id) {
    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting medical record:', error)
        throw error
      }
    } catch (error) {
      console.error('Medical record deletion error:', error)
      throw error
    }
  },

  // Room operations
  async getRooms() {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number')
      
      if (error) {
        console.error('Error fetching rooms:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Rooms fetch error:', error)
      return []
    }
  },

  async createRoom(room) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating room:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Room creation error:', error)
      throw error
    }
  },

  async updateRoom(id, updates) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating room:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Room update error:', error)
      throw error
    }
  },

  async deleteRoom(id) {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting room:', error)
        throw error
      }
    } catch (error) {
      console.error('Room deletion error:', error)
      throw error
    }
  },

  async getRoomBookings(userId, role) {
    try {
      let query = supabase
        .from('room_bookings')
        .select(`
          *,
          patient:profiles!room_bookings_patient_id_fkey(full_name, email),
          room:rooms(room_number, room_type, daily_rate)
        `)

      if (role === 'patient') {
        query = query.eq('patient_id', userId)
      }

      const { data, error } = await query.order('check_in_date', { ascending: false })
      
      if (error) {
        console.error('Error fetching room bookings:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Room bookings fetch error:', error)
      return []
    }
  },

  async createRoomBooking(booking) {
    try {
      const { data, error } = await supabase
        .from('room_bookings')
        .insert(booking)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating room booking:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Room booking creation error:', error)
      throw error
    }
  },

  async updateRoomBooking(id, updates) {
    try {
      const { data, error } = await supabase
        .from('room_bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating room booking:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Room booking update error:', error)
      throw error
    }
  },

  async deleteRoomBooking(id) {
    try {
      const { error } = await supabase
        .from('room_bookings')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting room booking:', error)
        throw error
      }
    } catch (error) {
      console.error('Room booking deletion error:', error)
      throw error
    }
  },

  // Payment operations
  async getPayments(userId, role) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          patient:profiles!payments_patient_id_fkey(full_name, email)
        `)

      if (role === 'patient') {
        query = query.eq('patient_id', userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching payments:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Payments fetch error:', error)
      return []
    }
  },

  async createPayment(payment) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating payment:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Payment creation error:', error)
      throw error
    }
  },

  async updatePayment(id, updates) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating payment:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Payment update error:', error)
      throw error
    }
  },

  async deletePayment(id) {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting payment:', error)
        throw error
      }
    } catch (error) {
      console.error('Payment deletion error:', error)
      throw error
    }
  },

  // Messages operations
  async getMessages(userId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, role),
          recipient:profiles!messages_recipient_id_fkey(full_name, role)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching messages:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Messages fetch error:', error)
      return []
    }
  },

  async createMessage(message) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating message:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Message creation error:', error)
      throw error
    }
  },

  async markMessageAsRead(id) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error marking message as read:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Message update error:', error)
      throw error
    }
  },

  async deleteMessage(id) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting message:', error)
        throw error
      }
    } catch (error) {
      console.error('Message deletion error:', error)
      throw error
    }
  },

  // Nurse requests operations
  async getNurseRequests(userId, role) {
    try {
      let query = supabase
        .from('nurse_requests')
        .select(`
          *,
          patient:profiles!nurse_requests_patient_id_fkey(full_name, email, phone),
          nurse:profiles!nurse_requests_nurse_id_fkey(full_name, email, phone)
        `)

      if (role === 'patient') {
        query = query.eq('patient_id', userId)
      } else if (role === 'nurse') {
        query = query.or(`nurse_id.eq.${userId},nurse_id.is.null`)
      }

      const { data, error } = await query.order('requested_date', { ascending: true })
      
      if (error) {
        console.error('Error fetching nurse requests:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Nurse requests fetch error:', error)
      return []
    }
  },

  async createNurseRequest(request) {
    try {
      const { data, error } = await supabase
        .from('nurse_requests')
        .insert(request)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating nurse request:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Nurse request creation error:', error)
      throw error
    }
  },

  async updateNurseRequest(id, updates) {
    try {
      const { data, error } = await supabase
        .from('nurse_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating nurse request:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Nurse request update error:', error)
      throw error
    }
  },

  async deleteNurseRequest(id) {
    try {
      const { error } = await supabase
        .from('nurse_requests')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting nurse request:', error)
        throw error
      }
    } catch (error) {
      console.error('Nurse request deletion error:', error)
      throw error
    }
  },

  // Admin operations
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching all users:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Users fetch error:', error)
      return []
    }
  },

  // Get all doctors specifically
  async getAllDoctors() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('is_active', true)
        .order('full_name', { ascending: true })
      
      if (error) {
        console.error('Error fetching doctors:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Doctors fetch error:', error)
      return []
    }
  },

  // Get doctor by ID
  async getDoctorById(doctorId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', doctorId)
        .eq('role', 'doctor')
        .single()
      
      if (error) {
        console.error('Error fetching doctor:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Doctor fetch error:', error)
      throw error
    }
  },

  async getAuditLogs() {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          user:profiles(full_name, email, role)
        `)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) {
        console.error('Error fetching audit logs:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Audit logs fetch error:', error)
      return []
    }
  },

  // Statistics for dashboards
  async getDashboardStats(userId, role) {
    const stats = {}

    try {
      if (role === 'patient') {
        const [appointments, records, messages, payments] = await Promise.all([
          this.getAppointments(userId, role),
          this.getMedicalRecords(userId),
          this.getMessages(userId),
          this.getPayments(userId, role)
        ])

        stats.appointments = appointments.length
        stats.upcomingAppointments = appointments.filter(a => 
          new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled'
        ).length
        stats.medicalRecords = records.length
        stats.unreadMessages = messages.filter(m => 
          m.recipient_id === userId && !m.is_read
        ).length
        stats.pendingPayments = payments.filter(p => p.status === 'pending').length
      }

      if (role === 'doctor') {
        const [appointments, patients] = await Promise.all([
          this.getAppointments(userId, role),
          supabase.from('appointments').select('patient_id').eq('doctor_id', userId)
        ])

        stats.todayAppointments = appointments.filter(a => 
          new Date(a.appointment_date).toDateString() === new Date().toDateString()
        ).length
        stats.totalAppointments = appointments.length
        stats.uniquePatients = new Set(patients.data?.map(p => p.patient_id) || []).size
        stats.pendingAppointments = appointments.filter(a => a.status === 'pending').length
      }

      if (role === 'nurse') {
        const [requests, patients] = await Promise.all([
          this.getNurseRequests(userId, role),
          supabase.from('nurse_requests').select('patient_id').eq('nurse_id', userId)
        ])

        stats.activeRequests = requests.filter(r => r.status === 'in_progress').length
        stats.pendingRequests = requests.filter(r => r.status === 'pending').length
        stats.totalRequests = requests.length
        stats.uniquePatients = new Set(patients.data?.map(p => p.patient_id) || []).size
      }

      if (role === 'admin') {
        const [users, rooms, payments, activities] = await Promise.all([
          this.getAllUsers(),
          this.getRooms(),
          this.getPayments(userId, role),
          this.getAuditLogs()
        ])

        stats.totalUsers = users.length
        stats.activeUsers = users.filter(u => u.is_active).length
        stats.availableRooms = rooms.filter(r => r.status === 'available').length
        stats.totalRooms = rooms.length
        stats.pendingPayments = payments.filter(p => p.status === 'pending').length
        stats.recentActivities = activities.slice(0, 10)
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return stats
    }
  }
}