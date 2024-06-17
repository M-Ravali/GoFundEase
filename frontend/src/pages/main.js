document.addEventListener("DOMContentLoaded", function () {
  // Login form validation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (validateEmail(email) && password) {
        try {
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set content type to JSON
            },
            body: JSON.stringify({ email, password }), // Send JSON data
          });

          const data = await res.json();
          if (res.ok) {
            document.cookie = `token=${data.token}; path=/;`;
            // Handle successful login, e.g., store token, redirect, etc.
            console.log("Login successful:", data);
            alert("Login successful");
            redirectToHome();
            // Example: localStorage.setItem('token', data.token);
            // Redirect to another page: window.location.href = '/dashboard';
          } else {
            alert("Login failed: " + data.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      } else {
        alert("Please enter a valid email and password");
      }
    });
  }

  // Register form validation
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (
        name &&
        validateEmail(email) &&
        password &&
        password === confirmPassword
      ) {
        try {
          const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set content type to JSON
            },
            body: JSON.stringify({ name, email, password }), // Send JSON data
          });

          const data = await res.json();
          if (res.ok) {
            alert("Account created successfully");
            redirectToHome();
            // Handle successful registration, e.g., store token, redirect, etc.
            console.log("Registration successful:", data);
            // Example: localStorage.setItem('token', data.token);
            // Redirect to another page: window.location.href = '/login';
          } else {
            alert("Registration failed: " + data.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      } else {
        alert("Please enter valid details and ensure passwords match");
      }
    });
  }
});

//Campaign form validation
document.addEventListener("DOMContentLoaded", function () {
  const campaignForm = document.getElementById("campaignForm");
  if (campaignForm) {
    campaignForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        title: document.getElementById("campaignTitle").value,
        description: document.getElementById("campaignDescription").value,
        goalAmount: document.getElementById("goalAmount").value,
        endDate: document.getElementById("endDate").value,
        contactEmail: document.getElementById("contactEmail").value,
      };

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      console.log(token);

      try {
        const response = await fetch("http://localhost:8080/api/campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(result);
        alert("Campaign created successfully");
        window.location.href = "index.html";

        // Redirect or update the UI as needed
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        alert("Failed to create campaign");
      }
    });
  }
});

// Helper function to validate email
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
}

// redirecting
function redirectToHome() {
  window.location.href = "../../public/index.html";
}
