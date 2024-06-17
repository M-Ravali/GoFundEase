document
  .getElementById("volunteer-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("volunteer-name").value,
      email: document.getElementById("volunteer-email").value,
      subject: document.getElementById("volunteer-subject").value,
      message: document.getElementById("volunteer-message").value,
    };

    console.log(formData);

    fetch("http://localhost:8080/api/volunteer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Volunteer form submitted successfully");
          alert("Volunteer form submitted successfully");
          window.location.href = "index.html#section_2";
          // Optionally redirect or show a success message
        } else {
          console.error("Volunteer form submission failed");
          alert("Volunteer form submission failed");
          window.location.href = "index.html#section_4";
          // Handle error scenario
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle fetch error
      });
  });
