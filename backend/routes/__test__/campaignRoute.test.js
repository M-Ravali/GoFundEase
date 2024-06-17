const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const campaignRouter = require('../campaign'); // Adjust the path to your campaignRoutes
const protect = require('../../middlewares/authMiddleware'); // Adjust the path to your authMiddleware
const upload = require('../../middlewares/uploadMiddleware'); // Adjust the path to your uploadMiddleware
const { createCampaign, getAllCampiagns, getCampaign } = require('../../controllers/campaignController'); // Adjust the path to your campaignController

const app = express();
app.use(express.json());
app.use('/api/campaign', campaignRouter);

jest.mock('../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../../middlewares/uploadMiddleware', () => ({
  array: () => (req, res, next) => next()
}));
jest.mock('../../controllers/campaignController', () => ({
  createCampaign: jest.fn((req, res) => res.status(201).json({ success: true })),
  getAllCampiagns: jest.fn((req, res) => res.status(200).json([])),
  getCampaign: jest.fn((req, res) => res.status(200).json({}))
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

describe('Campaign Routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('should create a new campaign', async () => {
    const campaignData = {
      title: 'New Campaign',
      description: 'Campaign Description',
      goalAmount: 1000,
      endDate: '2024-12-31',
      contactEmail: 'contact@example.com'
    };

    const response = await request(app)
      .post('/api/campaign')
      .send(campaignData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(createCampaign).toHaveBeenCalled();
  });

  test('should get all campaigns', async () => {
    const response = await request(app)
      .get('/api/campaign/all')
      .expect(200);

    expect(response.body).toEqual([]);
    expect(getAllCampiagns).toHaveBeenCalled();
  });

  test('should get a single campaign', async () => {
    const campaignId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/campaign/${campaignId}`)
      .expect(200);

    expect(response.body).toEqual({});
    expect(getCampaign).toHaveBeenCalled();
  });
});
