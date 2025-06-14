import React, { useState } from "react";
import { Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Footer from "../components/common/Footer";

const Doctors = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      name_ar: "د. سارة جونسون",
      specialty: "Cardiologist",
      specialty_ar: "طبيب قلب",
      experience: "15 years",
      experience_ar: "15 سنة خبرة",
      rating: 4.9,
      reviews: 128,
      image:
        "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Mon, Wed, Fri",
      availability_ar: "الاثنين، الأربعاء، الجمعة",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      name_ar: "د. مايكل تشن",
      specialty: "Neurologist",
      specialty_ar: "طبيب أعصاب",
      experience: "12 years",
      experience_ar: "12 سنة خبرة",
      rating: 4.8,
      reviews: 96,
      image:
        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Tue, Thu, Sat",
      availability_ar: "الثلاثاء، الخميس، السبت",
    },
    {
      id: 3,
      name: "Dr. Emily Williams",
      name_ar: "د. إيميلي ويليامز",
      specialty: "Pediatrician",
      specialty_ar: "طبيب أطفال",
      experience: "10 years",
      experience_ar: "10 سنوات خبرة",
      rating: 4.9,
      reviews: 156,
      image:
        "https://images.pexels.com/photos/5214997/pexels-photo-5214997.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Mon, Tue, Thu",
      availability_ar: "الاثنين، الثلاثاء، الخميس",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      name_ar: "د. جيمس ويلسون",
      specialty: "Orthopedic Surgeon",
      specialty_ar: "جراح عظام",
      experience: "18 years",
      experience_ar: "18 سنة خبرة",
      rating: 4.7,
      reviews: 142,
      image:
        "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Wed, Fri, Sat",
      availability_ar: "الأربعاء، الجمعة، السبت",
    },
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      name_ar: "د. ليزا أندرسون",
      specialty: "Dermatologist",
      specialty_ar: "طبيب جلدية",
      experience: "8 years",
      experience_ar: "8 سنوات خبرة",
      rating: 4.8,
      reviews: 89,
      image:
        "https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Mon, Thu, Fri",
      availability_ar: "الاثنين، الخميس، الجمعة",
    },
    {
      id: 6,
      name: "Dr. Robert Martinez",
      name_ar: "د. روبرت مارتينيز",
      specialty: "General Physician",
      specialty_ar: "طبيب عام",
      experience: "14 years",
      experience_ar: "14 سنة خبرة",
      rating: 4.9,
      reviews: 167,
      image:
        "https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: "Tue, Wed, Sat",
      availability_ar: "الثلاثاء، الأربعاء، السبت",
    },
  ];

  const specialties = [
    { en: "All Specialties", ar: "جميع التخصصات" },
    { en: "Cardiologist", ar: "طبيب قلب" },
    { en: "Neurologist", ar: "طبيب أعصاب" },
    { en: "Pediatrician", ar: "طبيب أطفال" },
    { en: "Orthopedic Surgeon", ar: "جراح عظام" },
    { en: "Dermatologist", ar: "طبيب جلدية" },
    { en: "General Physician", ar: "طبيب عام" },
  ];

  // Filter doctors based on selected specialty
  const filteredDoctors =
    selectedSpecialty === "All Specialties"
      ? doctors
      : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

  const handleSpecialtyFilter = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                Our Doctors
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                Meet our team of experienced and dedicated healthcare
                professionals
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter by Specialty
            </h3>
            <div className="flex flex-wrap gap-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty.en}
                  onClick={() => handleSpecialtyFilter(specialty.en)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedSpecialty === specialty.en
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <span className="block">{specialty.en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>

                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                    {doctor.specialty}
                  </p>

                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {doctor.experience} experience
                  </p>

                  <div className="flex items-center mt-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-gray-900 dark:text-white font-medium">
                      {doctor.rating}
                    </span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5 mr-2" />
                    <div>
                      <span className="block">{doctor.availability}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Link
                      to={`/dashboard?section=appointments&doctor=${doctor.id}`}
                      className="flex-1 text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <span className="block">Book Appointment</span>
                    </Link>
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <span className="block">View Profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-xl mb-2">
                  No doctors found for this specialty
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Doctors;
