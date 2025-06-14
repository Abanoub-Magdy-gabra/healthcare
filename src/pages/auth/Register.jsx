import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  Mail,
  Lock,
  User,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Shield,
  Users,
  Check,
} from "lucide-react";

// Add this test function - can be called from browser console
window.testRegistration = () => {
  const testUser = {
    id: Date.now(),
    name: "Test User",
    email: "test@example.com",
    password: "test123",
    role: "patient",
    registeredAt: new Date().toISOString(),
    isVerified: false,
  };

  const existingUsers = JSON.parse(
    localStorage.getItem("registeredUsers") || "[]"
  );
  existingUsers.push(testUser);
  localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

  console.log("🧪 Test user added:", testUser);
  console.log("📋 All users after test:", existingUsers);
  console.log(
    "📦 localStorage content:",
    localStorage.getItem("registeredUsers")
  );

  return "✅ Test completed - check console logs";
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Store registration data for later login confirmation
      const registrationData = {
        id: Date.now(),
        name,
        email,
        password, // In real app, this would be hashed
        role,
        registeredAt: new Date().toISOString(),
        isVerified: false,
      };

      // Store registered users in localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      // Check if user already exists
      const userExists = existingUsers.find((user) => user.email === email);
      if (userExists) {
        setError("An account with this email already exists");
        return;
      }

      // Add new user to registered users
      existingUsers.push(registrationData);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

     

      // Double-check that data was stored
      const storedUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
    

      // Show success message and redirect to login
      alert(
        "Account created successfully! Please login to confirm your account."
      );
      navigate("/login");
    } catch (err) {
      setError("Failed to create an account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "patient",
      label: "Patient",
      description: "Access personal health records and appointments",
    },
    {
      value: "nurse",
      label: "Nurse",
      description: "Manage patient care and medical records",
    },
    {
      value: "doctor",
      label: "Doctor",
      description: "Full access to patient management and diagnosis",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Left side - Enhanced Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('img/register.jpg')`,
          }}
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-800/80 to-cyan-700/70" />

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-emerald-400/20 blur-lg animate-pulse delay-1000" />

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
              Join Our
              <span className="block text-emerald-300">
                Healthcare Community
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Create your account to access personalized healthcare services and
              manage your health journey with cutting-edge medical technology.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-gray-200">
                  Advanced Security & Privacy
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-gray-200">Multi-Role Access Control</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-gray-200">
                  Comprehensive Health Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join our healthcare community today
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
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Role
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    <option value="">Select your role </option>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {role && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {roleOptions.find((opt) => opt.value === role)?.description}
                  </p>
                )}
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
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {password && confirmPassword && (
                  <div
                    className={`mt-2 flex items-center text-xs ${
                      password === confirmPassword
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 mr-1 ${
                        password === confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>
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
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:border-primary dark:hover:border-primary"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
