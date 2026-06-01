import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.username, formData.password);
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
          <p className="text-dark-400 text-center mb-8">Sign in to your account</p>

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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
