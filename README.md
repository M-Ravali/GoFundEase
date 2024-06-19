# PSD-Team8-Project

# GoFundEase: Empowering Dreams

GoFundEase is an innovative platform designed to revolutionize the way people raise funds for their personal causes, charitable events, and entrepreneurial ventures. By streamlining the entire process from campaign creation to fund distribution, we make fundraising more effective, transparent, and accessible to everyone.

## Project Overview

Our mission is to empower individuals, non-profits, and small businesses by providing them with a seamless and intuitive platform to share their stories, connect with donors, and achieve their financial goals. Whether it's for medical expenses, education, disaster relief, or launching a new business, GoFundEase is here to support your journey.

### Key Features

•	User-friendly Interface
•	User Authentication:
•	Donation Support:
•	Campaign Creation and Management:
•	Volunteer Opportunities:
•	Personalized User Profiles:

## Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 4/5
- JavaScript (ES6+)
- jQuery

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM for MongoDB)

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt.js (for password hashing)

### Payment Processing
- Stripe API (for secure transactions)

### Other Tools

Git & GitHub (version control)
npm (package manager)
Postman (API testing)
CircleCI (Continuous Integration)
Docker (Containerization)

## Project Structure

### Backend/
Server-side code, responsible for handling API requests, database interactions, and other server-side operations.

- **config**: Configuration files
- **controllers**: Request handlers
- **middlewares**: Custom middleware functions
- **models**: Database schemas
- **routes**: API endpoints
- **uploads**: Directory for file uploads
- **node_modules**: Directory for npm packages
- **.env**: Environment variables (should be gitignored)
- **.gitignore**: Specifies intentionally untracked files to ignore
- **Dockerfile**: Instructions to build a Docker image for the backend
- **index.js**: Server entry point
- **package.json**: Project dependencies and scripts
- **package-lock.json**: Exact versions of installed dependencies
- **secretKey.js**: Secret keys (should be in `.env` and gitignored)

### Frontend/
Client-side code, responsible for the user interface and user experience.

- **public**: Publicly accessible files
  - **Dockerfile**: Instructions to build a Docker image for the frontend
  - **index.html**: Main page
- **src**: Source files for the frontend application
  - **assets**: Static assets like images, fonts, etc.
  - **pages**: Individual pages of the application
    - **Campaign**: Campaign-related pages and scripts
    - **ForgotPassword**: Password recovery page and scripts
    - **Profile**: User profile page and scripts
    - **ResetPassword**: Password reset page and scripts
    - **donate.html**: Donation page
    - **donate.js**: Donation page script
    - **index.js**: Main entry point for JavaScript
    - **login.html**: Login page
    - **main.js**: Main JavaScript file
    - **news-detail.html**: News detail page
    - **news.html**: News listing page
    - **register.html**: Registration page
    - **thankyou.html**: Thank you page
    - **volunteer.js**: Volunteer page script
- **README.md**: Project documentation

## Getting Started

### Prerequisites
- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- npm (usually comes with Node.js)
- Live server

### Installation

1. Clone the repository:
 
   git clone https://github.com/M-Ravali/GoFundEase.git
   cd GoFundEase
  

2. Install backend dependencies:
 
   cd Backend
   npm install


3. Set up environment variables:
   - .env in the Backend directory
   - Update the variables with your own keys

4. Start the server:
   
   npm start
   

5. Open `GoFundEase/public/index.html` in your browser

  Right click and open with live server

6. Run tests
    
   npm test


### Building and Running with Docker

# Prerequisites
•	Ensure you have Docker and Docker Compose installed on your machine.

# Step-by-Step Instructions
1.	Clone the Repository 
git clone https://github.com/M-Ravali/GoFundEase.git
cd GoFundEase
2.	Ensure Directory Structure Ensure your directory structure matches what is expected in your docker-compose.yml file: 

your-repo/
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── src/
└── frontend/
    └── public/
        ├── Dockerfile
        └── index.
        
3.	Build and Run the Docker Containers 
docker-compose up --build

4.	Verify the Containers are Running After running the above command, Docker Compose will build the images and start the containers. You should see output logs indicating that both the backend and frontend services are up and running.

5.	Access the Application 
o	Frontend: Open your web browser and navigate to http://localhost:3000 to access the frontend of your application.
o	Backend: The backend service should be accessible at http://localhost:8080, though typically it will be called by the frontend service.


## Team

- Ravali Maddela 
- Sai Ramya Valleru
- Navreet Kaur 
- Olawale Ashaolu 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Thanks to Professor Ankit Agrawal at Saint Louis University for guidance.

Together, let's make dreams a reality with GoFundEase! 🚀
