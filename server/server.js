require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Log environment variables (safely)
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

// Import AI routes only (now at root)
const aiRoutes = require('./aiRoutes');

// Create Express app
const app = express();

// CORS configuration - allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', aiRoutes); // Mount AI routes directly under /api

app.get('/', (req, res) => {
  res.json({ message: 'RTI Auto Generator Backend (AI Only)' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`RTI Auto Generator Backend (AI Only) is running on port ${PORT}`);
}); 