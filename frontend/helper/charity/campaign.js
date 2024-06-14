document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/api/campaign/all")
    .then((response) => response.json())
    .then((campaigns) => {
      const container = document.getElementById("campaignsContainer");
      campaigns.forEach((campaign, index) => {
        const campaignDiv = document.createElement("div");
        campaignDiv.classList.add("col-lg-4", "col-md-6", "col-12", "mb-4", "mb-lg-0");
        const campaignContent = `
          <div class="custom-block-wrap card-height">
            <div style="height: 200px; overflow: hidden;">
              <img src="${campaign.imageUrl}" class="custom-block-image img-fluid" alt="Campaign Image" style="object-fit: cover; width: 100%; height: 100%;">
            </div>
            <div class="custom-block" style="height: calc(100% - 200px);">
              <div class="custom-block-body">
                <h5 class="mb-3">${campaign.title}</h5>
                <p>${campaign.description}</p>
                <div class="progress mt-4">
                  <div class="progress-bar" role="progressbar" style="width: ${(campaign.currentAmount / campaign.goalAmount) * 100}%" aria-valuenow="${(campaign.currentAmount / campaign.goalAmount) * 100}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex align-items-center my-2">
                  <p class="mb-0"><strong>Raised:</strong> $${campaign.currentAmount}</p>
                  <p class="ms-auto mb-0"><strong>Goal:</strong> $${campaign.goalAmount}</p>
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
      console.error('Error fetching campaigns:', error);
    });
});




document.addEventListener('DOMContentLoaded', function () {
  // Function to get the token from the cookie
  function getTokenFromCookie() {
      const name = 'token=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
              return c.substring(name.length, c.length);
          }
      }
      return '';
  }

  // Function to handle file upload and campaign creation
  async function uploadFiles() {
      const campaignName = document.getElementById('campaignName').value;
      const campaignDescription = document.getElementById('campaignDescription').value;
      const goalAmount = document.getElementById('goalAmount').value;
      const currentAmount = document.getElementById('currentAmount').value;
      const endDate = document.getElementById('endDate').value;
      const contactEmail = document.getElementById('contactEmail').value;
      const imageUpload = document.getElementById('imageUpload').files[0];
      const videoUpload = document.getElementById('videoUpload').files[0];

      const formData = new FormData();
      formData.append('title', campaignName);
      formData.append('description', campaignDescription);
      formData.append('goalAmount', goalAmount);
      formData.append('currentAmount', currentAmount);
      formData.append('endDate', endDate);
      formData.append('contactEmail', contactEmail);

      if (imageUpload) {
          formData.append('files', imageUpload);
      }
      if (videoUpload) {
          formData.append('files', videoUpload);
      }

      const token = getTokenFromCookie();
      if (!token) {
          console.error('No token found, user not authenticated');
          alert('You must be logged in to create a campaign.');
          return;
      }

      try {
          const response = await fetch('http://localhost:8080/api/campaign', {
              method: 'POST',
              body: formData,
              headers: {
                  'Authorization': `Bearer ${token}`
              },
          });

          const result = await response.json();
          if (response.ok) {
              console.log('Campaign uploaded successfully', result);
              alert('Campaign uploaded successfully');
          } else {
              console.error('Error uploading campaign', result);
              alert('Error uploading campaign: ' + result.message);
          }
      } catch (error) {
          console.error('Error uploading campaign', error);
          alert('An error occurred while uploading the campaign.');
      }
  }

  // Add other event listeners or functions here, like login and registration handlers

});

