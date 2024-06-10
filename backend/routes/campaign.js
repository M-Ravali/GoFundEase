const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const protect = require('../middlewares/authMiddleware');
const { createCampaign } = require('../controllers/campaignController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// @route   POST api/campaign
// @desc    Create a campaign
// @access  Private
router.post(
    '/',
    [
        // protect,
        upload.array('mediaFiles', 10), // Adjust the max number of files
        [
            check('title', 'Title is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('goalAmount', 'Goal amount is required and should be a number').isNumeric(),
            check('endDate', 'End Date is required and should be a valid date').isDate(),
            check('contactEmail', 'Contact Email is required and should be a valid email').isEmail()
        ]
    ],
    createCampaign
);

module.exports = router;
