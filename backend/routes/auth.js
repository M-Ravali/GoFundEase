const express = require('express');
const { registerUser, authUser, getUserProfile, getUserDonations } = require('../controllers/authController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', getUserProfile);
router.get('/donations',  getUserDonations);

module.exports = router;