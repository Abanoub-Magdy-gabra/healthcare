import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useTheme } from "./contexts/ThemeContext.jsx";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Doctors from "./pages/Doctors.jsx";
import Contact from "./pages/Contact.jsx";

// Auth Pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// Dashboard Pages
import PatientDashboard from "./pages/dashboard/PatientDashboard.jsx";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard.jsx";
import NurseDashboard from "./pages/dashboard/NurseDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";

function App() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Update document body with theme class
    document.body.className =
      theme === "dark" ? "dark bg-gray-900" : "bg-gray-50";
  }, [theme]);

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes - redirect if already logged in */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected Dashboard Route */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === "patient" ? (
              <PatientDashboard />
            ) : user.role === "doctor" ? (
              <DoctorDashboard />
            ) : user.role === "nurse" ? (
              <NurseDashboard />
            ) : user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;