const express = require("express");
const {
  registerUser,
  authUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

// const { getUserProfile } = require("../controllers/authController");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { getUserDonations } = require("../controllers/donationController");
const { protect } = require("../middlewares/authMiddleware"); // assuming you have a middleware to protect routes

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/donations", protect, getUserDonations);

module.exports = router;
