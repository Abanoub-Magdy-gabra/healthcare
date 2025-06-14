import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for user data on initial load
  useEffect(() => {
    const isLoggedOut = localStorage.getItem("userLoggedOut");
    if (isLoggedOut === "true") {
      setUser(null);
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function that uses registered user data
  const login = (email, password) => {
    // Clear logout flag when logging in
    localStorage.removeItem("userLoggedOut");

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

   

    // Find user with matching email and password (case-insensitive email)
    const foundUser = registeredUsers.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );


    if (foundUser) {
      // Create authenticated user object
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isAuthenticated: true,
        loginAt: new Date().toISOString(),
        registeredAt: foundUser.registeredAt,
      };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      console.log("✅ Login successful:", authenticatedUser);
      return authenticatedUser;
    }

    // If no registered user found, try demo accounts for testing
    let demoUser = null;
    if (email.includes("patient")) {
      demoUser = { id: "demo1", name: "Demo Patient", email, role: "patient" };
    } else if (email.includes("doctor")) {
      demoUser = { id: "demo2", name: "Demo Doctor", email, role: "doctor" };
    } else if (email.includes("nurse")) {
      demoUser = { id: "demo3", name: "Demo Nurse", email, role: "nurse" };
    } else if (email.includes("admin")) {
      demoUser = { id: "demo4", name: "Demo Admin", email, role: "admin" };
    }

    if (demoUser) {
      localStorage.setItem("user", JSON.stringify(demoUser));
      setUser(demoUser);
      console.log("✅ Demo login successful:", demoUser);
      return demoUser;
    }

    // No user found
    console.log("❌ No user found for login");
    return null;
  };

  const register = (name, email, password, role = "patient") => {
    // Registration is now handled in the Register component
    // This function is kept for compatibility but doesn't auto-login
    return { success: true, message: "Registration completed" };
  };

  const logout = () => {
    // Mark user as logged out but keep user data for easy re-login
    localStorage.setItem("userLoggedOut", "true");
    setUser(null);
  };

  const forgotPassword = (email) => {
    // Mock forgot password functionality
    console.log(`Password reset initiated for ${email}`);
    // In a real app, this would send a reset email
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
