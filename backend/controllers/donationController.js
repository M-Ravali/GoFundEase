const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
    try {
        const { donationFrequency, amount, customAmount, donationName, donationEmail, campaignId } = req.body;

        // Validate input
        if (!donationFrequency || (!amount && !customAmount) || !donationName || !donationEmail || ! campaignId) {
            return res.status(400).json({ message: 'All required fields must be filled out correctly' });
        }

        const newDonation = new Donation({
            donationFrequency,
            amount ,
            donorName ,
            donorEmail ,
            campaignId
        });

        await newDonation.save();
        res.status(201).json({ message: 'Donation successful', newDonation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
