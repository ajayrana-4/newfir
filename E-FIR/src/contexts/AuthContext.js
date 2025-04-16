import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../pages/firebase'; // Adjust the import path as necessary
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState(null);

  // Register with email/password
  const register = async (name, email, password, phone, aadhar) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user in MongoDB
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, {
        name,
        email,
        password,
        phone,
        aadhar,
        firebaseUid: userCredential.user.uid
      });
      
      setMongoUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Get user from MongoDB
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        email,
        password
      });
      
      setMongoUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get user info from Google account
      const { user } = result;
      const { displayName, email, uid, photoURL } = user;
      
      // Send to backend to create/update user in MongoDB
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/google-auth`, {
        name: displayName,
        email,
        firebaseUid: uid,
        photoUrl: photoURL
      });
      
      setMongoUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      
      // Check if profile needs completion
      if (response.data.user.profileComplete === false) {
        return { ...response.data, needsProfileCompletion: true };
      }
      
      return response.data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  // Complete profile for Google users
  const completeProfile = async (phone, aadhar) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/complete-profile`,
        { phone, aadhar },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMongoUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Profile completion error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setMongoUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is logged in with Firebase but no MongoDB user
      if (user && !mongoUser) {
        try {
          // Get token from localStorage
          const token = localStorage.getItem('token');
          
          if (token) {
            // Verify token and get user info
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/users/profile`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            
            setMongoUser(response.data);
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          // Clear token if invalid
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [mongoUser]);

  const value = {
    currentUser,
    mongoUser,
    register,
    login,
    signInWithGoogle,
    completeProfile,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};