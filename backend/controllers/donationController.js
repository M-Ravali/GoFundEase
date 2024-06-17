const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const mongoose = require("mongoose");
const { default: Stripe } = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a donation
exports.createDonation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { donorPhone, amount, donorName, donorEmail, campaignId } = req.body;

    const userId = req.user._id;
    // Validate input
    if (!amount || !donorName || !donorEmail || !donorPhone || !campaignId) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled out correctly" });
    }

    const newDonation = new Donation({
      donorPhone,
      amount,
      donorName,
      donorEmail,
      campaignId,
      userId
      
    });

    // Save the new donation
    await newDonation.save({ session });

    const donationAmount = parseInt(amount);
    // Update the campaign's current amount
    await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { currentAmount: donationAmount } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "Donation successful", donation: newDonation });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: "Server error", error });
  }
};


// donationController.js


exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id });
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  
};