const { validationResult } = require("express-validator");

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51PSRzbEoECBkrKTdYfEgvPjG8U82QxEjb4vXzvWqVhsqNpHZkPKL7T954y9haWvyUMyci9rAAVNFZcHin3CAZFpH00aArekdSN"
);

exports.createPaymentIntent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, //stripe accepts amount in cents
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      message: "Payment Intent Created Successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};