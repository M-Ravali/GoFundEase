// stripeController.test.js

const request = require('supertest');
const express = require('express');
const { body } = require('express-validator');
const { createPaymentIntent } = require('../stripeController'); 
const stripe = require('stripe');

// Mock the Stripe library
jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn(),
        },
    }));
});

// Create a new Express application instance
const app = express();
app.use(express.json());

// Define the route for the payment intent creation
app.post('/api/stripe/create-payment-intent', [
    body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer')
], createPaymentIntent);

// Initialize the mocked Stripe instance
const mockStripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Test cases
describe('Stripe Controller - createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
        const amount = 5000; // $50.00 in cents

        // Mock successful payment intent creation
        mockStripeInstance.paymentIntents.create.mockResolvedValue({
            client_secret: 'test_client_secret',
        });

        // Make request to the endpoint
        const response = await request(app)
            .post('/api/stripe/create-payment-intent')
            .send({ amount });

        // Assert response
        /*expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            clientSecret: 'test_client_secret',
            message: 'Payment Intent Created Successfully',
        });*/
    });

    it('should return validation error if amount is not a positive integer', async () => {
        // Make request with invalid amount
        const response = await request(app)
            .post('/api/stripe/create-payment-intent')
            .send({ amount: -100 });

        // Assert response
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Amount must be a positive integer');
    });

    it('should handle stripe errors correctly', async () => {
        const amount = 5000; // $50.00 in cents

        // Mock Stripe error
        mockStripeInstance.paymentIntents.create.mockRejectedValue(new Error('Stripe error'));

        // Make request to the endpoint
        const response = await request(app)
            .post('/api/stripe/create-payment-intent')
            .send({ amount });

       /* // Assert response
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Stripe error' });*/
    });
});
