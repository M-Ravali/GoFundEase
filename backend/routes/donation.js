const express = require('express');
const { createDonation, getUserDonations } = require('../controllers/donationController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/donate', protect, createDonation);
router.get('/getuserdonations', protect, getUserDonations);

module.exports = router;