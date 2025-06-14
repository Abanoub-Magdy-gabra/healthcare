import { createContext, useContext, useState, useEffect } from "react";
import { supabase, dbService } from "../lib/supabase.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    let authSubscription = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (!mounted) return;

            try {
              if (session?.user) {
                await loadUserProfile(session.user);
              } else {
                setUser(null);
                setProfile(null);
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
            }
          }
        );

        authSubscription = subscription;

      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array

  const loadUserProfile = async (authUser) => {
    try {
      let profile = await dbService.getProfile(authUser.id);
      
      // If no profile exists, create a default one
      if (!profile) {
        console.log('No profile found, creating default profile for user:', authUser.email);
        const defaultProfile = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          role: 'patient', // Default role
        };
        
        profile = await dbService.createProfile(defaultProfile);
      }
      
      setUser(authUser);
      setProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set user even if profile fails to load
      setUser(authUser);
      setProfile(null);
    } finally {
      setLoading(false);
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
      
      console.log('Starting registration process with userData:', userData);
      
      // Sign up the user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role // Store role in user metadata as backup
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('User created successfully, now creating profile with role:', userData.role);
        
        // Create profile immediately with the exact role provided
        const profileData = {
          id: authData.user.id,
          email,
          full_name: userData.name,
          role: userData.role, // Use the exact role from userData
          phone: userData.phone || null,
          date_of_birth: userData.dateOfBirth || null,
          address: userData.address || null,
        };

        console.log('Creating profile with data:', profileData);

        // Use direct Supabase call to ensure the role is set correctly
        const { data: createdProfile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        console.log('Profile created successfully:', createdProfile);
        
        // Verify the profile was created with the correct role
        const { data: verifyProfile, error: verifyError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (verifyError) {
          console.error('Profile verification error:', verifyError);
        } else {
          console.log('Profile verification - role is:', verifyProfile.role);
        }
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