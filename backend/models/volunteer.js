const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: false }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
