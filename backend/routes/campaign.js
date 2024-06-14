const express = require('express');
const router = express.Router();
const { check} = require('express-validator');
const protect = require('../middlewares/authMiddleware');
const { createCampaign, getAllCampiagns, getCampaign } = require('../controllers/campaignController');
const upload = require('../middlewares/uploadMiddleware');


// @route   POST api/campaign
// @desc    Create a campaign
// @access  Private


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
