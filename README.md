# PSD-Team8-Project

# GoFundEase: Empowering Dreams

GoFundEase is an innovative platform designed to revolutionize the way people raise funds for their personal causes, charitable events, and entrepreneurial ventures. By streamlining the entire process from campaign creation to fund distribution, we make fundraising more effective, transparent, and accessible to everyone.

## Project Overview

Our mission is to empower individuals, non-profits, and small businesses by providing them with a seamless and intuitive platform to share their stories, connect with donors, and achieve their financial goals. Whether it's for medical expenses, education, disaster relief, or launching a new business, GoFundEase is here to support your journey.

### Key Features

- User-friendly campaign creation
- Secure and transparent donation processing
- Social media integration for wider reach
- Real-time campaign analytics
- Easy campaign management

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

### Social Media Integration
- Twitter API
- Facebook Graph API
- LinkedIn API

### Other Tools
- Git & GitHub (version control)
- npm (package manager)
- Postman (API testing)

## Project Structure

![image](https://github.com/M-Ravali/PSD-Team8/assets/157147111/78d8179b-8282-498a-b6db-4eeee63c2929)

Backend/ - Server-side code,
 config - Configuration files,
 controllers - Request handlers,
 middlewares - Custom middleware functions,
 models - Database schemas,
 routes - API endpoints,
 .env - Environment variables,
 index.js - Server entry point,
 package*.json - Project dependencies,
 secretKey.js - Secret keys (should be in `.env` and gitignored),

GoFundEase/ - Client-side code,
 helper/ - Utility functions,
  index.html - Main page,
  login.html - Login page,
  main.js - Main JavaScript file,
  register.html - Registration page,
  style.css - Global styles,
README.md - Project documentation

## Getting Started

### Prerequisites
- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:
 
   git clone https://github.com/yourusername/GoFundEase.git
   cd GoFundEase
  

2. Install backend dependencies:
 
   cd Backend
   npm install


3. Set up environment variables:
   - .env in the Backend directory
   - Update the variables with your own keys

4. Start the server:
   
   npm start
   

5. Open `GoFundEase/helper/index.html` in your browser

  Right click and open with live server


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
