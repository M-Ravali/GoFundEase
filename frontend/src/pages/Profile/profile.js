// profile.js

// Function to check if the user is logged in
function isLoggedIn() {
  const token = getTokenFromCookie(); // Assume getTokenFromCookie function exists
  return !!token; // Return true if token exists, false otherwise
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

// Fetch user profile data
async function fetchUserProfile(token) {
  const apiEndpoint = "http://localhost:8080/users/profile";

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.message) {
      console.error("Error:", data.message);
      return;
    }

    console.log(data);

    document.getElementById("name").innerText = data.name;
    document.getElementById("email").innerText = data.email || "";
    document.getElementById("bio").value = data.bio || "";
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  const token = getTokenFromCookie();
  if (token) {
    await fetchUserProfile(token);
    // await fetchDonationHistory(token);
  } else {
    console.error("No token found in cookies");
  }
});
