const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const donationController = require('../donationController');
const Donation = require('../../models/Donation');
const Campaign = require('../../models/Campaign');

describe('Donation Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        donorPhone: '1234567890',
        amount: 100,
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        campaignId: new mongoose.Types.ObjectId(),
      },
      user: {
        _id: new mongoose.Types.ObjectId()
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mongoose.startSession = jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe('createDonation', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {}; // Simulate missing required fields
      await donationController.createDonation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All required fields must be filled out correctly',
      });
    });

    it('should update campaign current amount', async () => {
      const campaignId = req.body.campaignId;
      mockingoose(Donation).toReturn({ _id: new mongoose.Types.ObjectId() }, 'save');
      mockingoose(Campaign).toReturn({ _id: campaignId, currentAmount: 500 }, 'findById');
      mockingoose(Campaign).toReturn({ _id: campaignId, currentAmount: 600 }, 'findByIdAndUpdate');

      await donationController.createDonation(req, res);

      const updatedCampaign = await Campaign.findById(campaignId);
    });
  });
});
