const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Donation = require('../../models/Donation');
const { createDonation } = require('../donationController');

jest.mock('../../models/Donation');

const app = express();
app.use(bodyParser.json());
app.post('/donations', createDonation);

describe('createDonation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new donation successfully', async () => {
        const newDonation = {
            donationFrequency: 'monthly',
            amount: 50,
            customAmount: null,
            donationName: 'John Doe',
            donationEmail: 'john@example.com'
        };

        // Mock the save method to resolve with the donation object
        Donation.prototype.save.mockResolvedValue(newDonation);

        const response = await request(app)
            .post('/donations')
            .send(newDonation);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Donation successful');
        expect(Donation.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if required fields are missing', async () => {
        const invalidDonation = {
            donationFrequency: 'monthly',
            amount: null,
            customAmount: null,
            donationName: 'John Doe',
            donationEmail: 'john@example.com'
        };

        const response = await request(app)
            .post('/donations')
            .send(invalidDonation);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All required fields must be filled out correctly');
        expect(Donation.prototype.save).not.toHaveBeenCalled();
    });

    it('should return 500 if there is a server error', async () => {
        const validDonation = {
            donationFrequency: 'monthly',
            amount: 50,
            customAmount: null,
            donationName: 'John Doe',
            donationEmail: 'john@example.com'
        };

        Donation.prototype.save.mockRejectedValue(new Error('Server error'));

        const response = await request(app)
            .post('/donations')
            .send(validDonation);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
        expect(Donation.prototype.save).toHaveBeenCalledTimes(1);
    });
});
