import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center">
              <Activity className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                HealthCare
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Providing quality healthcare services and patient care management
              solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Services
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/appointments"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/room-booking"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Room Booking
                </Link>
              </li>
              <li>
                <Link
                  to="/nurse-requests"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Home Nursing
                </Link>
              </li>
              <li>
                <Link
                  to="/medical-records"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Medical Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a
                  href="mailto:info@patientportal.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  info@patientportal.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Healthcare Ave, Medical District
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              © 2025 Patient Portal. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-500 dark:text-gray-400 hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 dark:text-gray-400 hover:text-primary"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;