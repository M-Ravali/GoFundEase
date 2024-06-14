const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaign');
const stripeRoutes = require('./routes/stripe');
const donationRoutes = require('./routes/donation');
const cors = require('cors');
const http = require('http');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/donations', donationRoutes);


// Middleware to serve static files (like your HTML, CSS, and JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle reset password link
app.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  // Render the reset password page, passing the token if necessary
  res.sendFile(path.join(__dirname, '../frontend', 'helper', 'charity', 'resetpassword.html'));
});
  

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 8080;  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
