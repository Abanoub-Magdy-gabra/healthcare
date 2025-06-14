import React, { useState, useEffect } from "react";
import { Star, Calendar, MapPin, Phone, Mail, Clock, Award, Users, Search, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { dbService } from "../lib/supabase.js";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Footer from "../components/common/Footer";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterOpen, setFilterOpen] = useState(false);

  // Available specialties for filtering
  const specialties = [
    "All Specialties",
    "Cardiologist",
    "Neurologist", 
    "Pediatrician",
    "Orthopedic Surgeon",
    "Dermatologist",
    "General Physician",
    "Emergency Medicine",
    "Psychiatrist",
    "Radiologist",
    "Anesthesiologist",
    "Oncologist"
  ];

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      // Get all users with doctor role
      const allUsers = await dbService.getAllUsers();
      const doctorUsers = allUsers.filter(user => user.role === 'doctor' && user.is_active);
      
      // Transform doctor data and add mock data for missing fields
      const doctorsWithMockData = doctorUsers.map(doctor => ({
        ...doctor,
        // Add mock data for fields that might be missing
        rating: doctor.rating || (4.5 + Math.random() * 0.4), // Random rating between 4.5-4.9
        reviews: doctor.reviews || Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
        image: doctor.avatar_url || `https://images.pexels.com/photos/${getRandomDoctorImage()}/pexels-photo-${getRandomDoctorImage()}.jpeg?auto=compress&cs=tinysrgb&w=300`,
        availability: doctor.availability || getRandomAvailability(),
        consultation_fee: doctor.consultation_fee || (100 + Math.random() * 200), // Random fee $100-300
        languages: doctor.languages || ['English', 'Arabic'],
        education: doctor.education || getMockEducation(doctor.specialization),
        hospital_affiliations: doctor.hospital_affiliations || ['HealthCare Medical Center', 'City General Hospital'],
        next_available: getNextAvailableSlot(),
        specialization: doctor.specialization || 'General Physician',
        experience_years: doctor.experience_years || Math.floor(Math.random() * 20) + 5,
        bio: doctor.bio || `Dr. ${doctor.full_name} is a highly experienced ${doctor.specialization || 'physician'} with ${doctor.experience_years || 10}+ years of practice.`
      }));

      setDoctors(doctorsWithMockData);
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Fallback to mock data if database fails
      setDoctors(getMockDoctors());
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mock data
  const getRandomDoctorImage = () => {
    const imageIds = [5452293, 2379005, 5214997, 5452201, 5214995, 5452291, 6749778, 6749779];
    return imageIds[Math.floor(Math.random() * imageIds.length)];
  };

  const getRandomAvailability = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDays = days.sort(() => 0.5 - Math.random()).slice(0, 3);
    return selectedDays.join(', ');
  };

  const getMockEducation = (specialization) => {
    const educations = {
      'Cardiologist': 'MD - Cardiology, Harvard Medical School',
      'Neurologist': 'MD - Neurology, Johns Hopkins University',
      'Pediatrician': 'MD - Pediatrics, Stanford University',
      'Orthopedic Surgeon': 'MD - Orthopedic Surgery, Mayo Clinic',
      'Dermatologist': 'MD - Dermatology, UCLA Medical School',
      'General Physician': 'MD - Internal Medicine, University of Pennsylvania',
      'Emergency Medicine': 'MD - Emergency Medicine, NYU School of Medicine',
      'Psychiatrist': 'MD - Psychiatry, Columbia University',
      'Radiologist': 'MD - Radiology, University of Chicago',
      'Anesthesiologist': 'MD - Anesthesiology, Duke University',
      'Oncologist': 'MD - Oncology, Memorial Sloan Kettering'
    };
    return educations[specialization] || 'MD - General Medicine, Medical University';
  };

  const getNextAvailableSlot = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const hours = [9, 10, 11, 14, 15, 16];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    tomorrow.setHours(randomHour, 0, 0, 0);
    return tomorrow;
  };

  const getMockDoctors = () => [
    {
      id: 1,
      full_name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      experience_years: 15,
      rating: 4.9,
      reviews: 128,
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Mon, Wed, Fri",
      consultation_fee: 250,
      languages: ['English', 'Arabic'],
      education: 'MD - Cardiology, Harvard Medical School',
      hospital_affiliations: ['HealthCare Medical Center', 'Heart Institute'],
      next_available: getNextAvailableSlot(),
      bio: "Dr. Sarah Johnson is a leading cardiologist with 15+ years of experience in treating heart conditions.",
      phone: '+1-555-0002',
      email: 'dr.johnson@healthcareportal.com'
    },
    {
      id: 2,
      full_name: "Dr. Michael Chen",
      specialization: "Neurologist",
      experience_years: 12,
      rating: 4.8,
      reviews: 96,
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Tue, Thu, Sat",
      consultation_fee: 200,
      languages: ['English', 'Chinese', 'Arabic'],
      education: 'MD - Neurology, Johns Hopkins University',
      hospital_affiliations: ['HealthCare Medical Center', 'Neurology Institute'],
      next_available: getNextAvailableSlot(),
      bio: "Dr. Michael Chen specializes in neurological disorders with expertise in brain and nervous system conditions.",
      phone: '+1-555-0003',
      email: 'dr.chen@healthcareportal.com'
    }
  ];

  // Filter and search logic
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialization === selectedSpecialty;
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.full_name.localeCompare(b.full_name);
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience_years - a.experience_years;
      case 'fee':
        return a.consultation_fee - b.consultation_fee;
      default:
        return 0;
    }
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <PublicNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading doctors...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Meet Our Expert Doctors
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Connect with our team of experienced and dedicated healthcare professionals
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{doctors.length}+</div>
                  <div className="text-blue-200">Expert Doctors</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{specialties.length - 1}</div>
                  <div className="text-blue-200">Specializations</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-blue-200">Available Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Specialty Filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center justify-between w-full lg:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedSpecialty}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => {
                          setSelectedSpecialty(specialty);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                          selectedSpecialty === specialty 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="fee">Sort by Fee</option>
              </select>
            </div>

            {/* Active Filters */}
            {(selectedSpecialty !== "All Specialties" || searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedSpecialty !== "All Specialties" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {selectedSpecialty}
                    <button
                      onClick={() => setSelectedSpecialty("All Specialties")}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {sortedDoctors.length} of {doctors.length} doctors
              {selectedSpecialty !== "All Specialties" && ` in ${selectedSpecialty}`}
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                {/* Doctor Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                      ${Math.round(doctor.consultation_fee)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Available
                    </span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {doctor.full_name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {doctor.specialization}
                    </p>
                  </div>

                  {/* Rating and Experience */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-900 dark:text-white font-medium">
                        {doctor.rating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400 text-sm">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Award className="h-4 w-4 mr-1" />
                      {doctor.experience_years} years
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{doctor.availability}</span>
                  </div>

                  {/* Next Available */}
                  <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Next: {formatDate(doctor.next_available)}</span>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.languages.map((language, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {language}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard?section=appointments&doctor=${doctor.id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      Book Appointment
                    </Link>
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {sortedDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No doctors found</h3>
                <p className="mb-4">
                  {searchTerm 
                    ? `No doctors match your search "${searchTerm}"`
                    : `No doctors found for ${selectedSpecialty}`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSpecialty("All Specialties");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Can't find the right doctor?
            </h2>
            <p className="text-blue-100 mb-6">
              Contact our support team and we'll help you find the perfect healthcare provider for your needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Doctors;