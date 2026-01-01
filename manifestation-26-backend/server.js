require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Affirmation } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// --- PRODUCTION CORS SETUP ---

// 1. Parse the Environment Variable into a clean list
const envOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : [];

// 2. Combine defaults (localhost) with your Env URLs
const allowedOrigins = [
  "http://localhost:3000",                  // React Localhost
  "http://localhost:5173",                  // Vite Localhost
  ...envOrigins                             // Adds both Vercel & Custom Domain
];

console.log("✅ Allowed Origins:", allowedOrigins); // Debug log to see what's allowed

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 Blocked by CORS:", origin); 
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Middleware ---
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🌌 Cosmic Database Connected'))
  .catch(err => console.error('Connection Error:', err));

// --- Security Middleware (The Bouncer) ---
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Issue Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ 
        token, 
        user: { id: user._id, name: user.name, email: user.email } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET AFFIRMATIONS (User Specific)
app.get('/api/affirmations', protect, async (req, res) => {
  try {
    // Only find affirmations belonging to the logged-in user
    const affirmations = await Affirmation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(affirmations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching affirmations' });
  }
});

// 4. ADD AFFIRMATION
app.post('/api/affirmations', protect, async (req, res) => {
  try {
    const { text, category } = req.body;
    const affirmation = await Affirmation.create({
      userId: req.user.id,
      text,
      category
    });
    res.status(201).json(affirmation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating affirmation' });
  }
});

// 5. TOGGLE COMPLETE
app.put('/api/affirmations/:id', protect, async (req, res) => {
  try {
    const affirmation = await Affirmation.findById(req.params.id);

    if (!affirmation) return res.status(404).json({ message: 'Not found' });
    
    // Ensure user owns this affirmation
    if (affirmation.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    affirmation.completed = !affirmation.completed;
    await affirmation.save();
    res.json(affirmation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. DELETE AFFIRMATION
app.delete('/api/affirmations/:id', protect, async (req, res) => {
  try {
    const affirmation = await Affirmation.findById(req.params.id);

    if (!affirmation) return res.status(404).json({ message: 'Not found' });

    // Ensure user owns this affirmation
    if (affirmation.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await affirmation.deleteOne();
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Portal Active on port ${PORT}`));