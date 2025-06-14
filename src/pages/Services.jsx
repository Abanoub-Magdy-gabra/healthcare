import React from "react";
import {
  Calendar,
  FileText,
  Users,
  Building,
  Heart,
  Activity,
  Stethoscope,
  Pill,
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Footer from "../components/common/Footer";

const Services = () => {
  const services = [
    {
      icon: Calendar,
      title: "Online Appointments",
        
      description:
        "Book and manage your medical appointments with our expert doctors online.",
    
    },
    {
      icon: FileText,
      title: "Medical Records",
      
      description:
        "Access and manage your complete medical history and test results securely.",
  
    },
    {
      icon: Users,
      title: "Home Nursing",
     
      description:
        "Professional nursing care services in the comfort of your home.",
     
    },
    {
      icon: Building,
      title: "Room Booking",
     
      description: "Reserve hospital rooms and manage your stay efficiently.",
     
    },
    {
      icon: Heart,
      title: "Emergency Care",
     
      description: "24/7 emergency medical services with rapid response teams.",
     
    },
    {
      icon: Activity,
      title: "Health Monitoring",
     
      description:
        "Regular health checkups and continuous monitoring of vital signs.",
     
    },
    {
      icon: Stethoscope,
      title: "Specialist Consultation",
     
      description:
        "Connect with specialized doctors for expert medical advice.",
     
    },
    {
      icon: Pill,
      title: "Pharmacy Services",
      description: "Online prescription management and medication delivery.",
    
    },
  ];

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                Our Services
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                Comprehensive healthcare services designed around your needs
              </p>

            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={`service-${index}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:transform hover:scale-105"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <IconComponent
                          className="h-8 w-8 text-blue-600 dark:text-blue-400"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>

                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {service.description}
                    </p>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
