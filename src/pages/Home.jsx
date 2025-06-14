import { Link } from "react-router-dom";
import {
  Activity,
  Calendar,
  FileText,
  Users,
  Building,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Star,
  Heart,
  CheckCircle,
  Phone,
  MapPin,
} from "lucide-react";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Footer from "../components/common/Footer";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Online Appointments",
      description:
        "Book and manage your appointments with our healthcare professionals online.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: FileText,
      title: "Digital Records",
      description:
        "Access your medical records and test results anytime, anywhere.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Users,
      title: "Home Nursing",
      description:
        "Request qualified nursing care in the comfort of your home.",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Building,
      title: "Room Booking",
      description: "Reserve hospital rooms and manage your stay efficiently.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const stats = [
    { icon: Users, label: "Happy Patients", value: "50,000+" },
    { icon: Award, label: "Expert Doctors", value: "200+" },
    { icon: Building, label: "Hospital Rooms", value: "150+" },
    { icon: Heart, label: "Years Experience", value: "25+" },
  ];

  const services = [
    { icon: Shield, title: "Emergency Care", desc: "24/7 emergency services" },
    { icon: Heart, title: "Cardiology", desc: "Expert heart care" },
    {
      icon: Activity,
      title: "General Medicine",
      desc: "Comprehensive health services",
    },
    { icon: Users, title: "Pediatrics", desc: "Specialized child care" },
  ];

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-fade-in-up">
                  <Heart className="h-4 w-4 mr-2" />
                  Trusted Healthcare Platform
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
                  Your Health,
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                    Our Priority
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl animate-fade-in-up animation-delay-400">
                  Access world-class healthcare services from the comfort of
                  your home. Book appointments, view medical records, and manage
                  your health journey all in one place.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in-up animation-delay-800">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative lg:block animate-fade-in-up animation-delay-400">
                <div className="relative">
                  {/* Big Healthcare Dashboard Card - Base Layer */}
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mx-8 my-8 z-0">
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-white mx-auto mb-4" />
                      <div className="text-white text-xl font-bold mb-2">
                        Healthcare Dashboard
                      </div>
                      <div className="text-blue-200">
                        All your health data in one place
                      </div>
                    </div>
                  </div>

                  {/* Small Floating Cards - Top Layer */}
                  <div className="absolute -top-8 -right-5 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-3 hover:rotate-6 transition-transform duration-300 z-20">
                    <Calendar className="h-8 w-8 text-white mb-2" />
                    <div className="text-white font-semibold">
                      Quick Booking
                    </div>
                    <div className="text-blue-200 text-sm">
                      Schedule appointments
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-3 hover:-rotate-6 transition-transform duration-300 z-20">
                    <Shield className="h-8 w-8 text-white mb-2" />
                    <div className="text-white font-semibold">
                      Secure Records
                    </div>
                    <div className="text-blue-200 text-sm">HIPAA Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4 mr-2" />
                Features
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to manage your health
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our comprehensive platform provides all the tools and services
                you need for complete healthcare management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${feature.bgColor} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border border-gray-100 dark:border-gray-700`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Medical Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Comprehensive healthcare services delivered by our expert
                medical professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                    <service.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  HIPAA Compliant
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is secure and protected
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Round-the-clock assistance
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Certified Professionals
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Expert healthcare providers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join thousands of patients who trust us with their healthcare
                needs. Start your journey today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </div>

              <div className="flex items-center justify-center text-blue-100 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Serving patients nationwide with world-class care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
