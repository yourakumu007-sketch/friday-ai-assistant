import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/appStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-dark-100">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
