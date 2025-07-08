require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== Email Configuration Test ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');
console.log('EMAIL_PASS starts with:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '...' : 'NOT SET');

// Test transporter creation
try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log('Transporter created successfully');
  
  // Test connection
  transporter.verify(function(error, success) {
    if (error) {
      console.log('Connection test failed:', error.message);
    } else {
      console.log('Connection test successful!');
    }
    process.exit();
  });
  
} catch (error) {
  console.log('Error creating transporter:', error.message);
  process.exit();
} 