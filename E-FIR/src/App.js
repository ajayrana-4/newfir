import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EnquiryPage from './pages/EnquiryPage';
import RegisterFIRPage from './pages/RegisterFIRPage';
import FIREnquiryPage from './pages/FIREnquiryPage';
import MYFIRsPage from './pages/MYFIRsPage';
import FIRDetailsPage from './pages/FIRDetailsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  
  // Check for stored user on app load
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate that the user object has the expected structure
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Invalid user structure, clear localStorage
          console.warn('Invalid user data structure in localStorage');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Set loading to false after checking authentication
  }, []);
  
  // Login function with fixed user data structure
  const login = (userData) => {
    // Extract just the user object and token from the response
    const userToStore = {
      ...(userData.user || {}),  // Spread the user properties if it exists
      token: userData.token  // Add token directly to user object
    };
    
    console.log('Storing user data:', userToStore);
    
    // Store the proper structure
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    setIsAuthenticated(true);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user function for profile changes
  const updateUser = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      // Show loading indicator while checking authentication
      return <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Add debugging to monitor user state changes
  useEffect(() => {
    console.log("Authentication state changed:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  if (loading) {
    // Show loading indicator while checking authentication
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage user={user} logout={logout} />} />
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/register" element={<RegisterPage login={login} />} />
        <Route path="/enquiry" element={<EnquiryPage user={user} logout={logout} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/register-fir" 
          element={
            <ProtectedRoute>
              <RegisterFIRPage user={user} logout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fir-enquiry" 
          element={
            <ProtectedRoute>
              <FIREnquiryPage user={user} logout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-firs" 
          element={
            <ProtectedRoute>
              <MYFIRsPage user={user} logout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fir-details/:id" 
          element={
            <ProtectedRoute>
              <FIRDetailsPage user={user} logout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage user={user} logout={logout} updateUser={updateUser} />
            </ProtectedRoute>
          } 
        />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;