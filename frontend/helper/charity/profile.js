// Function to check if the user is logged in
function isLoggedIn() {
  // Implement your actual authentication logic here
  // Example: Check if a token is present in cookies or localStorage
  const token = getTokenFromCookie(); // Assume getTokenFromCookie function exists

  return !!token; // Return true if token exists, false otherwise
}

// Function to update navbar based on login status
function updateNavbar() {
  const profileDropdown = document.getElementById("profileDropdown");
  const loginButton = document.getElementById("loginButton");

  if (isLoggedIn()) {
    // User is logged in
    profileDropdown.classList.remove("d-none"); // Show profile dropdown
    loginButton.classList.add("d-none"); // Hide login button
  } else {
    // User is not logged in
    profileDropdown.classList.add("d-none"); // Hide profile dropdown
    loginButton.classList.remove("d-none"); // Show login button
  }
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  updateNavbar(); // Initial update based on current login status

  // Example: Listen for login/logout events and update navbar accordingly
  document.addEventListener("login", updateNavbar); // Triggered after successful login
  document.addEventListener("logout", updateNavbar); // Triggered after logout

  // Event listener for logout link

  // Logout functionality
  const logoutButton = document.getElementById("logoutLink");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      // Clear the token from cookies
      document.cookie = "token=; Max-Age=0; path=/;";

      // Optionally, clear the token from localStorage if stored there
      // localStorage.removeItem('token');

      // Alert user about successful logout
      alert("You have been logged out successfully.");

      // Redirect to login page or homepage
      window.location.href = "index.html";
    });
  }

  await checkAuthStatus(); // Ensure initial check on page load
});

// Example function to get token from cookie (replace with your actual function)
function getTokenFromCookie() {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; ca.length > i; i++) {
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

// Example function to clear token from cookie (replace with your actual function)
function clearTokenFromCookie() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // For localStorage: localStorage.removeItem('token');
}

// Example function to check authentication status
async function checkAuthStatus() {
  // Implement your logic here to check if the user is authenticated
  // For example, make an API call to verify the token or check localStorage
  updateNavbar(); // Update the navbar based on the authentication status
}
