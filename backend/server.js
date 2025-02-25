const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Routes
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
