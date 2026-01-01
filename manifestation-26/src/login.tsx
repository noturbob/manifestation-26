import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from './store';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Background included here for simplicity
const AmbientBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-cosmic-900 pointer-events-none">
    <div className="absolute inset-0 z-[1] bg-noise opacity-20 mix-blend-overlay"></div>
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cosmic-accent rounded-full blur-[120px] opacity-30 mix-blend-screen"
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2], x: [0, 100, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cosmic-cyan rounded-full blur-[100px] opacity-20 mix-blend-screen"
    />
  </div>
);

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // 1. Local State for Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  // 2. Get Actions from Store
  const { login, register, error } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Call API based on mode
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }

    // 4. Navigate only on success
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans text-white overflow-hidden">
      <AmbientBackground />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          {/* UPDATED LOGO SECTION */}
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: 'spring' }}
            // CHANGED: "flex justify-center" forces absolute centering
            className="flex justify-center mb-8"
          >
            <img 
              src="/pngwing.com.png" 
              alt="Logo" 
              className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(124,58,237,0.6)]" 
            />
          </motion.div>

          <h1 className="text-4xl font-light tracking-tight mb-2">
            Manifest <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-cyan to-cosmic-accent">2026</span>
          </h1>
          <p className="text-gray-400">Identify yourself to access the timeline.</p>
        </motion.div>

        <motion.div
          layout
          className="bg-glass-100 backdrop-blur-2xl border border-glass-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            {/* Glossy sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Toggle Switch */}
            <div className="flex bg-glass-300 rounded-xl p-1 mb-8 relative">
                <motion.div 
                    layoutId="active-tab"
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-glass-300 rounded-lg shadow-sm border border-white/10 ${isLogin ? 'left-1' : 'right-1'}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
                <button 
                    onClick={() => { setIsLogin(true); setName(''); setPassword(''); setEmail(''); }}
                    className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors ${isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => { setIsLogin(false); setName(''); setPassword(''); setEmail(''); }}
                    className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Message Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-xl flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="relative group mb-4">
                                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-cosmic-cyan transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-glass-100 border border-glass-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan/50 focus:bg-glass-200 transition-all"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-cosmic-cyan transition-colors" size={18} />
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-glass-100 border border-glass-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan/50 focus:bg-glass-200 transition-all"
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-cosmic-cyan transition-colors" size={18} />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-glass-100 border border-glass-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan/50 focus:bg-glass-200 transition-all"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-cyan text-white font-bold py-3 rounded-xl mt-6 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span>{isLogin ? 'Login' : 'Signup'}</span>
                    <ArrowRight size={18} />
                </button>
            </form>
        </motion.div>
      </div>
    </div>
  );
}