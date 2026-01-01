import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Check, Trash2, Sparkles, Layers, Heart, Brain, Briefcase, 
  Wallet, Zap, LogOut, Menu, X 
} from 'lucide-react';
import { useStore, Category, Affirmation } from './store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const AmbientBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-cosmic-900 pointer-events-none">
    <div className="absolute inset-0 z-[1] bg-noise opacity-20 mix-blend-overlay"></div>
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1], 
        opacity: [0.3, 0.5, 0.3], 
        rotate: [0, 90, 0] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cosmic-accent rounded-full blur-[120px] opacity-30 mix-blend-screen"
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1], 
        opacity: [0.2, 0.4, 0.2],
        x: [0, 100, 0]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cosmic-cyan rounded-full blur-[100px] opacity-20 mix-blend-screen"
    />
  </div>
);

const TiltCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className={cn(
        "relative group rounded-2xl border border-glass-border bg-glass-100 backdrop-blur-xl shadow-2xl transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
};

const CategoryPill = ({ label, icon: Icon, active, onClick }: { label: string, icon: any, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-glass-200 border border-glass-300 shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
        : "hover:bg-glass-100 border border-transparent hover:border-glass-border"
    )}
  >
    <div className={cn("p-2 rounded-lg transition-colors", active ? "bg-cosmic-accent/20 text-white" : "bg-glass-100 text-gray-400 group-hover:text-white")}>
      <Icon size={18} />
    </div>
    <span className={cn("font-medium tracking-wide text-sm", active ? "text-white" : "text-gray-400 group-hover:text-gray-200")}>
      {label}
    </span>
    {active && (
      <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-cosmic-accent rounded-r-full" />
    )}
  </button>
);

const AffirmationItem = ({ item }: { item: Affirmation }) => {
  const toggle = useStore(s => s.toggleAffirmation);
  const remove = useStore(s => s.deleteAffirmation);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="mb-4"
    >
      <TiltCard className={cn(
        "overflow-hidden cursor-pointer",
        item.completed ? "border-cosmic-gold/30 bg-cosmic-gold/5" : "hover:border-cosmic-accent/30"
      )}>
        <div 
          className="p-6 flex items-start gap-4 relative z-10" 
          onClick={() => toggle(item._id)} 
        >
          <div className={cn(
            "mt-1 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500",
            item.completed 
              ? "bg-cosmic-gold border-cosmic-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]" 
              : "border-gray-500 group-hover:border-white/50"
          )}>
            {item.completed && <Check size={14} className="text-black stroke-[4px]" />}
          </div>

          <div className="flex-1">
            <p className={cn(
              "text-lg md:text-xl font-light leading-relaxed transition-all duration-500",
              item.completed ? "text-cosmic-gold line-through decoration-cosmic-gold/50" : "text-white"
            )}>
              {item.text}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                {item.category}
              </span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); remove(item._id); }} 
            className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-gold/10 to-transparent transition-transform duration-1000",
          item.completed ? "translate-x-0" : "-translate-x-full"
        )} />
      </TiltCard>
    </motion.div>
  );
};

// --- Main Layout ---

