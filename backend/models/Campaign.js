const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  endDate: {
    type: Date,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaFiles: {
    type: [String], // Array of file paths
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
