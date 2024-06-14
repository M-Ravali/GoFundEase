// Check if the URL contains a token parameter
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

console.log(urlParams);
console.log(token);

if (!token) {
    alert('Invalid or missing token');
    window.location.href = '/login.html'; // Redirect to login if no token found
}

// Reset Password Form Submission
document.getElementById('reset-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (response.ok) {
            alert('Password reset successful');
            window.location.href = '/login.html'; // Redirect to login page after successful reset
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to reset password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to reset password');
    }
});
