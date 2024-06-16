// __tests__/donation.test.js

const mongoose = require('mongoose');
const Donation = require('../../models/Donation');

jest.setTimeout(60000); // 60 seconds timeout for all tests in this file

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://cdbcdb:Ravali12@cluster0.vmedk.mongodb.net/<your-database-name>', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.frequency).toBeDefined();
  });

  it('should default date to current date if not provided', async () => {
    const donation = new Donation({
      name: 'John Doe',
      email: 'john@example.com',
      amount: 50,
      frequency: 'One Time'
    });

    await donation.save();

    expect(donation.date).toBeDefined();
    expect(donation.date).toBeInstanceOf(Date);
  });

  it('should store donation with valid frequency', async () => {
    const donation = new Donation({
      name: 'Jane Smith',
      email: 'jane@example.com',
      amount: 100,
      frequency: 'Monthly'
    });

    await donation.save();

    const savedDonation = await Donation.findOne({ email: 'jane@example.com' });

    expect(savedDonation.frequency).toBe('Monthly');
  });

  it('should not store donation with invalid frequency', async () => {
    const donation = new Donation({
      name: 'Invalid Donation',
      email: 'invalid@example.com',
      amount: 200,
      frequency: 'Yearly' // Not a valid frequency
    });

    let err;
    try {
      await donation.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.frequency).toBeDefined();
  });
});
