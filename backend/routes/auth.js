const express = require("express");
const {
  registerUser,
  authUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");



const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { getUserDonations } = require("../controllers/DonationController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);
// router.get("/donations", protect, getUserDonations);

module.exports = router;