const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donationFrequency: {
        type: String,
        enum: ['One Time', 'Monthly'],
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    customAmount: {
        type: Number,
        required: false
    },
    donationName: {
        type: String,
        required: true
    },
    donationEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure that either amount or customAmount is provided
DonationSchema.path('amount').validate(function(value) {
    return value != null || this.customAmount != null;
}, 'Either amount or customAmount must be provided');

module.exports = mongoose.model('Donation', DonationSchema);
