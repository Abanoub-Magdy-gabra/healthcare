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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

      {/* Auth Routes */}

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        {/* Dashboard routing based on user role */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : user.role === "patient" ? (
              <PatientDashboard />
            ) : user.role === "doctor" ? (
              <DoctorDashboard />
            ) : user.role === "nurse" ? (
              <NurseDashboard />
            ) : user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
