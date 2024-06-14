const express = require('express');
const router = express.Router();
const donationController = require('../controllers/DonationController');

router.post('/donate', donationController.createDonation);

module.exports = router;
