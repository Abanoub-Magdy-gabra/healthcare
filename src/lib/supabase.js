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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async createProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Appointments operations
  async getAppointments(userId, role) {
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
    
    if (error) throw error
    return data
  },

  async createAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateAppointment(id, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Medical records operations
  async getMedicalRecords(patientId) {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:profiles!medical_records_doctor_id_fkey(full_name, specialization)
      `)
      .eq('patient_id', patientId)
      .order('record_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createMedicalRecord(record) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Room operations
  async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number')
    
    if (error) throw error
    return data
  },

  async getRoomBookings(userId, role) {
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
    
    if (error) throw error
    return data
  },

  async createRoomBooking(booking) {
    const { data, error } = await supabase
      .from('room_bookings')
      .insert(booking)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Payment operations
  async getPayments(userId, role) {
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
    
    if (error) throw error
    return data
  },

  async createPayment(payment) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePayment(id, updates) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Messages operations
  async getMessages(userId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, role),
        recipient:profiles!messages_recipient_id_fkey(full_name, role)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createMessage(message) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async markMessageAsRead(id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Nurse requests operations
  async getNurseRequests(userId, role) {
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
    
    if (error) throw error
    return data
  },

  async createNurseRequest(request) {
    const { data, error } = await supabase
      .from('nurse_requests')
      .insert(request)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateNurseRequest(id, updates) {
    const { data, error } = await supabase
      .from('nurse_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Admin operations
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getAuditLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:profiles(full_name, email, role)
      `)
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    return data
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
        stats.uniquePatients = new Set(patients.data?.map(p => p.patient_id)).size
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
        stats.uniquePatients = new Set(patients.data?.map(p => p.patient_id)).size
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