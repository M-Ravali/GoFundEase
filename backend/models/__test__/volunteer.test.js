const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Volunteer = require('../../models/volunteer'); // Adjust the path to your Volunteer model

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

afterEach(async () => {
  await Volunteer.deleteMany({});
});

describe('Volunteer Model Test', () => {
  it('should create a volunteer successfully with valid data', async () => {
    const validVolunteerData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Interested in volunteering',
      message: 'I would like to volunteer for your upcoming events.'
    };

    const volunteer = new Volunteer(validVolunteerData);
    const savedVolunteer = await volunteer.save();

    expect(savedVolunteer._id).toBeDefined();
    expect(savedVolunteer.name).toBe(validVolunteerData.name);
    expect(savedVolunteer.email).toBe(validVolunteerData.email);
    expect(savedVolunteer.subject).toBe(validVolunteerData.subject);
    expect(savedVolunteer.message).toBe(validVolunteerData.message);
  });

  it('should fail to create a volunteer without required fields', async () => {
    const invalidVolunteerData = {
      email: 'john@example.com',
      subject: 'Interested in volunteering'
    };

    let error;
    try {
      const volunteer = new Volunteer(invalidVolunteerData);
      await volunteer.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should create a volunteer successfully without the message field', async () => {
    const validVolunteerData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Interested in volunteering'
    };

    const volunteer = new Volunteer(validVolunteerData);
    const savedVolunteer = await volunteer.save();

    expect(savedVolunteer._id).toBeDefined();
    expect(savedVolunteer.name).toBe(validVolunteerData.name);
    expect(savedVolunteer.email).toBe(validVolunteerData.email);
    expect(savedVolunteer.subject).toBe(validVolunteerData.subject);
    expect(savedVolunteer.message).toBeUndefined();
  });
});
