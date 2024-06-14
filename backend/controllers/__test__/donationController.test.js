const request = require('supertest');
const { app, server } = require('../index.js'); 
const mongoose = require('mongoose');
const Donation = require('../models/Donation.js'); 

describe('Donation Controller', () => {
  // Clean up the database before and after tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close(); // Close the server
  });

  afterEach(async () => {
    await Donation.deleteMany({});
  });

  describe('POST /api/donations/donate', () => {
    it('should create a donation successfully', async () => {
      const donationData = {
        donationFrequency: 'One Time',
        amount: 50,
        donationName: 'John Doe',
        donationEmail: 'john.doe@example.com'
      };

      const res = await request(app)
        .post('/api/donations/donate')
        .send(donationData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Donation successful');
      expect(res.body.donation).toHaveProperty('_id');
      expect(res.body.donation).toHaveProperty('donationFrequency', 'One Time');
      expect(res.body.donation).toHaveProperty('amount', 50);
      expect(res.body.donation).toHaveProperty('donationName', 'John Doe');
      expect(res.body.donation).toHaveProperty('donationEmail', 'john.doe@example.com');
    });

    it('should return a 400 error if required fields are missing', async () => {
      const donationData = {
        amount: 50,
        donationName: 'John Doe',
        donationEmail: 'john.doe@example.com'
      };

      const res = await request(app)
        .post('/api/donations/donate')
        .send(donationData);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'All required fields must be filled out correctly'
      });
    });

    it('should return a 500 error if server error occurs', async () => {
      jest.spyOn(Donation.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Server error');
      });  

      const donationData = {
        donationFrequency: 'One Time',
        amount: 50,
        donationName: 'John Doe',
        donationEmail: 'john.doe@example.com'
      };

      const res = await request(app)
        .post('/api/donations/donate')
        .send(donationData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'Server error',
        error: expect.any(Object)
      });
    });
  });
});
