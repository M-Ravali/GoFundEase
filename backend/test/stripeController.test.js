// test/stripeController.test.js

const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../index'); 
const stripe = require('stripe');
const { createPaymentIntent } = require('../controllers/stripeController');

chai.use(chaiHttp);

describe('Stripe Controller', () => {
    describe('POST /api/stripe/create-payment-intent', () => {
        let stripeStub;

        before(() => {
            stripeStub = sinon.stub(stripe(process.env.STRIPE_SECRET_KEY).paymentIntents, 'create');
        });

        after(() => {
            stripeStub.restore();
        });

        it('should create a payment intent successfully', (done) => {
            const mockResponse = {
                client_secret: 'some_client_secret'
            };

            stripeStub.resolves(mockResponse);

            chai.request(app)
                .post('/api/stripe/create-payment-intent')
                .send({ amount: 1000 })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('clientSecret').eql('some_client_secret');
                    expect(res.body).to.have.property('message').eql('Payment Intent Created Successfully');
                    done();
                });
        });

        it('should return an error for invalid amount', (done) => {
            chai.request(app)
                .post('/api/stripe/create-payment-intent')
                .send({ amount: -1000 })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    done();
                });
        });

        it('should handle Stripe API errors', (done) => {
            stripeStub.rejects(new Error('Stripe API error'));

            chai.request(app)
                .post('/api/stripe/create-payment-intent')
                .send({ amount: 1000 })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.have.property('error').eql('Stripe API error');
                    done();
                });
        });
    });
});
