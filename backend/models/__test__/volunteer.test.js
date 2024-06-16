// __tests__/volunteer.test.js

const mongoose = require('mongoose');
const Volunteer = require('../../models/Volunteer');

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
  await Volunteer.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Volunteer Model Test Suite', () => {
  it('should throw validation errors if required fields are missing', async () => {
    const volunteer = new Volunteer();

    let err;
    try {
      await volunteer.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.subject).toBeDefined();
    expect(err.errors.message).toBeDefined();
  });

  it('should save volunteer with all required fields', async () => {
    const volunteerData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Volunteering Inquiry',
      message: 'I would like to volunteer for your organization.'
    };

    const volunteer = new Volunteer(volunteerData);
    await volunteer.save();

    const savedVolunteer = await Volunteer.findOne({ email: 'john@example.com' });

    expect(savedVolunteer).toBeDefined();
    expect(savedVolunteer.name).toBe(volunteerData.name);
    expect(savedVolunteer.email).toBe(volunteerData.email);
    expect(savedVolunteer.subject).toBe(volunteerData.subject);
    expect(savedVolunteer.message).toBe(volunteerData.message);
  });
});
