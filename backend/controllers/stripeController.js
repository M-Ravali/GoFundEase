const { validationResult } = require('express-validator');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




exports.createPaymentIntent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            message: "Payment Intent Created Successfully"
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

