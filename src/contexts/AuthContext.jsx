import { createContext, useContext, useState, useEffect } from "react";
import { supabase, dbService } from "../lib/supabase.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
    } catch (error) {
      console.error('Error getting initial session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (authUser) => {
    try {
      const profile = await dbService.getProfile(authUser.id);
      setUser(authUser);
      setProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(authUser);
      setProfile(null);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData) => {
    try {
      setLoading(true);
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const profileData = {
          id: authData.user.id,
          email,
          full_name: userData.name,
          role: userData.role || 'patient',
          phone: userData.phone || null,
          date_of_birth: userData.dateOfBirth || null,
          address: userData.address || null,
        };

        await dbService.createProfile(profileData);
      }

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = await dbService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      return { profile: updatedProfile, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { profile: null, error: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user: profile ? { ...user, ...profile } : user,
    profile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};