const stripe = Stripe(
  "pk_test_51PSRzbEoECBkrKTdDkuvB6urnvr2zBqSEnpWZlHaoltvIku5BIeICvIQxK6fHBpbreXzVPM0d6FQIC72S5ha7rJw00q95qdgbK"
); // Replace with your publishable key from Stripe
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

card.on("change", (event) => {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Example function to get token from cookie
function getTokenFromCookie() {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function isLoggedIn() {
  const token = getTokenFromCookie();
  return !!token; // Return true if token exists, false otherwise
}

document
  .getElementById("donationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Retrieve campaignId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get("campaignId");

    if (!campaignId) {
      alert("you should a campaign to donate");
      window.location.href = "Campaign/campaign.html";
    }

    // Add campaignId to data object
    data.campaignId = campaignId;

    if (isLoggedIn()) {
      const token = getTokenFromCookie();
      try {
        const response = await fetch(
          "http://localhost:8080/api/stripe/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: 'Bearer ${token}',
            },
            body: JSON.stringify({
              amount: data["donation-amount"],
              campaignId: data.campaignId,
            }),
          }
        );

        const result = await response.json();

        console.log(result);

        if (result.error) {
          console.log(result.error.message);
          alert(result.error.message);
          return;
        }

        const clientSecret = result.clientSecret;

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: card,
              billing_details: {
                name: data["donation-name"],
                email: data["donation-email"],
              },
            },
          }
        );

        console.log(paymentIntent);

        if (error) {
          console.log(error.message);
          alert(error.message);
        } else {
          const donationData = {
            donorName: data["donation-name"],
            donorEmail: data["donation-email"],
            amount: data["donation-amount"],
            donorPhone: data["donation-phone"],
            campaignId: data.campaignId,
          };
          await fetch("http://localhost:8080/api/donations/donate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: 'Bearer ${token}',
            },
            body: JSON.stringify(donationData),
          });
          alert("Donation successful!");
          window.location.href = "thankyou.html";
          console.log(donationData);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your donation.");
      }
    } else {
      alert("Please log in to make a donation.");
      // Optionally redirect to a login page
      window.location.href = "./login.html";
    }
  });