document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  fetch("http://localhost:8080/api/campaign/all")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((campaigns) => {
      const container = document.getElementById("campaignsContainer");

      if (!container) {
        console.error("No element with ID 'campaignsContainer' found");
        return;
      }

      if (!Array.isArray(campaigns)) {
        throw new Error("Expected an array of campaigns");
      }

      // Reverse the campaigns array
      campaigns.reverse();
      console.log(campaigns);

      campaigns.forEach((campaign) => {
        const campaignDiv = document.createElement("div");
        campaignDiv.classList.add(
          "col-lg-4",
          "col-md-6",
          "col-12",
          "mb-4",
          "mb-lg-0"
        );

        // Constructing the image URL from the mediaFiles array
        const imageUrl = campaign.mediaFiles[0] ? 
                 `http://localhost:8080/` + campaign.mediaFiles[0].replace(/\\/g, "/") :
                 'default_image_url.jpg'; // Provide a default image URL or handle accordingly

        // const imageUrl =`http://localhost:8080/` + campaign.mediaFiles[0].replace(/\\/g, "/");

        const campaignContent = `
          <div class="custom-block-wrap card-height m-3">
            <div style="height: 200px; overflow: hidden;">
              <img src="${imageUrl}" class="custom-block-image img-fluid" alt="Campaign Image" style="object-fit: cover; width: 100%; height: 100%;">
            </div>
            <div class="custom-block" style="height: calc(100% - 200px);">
              <div class="custom-block-body">
                <h5 class="mb-3">${campaign.title}</h5>
                <p>${campaign.description}</p>
                <div class="progress mt-4">
                  <div class="progress-bar" role="progressbar" style="width: ${
                    (campaign.currentAmount / campaign.goalAmount) * 100
                  }%" aria-valuenow="${
          (campaign.currentAmount / campaign.goalAmount) * 100
        }" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex align-items-center my-2">
                  <p class="mb-0"><strong>Raised:</strong> $${
                    campaign.currentAmount
                  }</p>
                  <p class="ms-auto mb-0"><strong>Goal:</strong> $${
                    campaign.goalAmount
                  }</p>
                </div>
              </div>
              <a href="donate.html" class="custom-btn btn">Donate Now</a>
            </div>
          </div>
        `;
        campaignDiv.innerHTML = campaignContent;
        container.appendChild(campaignDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching campaigns:", error);
    });
});

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

async function uploadCampaign() {
  const campaignName = document.getElementById("campaignName").value;
  const campaignDescription = document.getElementById(
    "campaignDescription"
  ).value;
  const goalAmount = document.getElementById("goalAmount").value;
  const endDate = document.getElementById("endDate").value;
  const contactEmail = document.getElementById("contactEmail").value;
  const imageUpload = document.getElementById("imageUpload").files[0];
  const videoUpload = document.getElementById("videoUpload").files[0];

  const formData = new FormData();
  formData.append("title", campaignName);
  formData.append("description", campaignDescription);
  formData.append("goalAmount", goalAmount);
  formData.append("endDate", endDate);
  formData.append("contactEmail", contactEmail);
  if (imageUpload) {
    formData.append("mediaFiles", imageUpload);
  }
  if (videoUpload) {
    formData.append("mediaFiles", videoUpload);
  }

  const token = getTokenFromCookie();
  if (!token) {
    console.error("No token found, user not authenticated");
    alert("You must be logged in to create a campaign.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/campaign", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Campaign uploaded successfully", result);
      alert("Campaign uploaded successfully. Click on Campaigns menu to check your campaign");
    } else {
      console.error("Error uploading campaign", result);
      alert("Error uploading campaign: " + result.message);
    }
  } catch (error) {
    console.error("Error uploading campaign", error);
    alert("An error occurred while uploading the campaign.");
  }
}
