const request = require('supertest');
const express = require('express');
const router = require('../donation'); // Adjust the path as per your project structure
const donationController = require('../../controllers/DonationController'); // Adjust the path as per your project structure

jest.mock('../../controllers/DonationController', () => ({
  createDonation: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Donation Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /donate', () => {
    it('should create a new donation', async () => {
      const donationData = {
        amount: 100,
        donorName: 'John Doe',
        email: 'john.doe@example.com',
      };

      const mockDonationId = 'abc123'; // Mock donation ID returned by controller

      donationController.createDonation.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Donation created successfully', donationId: mockDonationId });
      });

      const response = await request(app)
        .post('/donate')
        .send(donationData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Donation created successfully');
      expect(response.body).toHaveProperty('donationId', mockDonationId);
    });
  });
});
