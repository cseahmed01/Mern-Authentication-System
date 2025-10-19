const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Check if moderator user already exists
    const existingModerator = await User.findOne({ email: 'moderator@example.com' });
    if (existingModerator) {
      console.log('Moderator user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password', // This will be hashed by the pre-save middleware
      role: 'admin'
    });

    // Create moderator user
    const moderatorUser = new User({
      name: 'Moderator User',
      email: 'moderator@example.com',
      password: 'password', // This will be hashed by the pre-save middleware
      role: 'moderator'
    });

    await adminUser.save();
    await moderatorUser.save();

    console.log('Admin user created:');
    console.log('Email: admin@example.com');
    console.log('Password: password');
    console.log('Role: admin');
    console.log('');

    console.log('Moderator user created:');
    console.log('Email: moderator@example.com');
    console.log('Password: password');
    console.log('Role: moderator');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedUsers();