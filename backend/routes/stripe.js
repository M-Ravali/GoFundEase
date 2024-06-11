const express = require('express');
const { body } = require('express-validator');
const { createPaymentIntent } = require('../controllers/stripeController');
const router = express.Router();

// @route    POST /api/stripe/create-payment-intent
// @desc     Create a payment intent
// @access   Private
router.post(
    '/create-payment-intent',
    [
        body('amount').isInt({ min: 1 })
    ],
    createPaymentIntent
);

module.exports = router;


