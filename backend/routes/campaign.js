const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const protect = require('../middlewares/authMiddleware');
const { createCampaign, getAllCampiagns, getCampaign } = require('../controllers/campaignController');
const multer = require('multer');


// @route   POST api/campaign
// @desc    Create a campaign
// @access  Private
// Multer setup for file uploads
// Multer setup for file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
  });

  // POST request for creating a new campaign
  router.post(
    '/',
    protect, // Ensure protect middleware runs first for authentication
    upload.array('mediaFiles', 10), // Handle mediaFiles upload (up to 10 files)
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('goalAmount', 'Goal amount is required and should be a number').isNumeric(),
      check('endDate', 'End Date is required and should be a valid date').isISO8601().toDate(),
      check('contactEmail', 'Contact Email is required and should be a valid email').isEmail(),
    ],
    createCampaign
  );

router.get("/all", getAllCampiagns);
router.get('/:id', getCampaign );

module.exports = router;
