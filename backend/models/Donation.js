const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  }
});

module.exports = mongoose.model('Donation', DonationSchema);  
