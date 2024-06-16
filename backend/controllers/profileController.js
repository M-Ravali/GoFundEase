//profileController.js

const User = require("../models/User");


exports.getAllUsers =  async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getUserProfile = async (req, res) => {
  try {
      if (!req.user) {
          console.log('No user in request'); // Log if no user in request
          return res.status(401).json({ message: 'Not authorized' });
      }

      console.log('User in request:', req.user); // Log the user in request

      const user = await User.findById(req.user._id);
      if (user) {
          res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              // Optionally include other user details as needed
          });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching user profile:', error.message); // Log the error message
      res.status(500).json({ message: 'Server error' });
  }
}