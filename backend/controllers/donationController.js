const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
    try {
        const { donationFrequency, amount, customAmount, donationName, donationEmail } = req.body;

        // Validate input
        if (!donationFrequency || (!amount && !customAmount) || !donationName || !donationEmail) {
            return res.status(400).json({ message: 'All required fields must be filled out correctly' });
        }

        const newDonation = new Donation({
            donationFrequency,
            amount,
            customAmount,
            donationName,
            donationEmail
        });

        await newDonation.save();
        res.status(201).json({ message: 'Donation successful', newDonation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
