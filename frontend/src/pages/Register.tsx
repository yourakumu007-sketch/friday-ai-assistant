import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password, formData.language);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-2xl">
          <h1 className="text-3xl font-bold gradient-text text-center mb-2">FRIDAY</h1>
          <p className="text-dark-400 text-center mb-8">Create your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-dark-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-dark-500" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-dark-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-dark-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-dark-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-dark-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••���•"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-dark-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-dark-500" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-dark-300 mb-2">Preferred Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="input-field"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
