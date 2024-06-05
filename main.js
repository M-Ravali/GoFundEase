document.addEventListener('DOMContentLoaded', function () {
    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (validateEmail(email) && password) {
                alert('Login successful');
                // Add login logic here
            } else {
                alert('Please enter valid email and password');
            }
        });
    }

    // Register form validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (username && validateEmail(email) && password && password === confirmPassword) {
                alert('Account created successfully');
                // Add registration logic here
            } else {
                alert('Please enter valid details and ensure passwords match');
            }
        });
    }
});

// Helper function to validate email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
}
