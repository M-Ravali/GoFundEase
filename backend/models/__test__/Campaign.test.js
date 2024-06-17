const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Campaign = require('../../models/Campaign'); // Adjust the path as needed

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

beforeEach(async () => {
  await Campaign.deleteMany({});
});

describe('Campaign Model Test', () => {
  it('should create & save a campaign successfully', async () => {
    const validCampaign = new Campaign({
      title: 'Test Campaign',
      description: 'This is a test campaign',
      goalAmount: 5000,
      endDate: new Date('2024-12-31'),
      contactEmail: 'test@example.com',
      userId: new mongoose.Types.ObjectId(),
    });
    const savedCampaign = await validCampaign.save();

    expect(savedCampaign._id).toBeDefined();
    expect(savedCampaign.title).toBe('Test Campaign');
    expect(savedCampaign.description).toBe('This is a test campaign');
    expect(savedCampaign.goalAmount).toBe(5000);
    expect(savedCampaign.currentAmount).toBe(0);
    expect(savedCampaign.endDate).toBeInstanceOf(Date);
    expect(savedCampaign.contactEmail).toBe('test@example.com');
    expect(savedCampaign.mediaFiles).toEqual([]);
    expect(savedCampaign.createdAt).toBeInstanceOf(Date);
  });

  it('should fail to create a campaign without required fields', async () => {
    const invalidCampaign = new Campaign({});
    let err;
    try {
      await invalidCampaign.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.description).toBeDefined();
    expect(err.errors.goalAmount).toBeDefined();
    expect(err.errors.endDate).toBeDefined();
    expect(err.errors.contactEmail).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('should update a campaign successfully', async () => {
    const campaign = new Campaign({
      title: 'Test Campaign',
      description: 'This is a test campaign',
      goalAmount: 5000,
      endDate: new Date('2024-12-31'),
      contactEmail: 'test@example.com',
      userId: new mongoose.Types.ObjectId(),
    });
    const savedCampaign = await campaign.save();

    const updatedData = {
      title: 'Updated Campaign Title',
      currentAmount: 1500,
    };
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      savedCampaign._id,
      updatedData,
      { new: true }
    );

    expect(updatedCampaign.title).toBe('Updated Campaign Title');
    expect(updatedCampaign.currentAmount).toBe(1500);
  });

  it('should delete a campaign successfully', async () => {
    const campaign = new Campaign({
      title: 'Test Campaign',
      description: 'This is a test campaign',
      goalAmount: 5000,
      endDate: new Date('2024-12-31'),
      contactEmail: 'test@example.com',
      userId: new mongoose.Types.ObjectId(),
    });
    const savedCampaign = await campaign.save();

    await Campaign.findByIdAndDelete(savedCampaign._id);

    const deletedCampaign = await Campaign.findById(savedCampaign._id);
    expect(deletedCampaign).toBeNull();
  });

  it('should validate mediaFiles as an array of strings', async () => {
    const campaign = new Campaign({
      title: 'Test Campaign',
      description: 'This is a test campaign',
      goalAmount: 5000,
      endDate: new Date('2024-12-31'),
      contactEmail: 'test@example.com',
      userId: new mongoose.Types.ObjectId(),
      mediaFiles: ['file1.jpg', 'file2.png'],
    });
    const savedCampaign = await campaign.save();

    expect(savedCampaign.mediaFiles).toEqual(['file1.jpg', 'file2.png']);
  });
});
