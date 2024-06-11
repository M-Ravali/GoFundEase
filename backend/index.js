const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaign');
const stripeRoutes = require('./routes/stripe');
const donationRoutes = require('./routes/donation');
const cors = require('cors');

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

  
const PORT = process.env.PORT || 6000;  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));             