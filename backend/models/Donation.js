const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  donorPhone: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Donation", DonationSchema);