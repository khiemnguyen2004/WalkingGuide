require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET (hidden)' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');
console.log('===============================');

// Test email configuration manually
const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
console.log('Email configured:', emailConfigured); 