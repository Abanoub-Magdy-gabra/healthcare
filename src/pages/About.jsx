import React from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';
import PublicNavbar from '../components/navigation/PublicNavbar';
import Footer from '../components/common/Footer';

const About = () => {
  return (
    <>
    <PublicNavbar />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              About Patient Portal
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Dedicated to providing exceptional healthcare services and innovative patient care solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10k+</div>
              <div className="text-gray-600 dark:text-gray-400">Patients Served</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Expert Doctors</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Available Support</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400">
                To provide accessible, high-quality healthcare services through innovative technology solutions, 
                ensuring every patient receives personalized care and attention while maintaining the highest 
                standards of medical excellence.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400">
                To become the leading healthcare platform that transforms the way patients access and 
                experience healthcare services, creating a seamless connection between healthcare providers 
                and patients worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Leadership Team</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Meet the dedicated professionals leading our healthcare innovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Johnson',
                role: 'Chief Medical Officer',
                image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300'
              },
              {
                name: 'Michael Chen',
                role: 'Chief Technology Officer',
                image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300'
              },
              {
                name: 'Dr. Emily Williams',
                role: 'Head of Patient Care',
                image: 'https://images.pexels.com/photos/5214997/pexels-photo-5214997.jpeg?auto=compress&cs=tinysrgb&w=300'
              }
            ].map((member) => (
              <div key={member.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <img
                  className="w-full h-64 object-cover"
                  src={member.image}
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
      </>
  );
};

export default About;