export default function Dashboard() {
  const navigate = useNavigate();
  const { affirmations, activeCategory, setCategory, addAffirmation, fetchAffirmations, logout, user } = useStore();
  
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState<Category>('Mindset');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for mobile menu

  // 1. Fetch Data on Mount & Check Auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchAffirmations();
    }
  }, [navigate, fetchAffirmations]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryClick = (id: Category | 'All') => {
    setCategory(id);
    setIsSidebarOpen(false); // Close sidebar on mobile when category selected
  };

  const filteredAffirmations = activeCategory === 'All' 
    ? affirmations 
    : affirmations.filter(a => a.category === activeCategory);

  const categories: { id: Category | 'All', icon: any }[] = [
    { id: 'All', icon: Layers },
    { id: 'Identity', icon: Sparkles },
    { id: 'Career', icon: Briefcase },
    { id: 'Wealth', icon: Wallet },
    { id: 'Health', icon: Heart },
    { id: 'Mindset', icon: Brain },
    { id: 'Relationships', icon: Zap },
  ];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await addAffirmation(inputText, inputCategory);
    setInputText('');
  };

  return (
    <div className="min-h-screen font-sans text-white selection:bg-cosmic-accent selection:text-white flex flex-col md:flex-row">
      <AmbientBackground />

      {/* --- Mobile Header (Visible only on small screens) --- */}
      <div className="md:hidden flex items-center justify-between p-6 sticky top-0 z-40 bg-cosmic-900/80 backdrop-blur-xl border-b border-glass-border">
        <h1 className="text-xl font-light tracking-tight text-white/90 flex gap-2">
          2026 <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-cyan to-cosmic-accent">Manifest</span>
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-glass-200 rounded-lg text-white active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- Sidebar Navigation (Drawer on Mobile, Sticky on Desktop) --- */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 h-screen w-[280px] md:w-80 p-6 z-50",
          "bg-cosmic-900/95 md:bg-glass-100/30 backdrop-blur-2xl md:backdrop-blur-md",
          "border-r border-glass-border shadow-2xl md:shadow-none",
          "transition-transform duration-300 ease-in-out",
          // Mobile transform logic:
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="mb-10 pt-4 px-2 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-white/90 hidden md:block">
                2026 <span className="block font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-cyan to-cosmic-accent">Manifest</span>
              </h1>
              {/* Mobile Sidebar Title */}
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-cyan to-cosmic-accent md:hidden">
                Menu
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Welcome back, {user?.name?.split(' ')[0] || 'Architect'}.
              </p>
            </div>
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <CategoryPill 
                key={cat.id} 
                label={cat.id} 
                icon={cat.icon} 
                active={activeCategory === cat.id} 
                onClick={() => handleCategoryClick(cat.id)} 
              />
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t border-glass-border mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 text-gray-400 group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-medium tracking-wide text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 relative z-10 min-h-screen overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-20 overflow-y-auto h-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight mb-4">
              {activeCategory} <span className="text-gray-600">Timeline</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cosmic-accent to-transparent rounded-full" />
          </motion.div>

          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 relative z-30"
          >
            <form onSubmit={handleAdd} className={cn(
              "relative rounded-2xl transition-all duration-500",
              isInputFocused ? "shadow-[0_0_40px_rgba(124,58,237,0.2)]" : ""
            )}>
              <div className="absolute inset-0 bg-glass-200 backdrop-blur-2xl rounded-2xl border border-glass-300" />
              <div className="relative p-2 flex flex-col md:flex-row items-center gap-4">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="I am becoming..."
                  className="w-full bg-transparent border-none text-lg md:text-xl p-4 text-white placeholder-white/20 focus:ring-0 outline-none font-light"
                />
                
                <div className="flex items-center gap-2 w-full md:w-auto px-4 md:px-0 pb-2 md:pb-0">
                  <select 
                    value={inputCategory}
                    onChange={(e) => setInputCategory(e.target.value as Category)}
                    className="flex-1 md:flex-none bg-glass-200 text-sm border-none rounded-lg py-3 px-3 text-gray-300 focus:ring-0 cursor-pointer hover:bg-glass-300 transition-colors outline-none"
                  >
                    {categories.filter(c => c.id !== 'All').map(c => (
                      <option key={c.id} value={c.id} className="bg-cosmic-900">{c.id}</option>
                    ))}
                  </select>
                  <button 
                    type="submit"
                    className="p-3 bg-white text-cosmic-900 rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          <div className="space-y-6 pb-20">
            <AnimatePresence mode="popLayout">
              {filteredAffirmations.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-500 font-light"
                >
                  <p>The canvas of 2026 is blank. Begin writing.</p>
                </motion.div>
              ) : (
                filteredAffirmations.map((item) => (
                  <AffirmationItem key={item._id} item={item} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}