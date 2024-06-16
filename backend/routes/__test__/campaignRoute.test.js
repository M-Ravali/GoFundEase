const request = require('supertest');
const express = require('express');
const { validationResult } = require('express-validator');
const router = require('../campaign');

// Mock controllers and middlewares
jest.mock('../../controllers/campaignController', () => ({
  createCampaign: jest.fn(),
  getAllCampiagns: jest.fn(),
  getCampaign: jest.fn(),
}));

jest.mock('../../middlewares/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => next()), // Mock protect middleware to just call next()
}));

jest.mock('../../middlewares/uploadMiddleware', () => ({
  array: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Campaign Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe('POST /api/campaign', () => {
    it('should create a new campaign', async () => {
      // Mock data for the request body
      const campaignData = {
        title: 'Test Campaign',
        description: 'This is a test campaign',
        goalAmount: 1000,
        endDate: '2024-12-31', // Assuming ISO 8601 date format
        contactEmail: 'test@example.com',
      };

      // Mock request to simulate the file upload
      const mockFiles = [
        { originalname: 'file1.jpg', path: '/mock/path/file1.jpg' },
        { originalname: 'file2.jpg', path: '/mock/path/file2.jpg' },
      ];

      // Mock express-validator validationResult
      validationResult.mockReturnValue({ isEmpty: () => true });

      // Mock controller function
      const { createCampaign } = require('../controllers/campaignController');
      createCampaign.mockImplementation((req, res) => {
        // Simulate response from controller
        res.status(200).json({ message: 'Campaign created successfully', campaignId: '123' });
      });

      // Perform POST request
      const response = await request(app)
        .post('/api/campaign')
        .field('title', campaignData.title)
        .field('description', campaignData.description)
        .field('goalAmount', campaignData.goalAmount)
        .field('endDate', campaignData.endDate)
        .field('contactEmail', campaignData.contactEmail)
        .attach('mediaFiles', mockFiles[0].path)
        .attach('mediaFiles', mockFiles[1].path)
        .expect(200);

      // Assertions
      expect(createCampaign).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Campaign created successfully');
      expect(response.body).toHaveProperty('campaignId', '123');
    });
  });

  describe('GET /api/campaign/all', () => {
    it('should get all campaigns', async () => {
      // Mock controller function
      const { getAllCampiagns } = require('../../controllers/campaignController');
      getAllCampiagns.mockImplementation((req, res) => {
        // Simulate response from controller
        res.status(200).json([{ id: '1', title: 'Campaign 1' }, { id: '2', title: 'Campaign 2' }]);
      });

      // Perform GET request
      const response = await request(app)
        .get('/api/campaign/all')
        .expect(200);

      // Assertions
      expect(getAllCampiagns).toHaveBeenCalled();
      expect(response.body.length).toBe(2); // Assuming two campaigns are returned
    });
  });

  describe('GET /api/campaign/:id', () => {
    it('should get a specific campaign by ID', async () => {
      const campaignId = '123';

      // Mock controller function
      const { getCampaign } = require('../../controllers/campaignController');
      getCampaign.mockImplementation((req, res) => {
        // Simulate response from controller
        res.status(200).json({ id: campaignId, title: 'Test Campaign' });
      });

      // Perform GET request
      const response = await request(app)
        .get(`/api/campaign/${campaignId}`)
        .expect(200);

      // Assertions
      expect(getCampaign).toHaveBeenCalledWith(expect.objectContaining({ params: { id: campaignId } }));
      expect(response.body).toHaveProperty('id', campaignId);
      expect(response.body).toHaveProperty('title', 'Test Campaign');
    });
  });
});
