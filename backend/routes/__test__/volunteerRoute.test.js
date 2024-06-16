const request = require('supertest');
const express = require('express');
const router = require('../volunteer');
const volunteerController = require('../../controllers/volunteerController');

jest.mock('../../controllers/volunteerController', () => ({
  createVolunteer: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Volunteer Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should create a new volunteer', async () => {
      const mockVolunteerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        availability: ['Monday', 'Wednesday'],
      };

      const mockVolunteer = {
        _id: 'mockId',
        name: mockVolunteerData.name,
        email: mockVolunteerData.email,
        phone: mockVolunteerData.phone,
        availability: mockVolunteerData.availability,
      };

      volunteerController.createVolunteer.mockImplementation((req, res) => {
        // Simulate saving to database or any other logic
        return res.status(201).json(mockVolunteer);
      });

      const response = await request(app)
        .post('/')
        .send(mockVolunteerData)
        .expect(201);

      expect(response.body).toEqual(mockVolunteer);
    });
  });
});
