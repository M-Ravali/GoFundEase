const mongoose = require('mongoose');
const Donation = require('../../models/Donation');

jest.setTimeout(60000); // 60 seconds timeout for all tests in this file

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://cdbcdb:Ravali12@cluster0.vmedk.mongodb.net/gofundease_db', {
    serverSelectionTimeoutMS: 60000 // 60 seconds timeout for server selection
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
});

afterEach(async () => {
  await Donation.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Donation Model Test Suite', () => {
  it('should throw validation errors if required fields are missing', async () => {
    const donation = new Donation();

    let err;
    try {
      await donation.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.donorName).toBeDefined();
    expect(err.errors.donorEmail).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.donorPhone).toBeDefined();
    expect(err.errors.campaignId).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('should default date to current date if not provided', async () => {
    const donation = new Donation({
      donorName: 'John Doe',
      donorEmail: 'john@example.com',
      amount: 50,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(), // Provide a valid ObjectId
      userId: new mongoose.Types.ObjectId()
    });

    await donation.save();

    expect(donation.date).toBeDefined();
    expect(donation.date).toBeInstanceOf(Date);
  });

  it('should store donation with valid data', async () => {
    const donation = new Donation({
      donorName: 'Jane Smith',
      donorEmail: 'jane@example.com',
      amount: 100,
      donorPhone: 1234567890,
      campaignId: new mongoose.Types.ObjectId(), // Provide a valid ObjectId
      userId: new mongoose.Types.ObjectId()
    });

    await donation.save();

    const savedDonation = await Donation.findOne({ donorEmail: 'jane@example.com' });

    expect(savedDonation).toBeDefined();
    expect(savedDonation.donorName).toBe('Jane Smith');
    expect(savedDonation.donorEmail).toBe('jane@example.com');
    expect(savedDonation.amount).toBe(100);
    expect(savedDonation.donorPhone).toBe(1234567890);
  });

  it('should not store donation with missing required fields', async () => {
    const donation = new Donation({
      donorName: 'Invalid Donation',
      donorEmail: 'invalid@example.com',
      amount: 200,
      donorPhone: 1234567890,
      // campaignId is missing
      userId: new mongoose.Types.ObjectId()
    });

    let err;
    try {
      await donation.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.campaignId).toBeDefined();
  });
});
