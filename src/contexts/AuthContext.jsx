import { createContext, useContext, useState, useEffect } from "react";
import { supabase, dbService } from "../lib/supabase.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Demo accounts configuration
const DEMO_ACCOUNTS = [
  {
    email: 'admin@healthcareportal.com',
    password: 'admin123',
    name: 'Healthcare Admin',
    role: 'admin',
    phone: '+1-555-0101',
    department: 'Administration'
  },
  {
    email: 'dr.johnson@healthcareportal.com',
    password: 'doctor123',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1-555-0102',
    department: 'Cardiology',
    specialization: 'Cardiology',
    license_number: 'MD-12345',
    experience_years: 15
  },
  {
    email: 'nurse.davis@healthcareportal.com',
    password: 'nurse123',
    name: 'Emily Davis',
    role: 'nurse',
    phone: '+1-555-0103',
    department: 'Emergency',
    license_number: 'RN-67890',
    experience_years: 8
  },
  {
    email: 'john.smith@email.com',
    password: 'patient123',
    name: 'John Smith',
    role: 'patient',
    phone: '+1-555-0104',
    date_of_birth: '1985-06-15',
    address: '123 Main St, Anytown, USA',
    emergency_contact: 'Jane Smith',
    emergency_phone: '+1-555-0105'
  }
];

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
        console.log('No profile found, creating default profile for user:', authUser.id);
        profile = await dbService.createProfile({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          role: authUser.user_metadata?.role || 'patient'
        });
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

      if (error) {
        // Check if this is a demo account that needs to be auto-registered
        if (error.message.includes('Invalid login credentials')) {
          const demoAccount = DEMO_ACCOUNTS.find(account => 
            account.email.toLowerCase() === email.toLowerCase()
          );
          
          if (demoAccount && password === demoAccount.password) {
            console.log('Demo account not found, attempting auto-registration for:', email);
            
            try {
              // Auto-register the demo account
              const { user: registeredUser, error: registerError } = await register(
                demoAccount.email,
                demoAccount.password,
                {
                  name: demoAccount.name,
                  role: demoAccount.role,
                  phone: demoAccount.phone,
                  dateOfBirth: demoAccount.date_of_birth,
                  address: demoAccount.address,
                  emergencyContact: demoAccount.emergency_contact,
                  emergencyPhone: demoAccount.emergency_phone,
                  department: demoAccount.department,
                  specialization: demoAccount.specialization,
                  licenseNumber: demoAccount.license_number,
                  experienceYears: demoAccount.experience_years
                }
              );

              if (registerError) {
                throw new Error(`Failed to auto-register demo account: ${registerError}`);
              }

              if (registeredUser) {
                console.log('Demo account registered successfully, attempting login again');
                
                // Wait a moment for the registration to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Retry login after successful registration
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email,
                  password,
                });

                if (retryError) {
                  throw new Error(`Login failed after auto-registration: ${retryError.message}`);
                }

                return { user: retryData.user, error: null };
              }
            } catch (autoRegisterError) {
              console.error('Auto-registration failed:', autoRegisterError);
              throw new Error(`Demo account setup failed: ${autoRegisterError.message}`);
            }
          }
        }

        // Provide more specific error messages for non-demo accounts
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
        }
        
        throw new Error(errorMessage);
      }

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
          emergency_contact: userData.emergencyContact || null,
          emergency_phone: userData.emergencyPhone || null,
          department: userData.department || null,
          license_number: userData.licenseNumber || null,
          specialization: userData.specialization || null,
          experience_years: userData.experienceYears || null,
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
      console.log('Logging out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      // Clear user state immediately
      setUser(null);
      setProfile(null);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      setUser(null);
      setProfile(null);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      console.log('Updating profile with:', updates);
      
      const updatedProfile = await dbService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      
      console.log('Profile updated successfully:', updatedProfile);
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