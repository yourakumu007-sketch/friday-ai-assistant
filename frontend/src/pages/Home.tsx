import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Mic } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Control FRIDAY with natural voice conversation',
    },
    {
      icon: Zap,
      title: 'Smart Tasks',
      description: 'Create and manage tasks with intelligent prioritization',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
      {/* Hero Section */}
      <section className="container-md py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Meet FRIDAY
          </h1>
          <p className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto">
            Your AI personal assistant inspired by Tony Stark's JARVIS. Manage tasks, reminders, and get instant answers with voice commands.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="glass p-8 rounded-3xl">
            <div className="bg-dark-800 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-dark-500 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-lg">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container-md py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Powerful Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl hover:shadow-lg hover:shadow-primary-500/20 transition-all"
              >
                <Icon className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-md py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6 gradient-text">Ready to get started?</h2>
          <p className="text-dark-400 mb-8 text-lg">Join thousands of users using FRIDAY to boost their productivity</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Create Free Account <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
