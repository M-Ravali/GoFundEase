
document.addEventListener('DOMContentLoaded', () => {
  const stripe = Stripe('STRIPE_PUBLISHABLE_KEY');
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  const resultContainer = document.getElementById('payment-result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { paymentIntentId } = await fetch('http://localhost:8080/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }) // Adjust amount as needed
    }).then(response => response.json());

    // Complete payment using Stripe.js
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentIntentId,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Jenny Rosen',
          },
        },
      }
    );

    if (error) {
      console.error('Payment failed:', error);
    } else {
      // Send paymentIntentId to server for confirmation
      await fetch('http://localhost:8080/api/stripe/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId })
      });

      // Proceed with donation creation
      await fetch('http://localhost:8080/api/donations/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationFrequency: 'one-time', // Adjust as needed
          amount: 1000, // Adjust amount as needed
          donorName: 'John Doe', // Replace with actual donor details
          donorEmail: 'john.doe@example.com', // Replace with actual donor details
          campaignId: 'campaignId', // Replace with actual campaign ID
          paymentIntentId // Send paymentIntentId to link with donation
        })
      }).then(response => response.json());

      // Display payment success message
      resultContainer.classList.remove('d-none');
    }
  });
});

function goBack() {
  window.history.back();
}
