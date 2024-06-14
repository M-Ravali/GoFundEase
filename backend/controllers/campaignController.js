const { validationResult } = require("express-validator");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
// const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, goalAmount, endDate, contactEmail } = req.body;
  const mediaFiles = req.files ? req.files.map(file => file.path) : [];
  const userId = req.user.id; // Retrieve userId from req.user

  try {
    const newCampaign = new Campaign({
      userId,
      title,
      description,
      goalAmount,
      currentAmount: 0, // Initialize currentAmount
      endDate,
      contactEmail,
      mediaFiles,
    });

    const campaign = await newCampaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// Fetch all campaigns
exports.getAllCampiagns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch a single campaign by ID
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



// Donate to a campaign
exports.donateToCampaign = async (req, res) => {
  const { campaignId, amount, donorName } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const newDonation = new Donation({
      campaignId,
      amount,
      donorName,
    });

    await newDonation.save();

    campaign.currentAmount += amount;
    await campaign.save();

    // Emit real-time update
    const io = req.app.get("socketio");
    io.emit("campaignUpdated", campaign); // Notify all connected clients about the update

    res.status(200).json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Export donations as CSV

// exports.exportDonations = async (req, res) => {
//   try {
//     const donations = await Donation.find().lean();
//     const csvWriter = createObjectCsvWriter({
//       path: path.join(__dirname, "..", "donations.csv"),
//       header: [
//         { id: "donorName", title: "Donor Name" },
//         { id: "amount", title: "Amount" },
//         { id: "date", title: "Date" },
//         { id: "campaignId", title: "Campaign ID" },
//       ],
//     });

//     await csvWriter.writeRecords(donations);
//     await csvWriter.writeRecords(donations);

//     res.download(path.join(__dirname, "..", "donations.csv"));
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Error exporting donations");
//   }
// };

// donationController.js


exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id });
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  
};


