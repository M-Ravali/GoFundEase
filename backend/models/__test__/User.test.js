const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../User'); 
describe('User Model Test', () => {
  // Connect to the in-memory database before running any tests
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test_database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clear the database after each test
  afterEach(async () => {
    await User.deleteMany();
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should hash the password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'test@example.com' });

    expect(savedUser).not.toBeNull();
    expect(savedUser.password).not.toBe('password123');
    expect(await bcrypt.compare('password123', savedUser.password)).toBe(true);
  });

  it('should match the password correctly', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'test@example.com' });

    const isMatch = await savedUser.matchPassword('password123');

    expect(isMatch).toBe(true);
  });

  it('should not re-hash the password if it is not modified', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'test@example.com' });
    savedUser.name = 'Updated User';

    await savedUser.save();

    const updatedUser = await User.findOne({ email: 'test@example.com' });

    expect(await bcrypt.compare('password123', updatedUser.password)).toBe(true);
  });

  it('should generate a reset token and expiry', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      resetPasswordToken: 'sometoken',
      resetPasswordExpiry: Date.now() + 3600000,
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'test@example.com' });

    expect(savedUser.resetPasswordToken).toBe('sometoken');
    expect(savedUser.resetPasswordExpiry).toBeDefined();
  });
});
