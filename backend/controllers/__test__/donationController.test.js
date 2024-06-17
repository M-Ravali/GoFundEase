const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const Donation = require('../../models/Donation');
const Campaign = require('../../models/Campaign');
const donationController = require('../donationController'); // Adjust the path as necessary
const httpMocks = require('node-mocks-http');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 }, // Single-node replica set
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Donation Controller', () => {
  describe('createDonation', () => {
    it('should create a donation and update campaign', async () => {
      const campaign = new Campaign({
        userId: new mongoose.Types.ObjectId(),
        contactEmail: 'contact@example.com',
        endDate: new Date(),
        goalAmount: 1000,
        description: 'Test Campaign Description',
        title: 'Test Campaign',
        currentAmount: 0
      });
      await campaign.save();

      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/donations',
        body: {
          donorPhone: '1234567890',
          amount: '100',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          campaignId: campaign._id.toString()
        },
        user: {
          _id: new mongoose.Types.ObjectId()
        }
      });

      const res = httpMocks.createResponse();
      await donationController.createDonation(req, res);
      const responseData = res._getJSONData();

      console.log('Response Data:', responseData); // Logging for debugging

      expect(res.statusCode).toBe(201);
      expect(responseData.message).toBe('Donation successful');
      expect(responseData.donation.donorName).toBe('John Doe');

      const updatedCampaign = await Campaign.findById(campaign._id);
      expect(updatedCampaign.currentAmount).toBe(100);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/donations',
        body: {
          donorPhone: '',
          amount: '',
          donorName: '',
          donorEmail: '',
          campaignId: ''
        },
        user: {
          _id: new mongoose.Types.ObjectId()
        }
      });

      const res = httpMocks.createResponse();
      await donationController.createDonation(req, res);
      const responseData = res._getJSONData();

      expect(res.statusCode).toBe(400);
      expect(responseData.message).toBe('All required fields must be filled out correctly');
    });

    it('should handle server error', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/donations',
        body: {
          donorPhone: '1234567890',
          amount: '100',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          campaignId: new mongoose.Types.ObjectId().toString()
        },
        user: {
          _id: new mongoose.Types.ObjectId()
        }
      });

      const res = httpMocks.createResponse();
      // Mock Donation.save to throw an error
      jest.spyOn(Donation.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await donationController.createDonation(req, res);
      const responseData = res._getJSONData();

      expect(res.statusCode).toBe(500);
      expect(responseData.message).toBe('Server error');
      expect(responseData.error).toBeDefined();
    });
  });

  describe('getUserDonations', () => {
    it('should return user donations', async () => {
      const userId = new mongoose.Types.ObjectId();
      const donation1 = new Donation({
        donorPhone: '1234567890',
        amount: 100,
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        campaignId: new mongoose.Types.ObjectId(),
        userId
      });
      const donation2 = new Donation({
        donorPhone: '0987654321',
        amount: 200,
        donorName: 'Jane Doe',
        donorEmail: 'jane@example.com',
        campaignId: new mongoose.Types.ObjectId(),
        userId
      });

      await donation1.save();
      await donation2.save();

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/donations',
        user: {
          id: userId.toString()
        }
      });

      const res = httpMocks.createResponse();
      await donationController.getUserDonations(req, res);
      const responseData = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(responseData.donations.length).toBe(2);
      expect(responseData.donations[0].donorName).toBe('John Doe');
      expect(responseData.donations[1].donorName).toBe('Jane Doe');
    });

    it('should handle server error', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/donations',
        user: {
          id: new mongoose.Types.ObjectId().toString()
        }
      });

      const res = httpMocks.createResponse();
      // Mock Donation.find to throw an error
      jest.spyOn(Donation, 'find').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await donationController.getUserDonations(req, res);
      const responseData = res._getJSONData();

      expect(res.statusCode).toBe(500);
      expect(responseData.message).toBe('Test error');
    });
  });
});
