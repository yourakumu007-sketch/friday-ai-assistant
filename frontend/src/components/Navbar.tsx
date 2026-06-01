import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, toggleSidebar } = useAppStore();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-700">
      <div className="container-md flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="gradient-text font-bold text-xl hidden sm:block">FRIDAY</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-dark-300">Welcome, {user?.username || 'User'}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-dark-700 p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 text-dark-300">Welcome, {user?.username || 'User'}</div>
              <button onClick={logout} className="btn-secondary w-full justify-center">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary w-full text-center block">
                Login
              </Link>
              <Link to="/register" className="btn-primary w-full text-center block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
