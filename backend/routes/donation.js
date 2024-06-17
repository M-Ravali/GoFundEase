const express = require('express');
const { createDonation } = require('../controllers/donationController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/donate', protect, createDonation);

module.exports = router;