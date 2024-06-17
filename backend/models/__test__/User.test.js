const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User'); // Adjust the path to your User model
const bcrypt = require('bcryptjs');

let mongoServer;

// Mocking MongoDB connection using MongoMemoryServer
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all collections between tests
beforeEach(async () => {
  await User.deleteMany({});
});

// Close MongoDB Memory Server and mongoose connection
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model Test', () => {
  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ email: 'john.doe@example.com' });
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should hash the user password before saving', async () => {
    const userData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'securePassword',
    };

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ email: 'jane.smith@example.com' });
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe(userData.password);

    const isPasswordMatch = await bcrypt.compare(userData.password, savedUser.password);
    expect(isPasswordMatch).toBeTruthy();
  });

  it('should match user password', async () => {
    const userData = {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: 'password321',
    };

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ email: 'alice.johnson@example.com' });
    const isPasswordCorrect = await savedUser.matchPassword('password321');
    const isWrongPassword = await savedUser.matchPassword('wrongpassword');

    expect(isPasswordCorrect).toBeTruthy();
    expect(isWrongPassword).toBeFalsy();
  });
});
