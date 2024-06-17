document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('STRIPE_PUBLISHABLE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    const resultContainer = document.getElementById('payment-result');
    const donationForm = document.getElementById('donationForm');
    const campaignIdInput = document.getElementById('campaignId');

    // Retrieve campaign ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('campaignId');

    if (!campaignId) {
        console.error('No campaign ID found in URL');
        return;
    }

    campaignIdInput.value = campaignId;


    // donationForm.action = `./stripe.html?campaignId=${campaignId}`


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
                        name: 'Jenny Rosen', // Replace with actual billing details
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
            const formData = new FormData(donationForm);
            const donationData = {
                campaignId: formData.get('campaignId'),
                donationFrequency: formData.get('DonationFrequency'),
                amount: formData.get('flexRadioDefault') || formData.get('customAmount'),
                donorName: formData.get('donation-name'),
                donorEmail: formData.get('donation-email'),
                paymentIntentId // Send paymentIntentId to link with donation
            };

            console.log(formData)

            try {
                const donationResponse = await fetch('http://localhost:8080/api/donations/donate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donationData),
                });

                const donationDataResponse = await donationResponse.json();
                if (donationResponse.ok) {
                    // Display donation success message or handle as needed
                    console.log('Donation successful:', donationDataResponse);
                    resultContainer.classList.remove('d-none'); // Display payment success message
                } else {
                    console.error('Donation creation failed:', donationDataResponse.message);
                }
            } catch (error) {
                console.error('Error creating donation:', error);
            }
        }
    });

    donationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(donationForm);
        const donationData = {
            campaignId: formData.get('campaignId'),
            donationFrequency: formData.get('DonationFrequency'),
            amount: formData.get('flexRadioDefault') || formData.get('customAmount'),
            donorName: formData.get('donation-name'),
            donorEmail: formData.get('donation-email'),
        };

        try {
            const response = await fetch('http://localhost:8080/api/donations/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Donation successful!');
                // Optionally redirect to a thank you page
                // window.location.href = 'thankyou.html';
            } else {
                console.error('Error:', data.message);
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your donation.');
        }
    });
});
