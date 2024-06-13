// models/Donation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        enum: ['One Time', 'Monthly'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Donation', DonationSchema);
