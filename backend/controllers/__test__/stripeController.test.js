const request = require('supertest');
const app = require('../index.js');
const stripe = require('stripe');

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

describe('Stripe Controller', () => {
  afterAll(async () => {
    await new Promise(resolve => app.close(resolve));
  });

  describe('POST /api/stripe/create-payment-intent', () => {
    it('should create a payment intent successfully', async () => {
      jest.spyOn(stripeClient.paymentIntents, 'create').mockResolvedValue({
        client_secret: 'pi_3PQVO4DJp7LHOsjn1RfEhFSP_secret_O7gdKSb7X32FS1Sb7YoMyPx7z',
      });

      const res = await request(app)
        .post('/api/stripe/create-payment-intent')
        .send({ amount: 1000 });
 
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('clientSecret', 'pi_3PQVO4DJp7LHOsjn1RfEhFSP_secret_O7gdKSb7X32FS1Sb7YoMyPx7z');
    });

    it('should return a 400 error if amount is missing', async () => {
      const res = await request(app)
        .post('/api/stripe/create-payment-intent')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errors: [
          {
            msg: 'Invalid value',
            path: 'amount',
            type: 'field',
            location: 'body'
          }
        ]
      });
    });

    it('should return a 500 error if Stripe service fails', async () => {
      jest.spyOn(stripeClient.paymentIntents, 'create').mockRejectedValue(new Error('Stripe error'));

      const res = await request(app)
        .post('/api/stripe/create-payment-intent')
        .send({ amount: 1000 });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Stripe error'
      });
    });
  });
});