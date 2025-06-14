import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Shield,
  Users,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Check for admin credentials first
    if (
      email.toLowerCase() === "admin@healthcareportal.com" &&
      password === "Admin@2024!"
    ) {
      try {
        setLoading(true);

        // Create admin user object directly
        const adminUser = {
          id: "admin001",
          name: "System Administrator",
          email: "admin@healthcareportal.com",
          role: "admin",
          isAuthenticated: true,
          loginAt: new Date().toISOString(),
        };

        // Store admin user in localStorage
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.removeItem("userLoggedOut");

        // Redirect to admin dashboard
        window.location.href = "/admin-dashboard";
        return;
      } catch (err) {
        setError("Failed to log in as admin");
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);

      const user = login(email, password);
      if (user) {
        // Check if user is admin and redirect accordingly
        if (user.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          // Navigate to regular dashboard
          window.location.href = "/";
        }
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (err) {
      setError("Failed to log in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Left side - Enhanced Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')`,
          }}
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-cyan-800/80 to-teal-700/70" />

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-cyan-400/20 blur-lg animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white h-full">
          <div className="max-w-lg">
            {/* Logo/Brand */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">HealthCare Portal</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome Back
              <span className="block text-cyan-300">to Your Health</span>
            </h1>

            {/* Description */}
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Your health journey continues here. Access your personalized
              healthcare portal with secure, comprehensive medical services.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                <span className="text-gray-200">Secure & HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                <span className="text-gray-200">24/7 Healthcare Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                <span className="text-gray-200">Personalized Care Plans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Access your healthcare dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-200 rounded-md animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Try: patient@example.com, doctor@example.com,
                  nurse@example.com
                </p>
               
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  New to Healthcare Portal?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:border-primary dark:hover:border-primary"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
