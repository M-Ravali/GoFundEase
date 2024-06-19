// index.js

// Function to check if the user is logged in
function isLoggedIn() {
  const token = getTokenFromCookie(); // Assume getTokenFromCookie function exists
  return !!token; // Return true if token exists, false otherwise
}

console.log(isLoggedIn());

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

// Example function to get token from cookie
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

// Function to clear token from cookie
function clearTokenFromCookie() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Optionally, for localStorage: localStorage.removeItem('token');
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  updateNavbar(); // Initial update based on current login status

  // Example: Listen for login/logout events and update navbar accordingly
  document.addEventListener("login", updateNavbar); // Triggered after successful login
  document.addEventListener("logout", updateNavbar); // Triggered after logout

  // Event listener for logout link
  const logoutButton = document.getElementById("logoutLink");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      clearTokenFromCookie(); // Clear the token from cookies
      alert("You have been logged out successfully.");
      window.location.href = "index.html"; // Redirect to login page or homepage
    });
  }

  // await checkAuthStatus(); // Ensure initial check on page load
});
