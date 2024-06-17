const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Donation = require('../../models/Donation'); // Adjust the path to your Donation model

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

describe('Donation Model', () => {
  beforeEach(async () => {
    await Donation.deleteMany({});
  });

  test('should create a new donation', async () => {
    const donationData = {
      donorName: 'John Doe',
      donorEmail: 'john.doe@example.com',
      amount: 100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const donation = new Donation(donationData);
    const savedDonation = await donation.save();

    expect(savedDonation._id).toBeDefined();
    expect(savedDonation.donorName).toBe(donationData.donorName);
    expect(savedDonation.donorEmail).toBe(donationData.donorEmail);
    expect(savedDonation.amount).toBe(donationData.amount);
    expect(savedDonation.donorPhone).toBe(donationData.donorPhone);
    expect(savedDonation.campaignId.toString()).toBe(donationData.campaignId.toString());
    expect(savedDonation.userId.toString()).toBe(donationData.userId.toString());
  });

  test('should validate required fields', async () => {
    const donationData = new Donation({
      donorEmail: 'john.doe@example.com',
      amount: 100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    });

    try {
      await donationData.save();
    } catch (error) {
      expect(error.errors.donorName).toBeDefined();
    }
  });

  test('should not allow negative donation amount', async () => {
    const donationData = {
      donorName: 'John Doe',
      donorEmail: 'john.doe@example.com',
      amount: -100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const donation = new Donation(donationData);
    try {
      await donation.save();
    } catch (error) {
      expect(error.errors.amount).toBeDefined();
      expect(error.errors.amount.message).toBe('Path `amount` (-100) is less than minimum allowed value (0).');
    }
  });

  test('should update a donation', async () => {
    const donationData = {
      donorName: 'John Doe',
      donorEmail: 'john.doe@example.com',
      amount: 100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const donation = new Donation(donationData);
    const savedDonation = await donation.save();

    const updatedData = {
      donorName: 'Jane Doe',
      amount: 200,
    };

    const updatedDonation = await Donation.findByIdAndUpdate(savedDonation._id, updatedData, { new: true });

    expect(updatedDonation.donorName).toBe(updatedData.donorName);
    expect(updatedDonation.amount).toBe(updatedData.amount);
  });

  test('should delete a donation', async () => {
    const donationData = {
      donorName: 'John Doe',
      donorEmail: 'john.doe@example.com',
      amount: 100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const donation = new Donation(donationData);
    const savedDonation = await donation.save();

    await Donation.findByIdAndDelete(savedDonation._id);
    const deletedDonation = await Donation.findById(savedDonation._id);

    expect(deletedDonation).toBeNull();
  });
});
