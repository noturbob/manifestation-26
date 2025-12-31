const mongoose = require('mongoose');

// --- 1. User Blueprint ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// --- 2. Affirmation Blueprint ---
const affirmationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Career', 'Health', 'Mindset', 'Wealth', 'Relationships', 'Identity'],
    default: 'Mindset' 
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Affirmation = mongoose.model('Affirmation', affirmationSchema);

module.exports = { User, Affirmation };