// routes/users.js (example structure)
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as per your project structure
const protect = require("../middlewares/authMiddleware");
const { getUserProfile, getAllUsers } = require("../controllers/profileController");

// Route to fetch all users
router.get("/allUsers", getAllUsers);

router.get('/profile', protect, getUserProfile);


module.exports = router;