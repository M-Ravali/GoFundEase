const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { registerUser, authUser, requestPasswordReset, resetPassword } = require('../authController');
const User = require('../../models/User');

jest.setTimeout(10000);

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('sometoken')
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('sometoken')
  })
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));



describe('Auth Controller', () => {
  describe('authUser', () => {
    it('should authenticate a user with valid credentials', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockUser = { _id: 'someid', name: 'Test User', email: 'test@example.com', matchPassword: jest.fn().mockReturnValue(true) };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      await authUser(req, res);


      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'someid',
        name: 'Test User',
        email: 'test@example.com',
        token: 'sometoken'
      }));
    });

    it('should return an error if user authentication fails', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockUser = { _id: 'someid', name: 'Test User', email: 'test@example.com', matchPassword: jest.fn().mockReturnValue(false) };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      await authUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    // Add more test cases for error handling, etc.
  });

  // Write test cases for other controllers similarly...
});
