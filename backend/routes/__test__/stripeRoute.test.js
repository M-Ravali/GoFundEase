const request = require('supertest');
const express = require('express');
const { body, validationResult } = require('express-validator');
const stripeController = require('../../controllers/stripeController');

jest.mock('../../controllers/stripeController', () => ({
  createPaymentIntent: jest.fn(),
}));

const app = express();
app.use(express.json());
const router = require('../stripe');
app.use('/api/stripe', router);

describe('Stripe Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /create-payment-intent', () => {
    it('should create a payment intent', async () => {
      const mockRequestBody = {
        amount: 1000,
      };

      const mockPaymentIntent = {
        clientSecret: 'mockClientSecret',
        paymentMethodTypes: ['card'],
        amount: mockRequestBody.amount,
        currency: 'usd',
      };

      stripeController.createPaymentIntent.mockImplementation((req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        return res.status(200).json(mockPaymentIntent);
      });

      const response = await request(app)
        .post('/api/stripe/create-payment-intent')
        .send(mockRequestBody)
        .expect(200);

      expect(response.body).toEqual(mockPaymentIntent);
    });
  });
});
