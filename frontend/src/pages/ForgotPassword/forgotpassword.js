// Forgot Password Form Submission
document
  .getElementById("forgot-password-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (response.ok) {
        alert("Password reset email sent");
      } else {
        alert("Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send password reset email");
    }
  });

// Reset Password Form Submission
// document.getElementById('reset-password-form').addEventListener('submit', async function(event) {
//     event.preventDefault();

//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');

//     const newPassword = document.getElementById('new-password').value;
//     const confirmPassword = document.getElementById('confirm-password').value;

//     if (newPassword !== confirmPassword) {
//         alert('Passwords do not match');
//         return;
//     }

//     try {
//         const response = await fetch(`/api/auth/reset-password/${token}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ password: newPassword }),
//         });

//         if (response.ok) {
//             alert('Password reset successful');
//             window.location.href = '/login'; // Redirect to login page after successful reset
//         } else {
//             alert('Failed to reset password');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Failed to reset password');
//     }
// });
