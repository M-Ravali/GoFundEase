const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const donationRouter = require('../donation'); // Adjust the path to your donationRoutes
const protect = require('../../middlewares/authMiddleware'); // Adjust the path to your authMiddleware
const { createDonation, getUserDonations } = require('../../controllers/donationController'); // Adjust the path to your donationController

const app = express();
app.use(express.json());
app.use('/api/donation', donationRouter);

jest.mock('../../middlewares/authMiddleware', () => jest.fn((req, res, next) => {
  req.user = { id: 'mockUserId' }; // Use a mock user ID
  next();
}));

jest.mock('../../controllers/donationController', () => ({
  createDonation: jest.fn((req, res) => res.status(201).json({ success: true })),
  getUserDonations: jest.fn((req, res) => res.status(200).json([]))
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Donation Routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('should create a new donation', async () => {
    const donationData = {
      donorName: 'John Doe',
      donorEmail: 'john@example.com',
      amount: 100,
      donorPhone: '1234567890',
      campaignId: new mongoose.Types.ObjectId() // Mock campaign ID for testing
    };

    const response = await request(app)
      .post('/api/donation/donate')
      .set('Authorization', 'Bearer mockToken') // Mock the Authorization header
      .send(donationData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(createDonation).toHaveBeenCalled();
  });


  test('should get user donations', async () => {
    const response = await request(app)
      .get('/api/donation/getuserdonations')
      .set('Authorization', 'Bearer mockToken') // Mock the Authorization header
      .expect(200);

    expect(response.body).toEqual([]);
    expect(getUserDonations).toHaveBeenCalled();
  });
});
