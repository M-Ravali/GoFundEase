const mongoose = require('mongoose');
const Campaign = require('../../models/Campaign');

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
  await Campaign.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Campaign Model Test Suite', () => {
  it('should have default values for currentAmount and createdAt', async () => {
    const userId = new mongoose.Types.ObjectId(); // Using new to instantiate ObjectId

    const campaign = new Campaign({
      title: 'Sample Campaign',
      description: 'Sample Description',
      goalAmount: 1000,
      endDate: new Date(),
      contactEmail: 'sample@example.com',
      userId: userId, // Assigning the instantiated ObjectId
    });

    await campaign.save();

    const savedCampaign = await Campaign.findOne({ title: 'Sample Campaign' });

    expect(savedCampaign.currentAmount).toBe(0); // Assuming default value is 0
    expect(savedCampaign.createdAt).toBeDefined(); // Assuming createdAt is set in the schema or default behavior
  });

  it('should store mediaFiles as an array of strings', async () => {
    const userId = new mongoose.Types.ObjectId(); // Using new to instantiate ObjectId

    const campaign = new Campaign({
      title: 'Sample Campaign',
      description: 'Sample Description',
      goalAmount: 1000,
      endDate: new Date(),
      contactEmail: 'sample@example.com',
      userId: userId, // Assigning the instantiated ObjectId
      mediaFiles: ['path/to/file1.jpg', 'path/to/file2.jpg'],
    });

    await campaign.save();

    const savedCampaign = await Campaign.findOne({ title: 'Sample Campaign' });

    expect(Array.isArray(savedCampaign.mediaFiles)).toBe(true);
    expect(typeof savedCampaign.mediaFiles[0]).toBe('string');
  });

  it('should reference a valid User ObjectId', async () => {
    const userId = new mongoose.Types.ObjectId(); // Using new to instantiate ObjectId

    const campaign = new Campaign({
      title: 'Sample Campaign',
      description: 'Sample Description',
      goalAmount: 1000,
      endDate: new Date(),
      contactEmail: 'sample@example.com',
      userId: userId, // Assigning the instantiated ObjectId
    });

    await campaign.save();

    const savedCampaign = await Campaign.findOne({ title: 'Sample Campaign' });

    expect(mongoose.Types.ObjectId.isValid(savedCampaign.userId)).toBe(true);
  });
});
