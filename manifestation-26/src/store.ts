import { create } from 'zustand';

// --- API URL CONFIGURATION ---
// Automatically switches between Localhost and Production (Render)
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://manifestation-26.onrender.com/api'; // <--- REPLACE THIS WITH YOUR ACTUAL RENDER URL LATER

export type Category = 'Career' | 'Health' | 'Mindset' | 'Wealth' | 'Relationships' | 'Identity';

export interface Affirmation {
  _id: string; // MongoDB uses _id, not id
  text: string;
  category: Category;
  completed: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  affirmations: Affirmation[];
  activeCategory: Category | 'All';
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  fetchAffirmations: () => Promise<void>;
  addAffirmation: (text: string, category: Category) => Promise<void>;
  toggleAffirmation: (id: string) => Promise<void>;
  deleteAffirmation: (id: string) => Promise<void>;
  setCategory: (category: Category | 'All') => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  affirmations: [],
  activeCategory: 'All',
  isLoading: false,
  error: null,

  setCategory: (category) => set({ activeCategory: category }),

  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, error: null });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, error: null });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, affirmations: [] });
  },

  fetchAffirmations: async () => {
    const { token } = get();
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/affirmations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) set({ affirmations: data });
    } catch (err) {
      console.error(err);
    }
  },

  addAffirmation: async (text, category) => {
    const { token, affirmations } = get();
    if (!token) return;

    // Optimistic Update (Show it immediately before server confirms)
    const tempId = Math.random().toString();
    const tempAffirmation = { _id: tempId, text, category, completed: false };
    set({ affirmations: [tempAffirmation, ...affirmations] });

    try {
      const res = await fetch(`${API_URL}/affirmations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text, category }),
      });
      const data = await res.json();
      
      // Replace temp item with real item from DB
      set((state) => ({
        affirmations: state.affirmations.map(a => a._id === tempId ? data : a)
      }));
    } catch (err) {
      // Revert if failed
      set({ affirmations });
    }
  },

  toggleAffirmation: async (id) => {
    const { token, affirmations } = get();
    if (!token) return;

    // Optimistic Update
    set({
      affirmations: affirmations.map(a => a._id === id ? { ...a, completed: !a.completed } : a)
    });

    await fetch(`${API_URL}/affirmations/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deleteAffirmation: async (id) => {
    const { token, affirmations } = get();
    if (!token) return;

    // Optimistic Update
    set({ affirmations: affirmations.filter(a => a._id !== id) });

    await fetch(`${API_URL}/affirmations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}));