// controllers/volunteerController.js

const Volunteer = require('../models/volunteer');

exports.createVolunteer = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newVolunteer = await Volunteer.create({ name, email, subject, message });

        if (newVolunteer) {
            res.status(200).json({ message: 'Volunteer information saved', volunteer: newVolunteer });
        } else {
            res.status(400).json({ message: 'Invalid volunteer data' });
        }
    } catch (error) {
        console.error('Error creating volunteer:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
