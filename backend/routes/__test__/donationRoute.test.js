const request = require('supertest');
const express = require('express');
const router = require('../donation'); 
const donationController = require('../../controllers/donationController'); 
const authMiddleware = require('../../middlewares/authMiddleware'); 

jest.mock('../../controllers/donationController', () => ({
  createDonation: jest.fn(),
}));

jest.mock('../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next())); // Mock the authMiddleware

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
        donorEmail: 'john.doe@example.com',
        donorPhone: 1234567890,
        campaignId: '60c72b2f5f1b2c6d88f8e46b', // Provide a valid ObjectId
        userId: '60c72b2f5f1b2c6d88f8e46a' // Provide a valid ObjectId
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
    }, 15000); // Increase timeout to 15 seconds
  });
});
