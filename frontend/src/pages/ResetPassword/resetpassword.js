// Function to extract token from URL path
function getTokenFromPath() {
  const pathParts = window.location.pathname.split("/");
  return pathParts[pathParts.length - 1];
}

const token = getTokenFromPath();

console.log(token);

if (!token) {
  alert("Invalid or missing token");
  window.location.href = "http://127.0.0.1:5500/frontend/src/pages/login.html"; // Redirect to login if no token found
}

// Reset Password Form Submission
document
  .getElementById("reset-password-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        alert("Password reset successful");
        window.location.href = "http://127.0.0.1:5500/frontend/src/pages/login.html"; // Redirect to login page after successful reset
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to reset password");
    }
  });
