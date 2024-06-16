const request = require('supertest');
const express = require('express');
const router = require('../profile'); // Adjust the path as per your project structure
const profileController = require('../../controllers/profileController'); // Adjust the path as per your project structure

jest.mock('../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next())); // Mock authMiddleware
jest.mock('../../controllers/profileController', () => ({
  getAllUsers: jest.fn(),
  getUserProfile: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /allUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { username: 'user1', email: 'user1@example.com' },
        { username: 'user2', email: 'user2@example.com' },
      ];

      profileController.getAllUsers.mockImplementation((req, res) => {
        res.status(200).json(mockUsers);
      });

      const response = await request(app)
        .get('/allUsers')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('GET /profile', () => {
    it('should fetch user profile when authenticated', async () => {
      const mockUserProfile = {
        username: 'testuser',
        email: 'testuser@example.com',
        bio: 'Sample bio',
      };

      profileController.getUserProfile.mockImplementation((req, res) => {
        res.status(200).json(mockUserProfile);
      });

      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer validToken')
        .expect(200);

      expect(response.body).toEqual(mockUserProfile);
    });
  });
});
