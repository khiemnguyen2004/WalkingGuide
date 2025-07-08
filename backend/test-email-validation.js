require('dotenv').config();
const { validateEmail, looksLikeRealEmail } = require('./src/utils/emailValidator');

async function testEmailValidation() {
  const testEmails = [
    // Valid emails
    'john.doe@gmail.com',       // Valid email
    'user123@yahoo.com',        // Valid email
    'contact@company.com',      // Valid email
    
    // Fake emails that should be blocked
    'kkjkjkjk@gmail.com',       // Repeated pattern (your example)
    'test@gmail.com',           // Starts with "test"
    'fake@hotmail.com',         // Starts with "fake"
    'temp@outlook.com',         // Starts with "temp"
    'demo@gmail.com',           // Starts with "demo"
    'admin@yahoo.com',          // Starts with "admin"
    'user@gmail.com',           // Starts with "user"
    'guest@hotmail.com',        // Starts with "guest"
    '123@gmail.com',            // Only numbers
    'abc@gmail.com',            // Only letters (too short)
    'ab@gmail.com',             // Too short
    '123456789@gmail.com',      // Sequential numbers
    'abcdefgh@gmail.com',       // Sequential letters
    'qwerty@gmail.com',         // Keyboard pattern
    'asdfgh@gmail.com',         // Keyboard pattern
    'password@gmail.com',       // Common word
    '123123@gmail.com',         // Repeated pattern
    'abcabc@gmail.com',         // Repeated pattern
    '111111@gmail.com',         // Repeated numbers
    'aaaaaa@gmail.com',         // Repeated letters
    
    // Invalid formats
    'invalid-email',            // Invalid format
    'test@',                    // Invalid format
    '@gmail.com',               // Invalid format
    'test@gmail',               // Invalid format
    
    // Disposable emails
    'test@tempmail.org',        // Disposable email
    'test@mailinator.com',      // Disposable email
    'test@example.com',         // Disposable domain
  ];

  console.log('=== Email Validation Test ===\n');

  for (const email of testEmails) {
    try {
      const result = await validateEmail(email);
      console.log(`Email: ${email}`);
      console.log(`Valid: ${result.isValid}`);
      if (!result.isValid) {
        console.log(`Reason: ${result.reason}`);
      }
      console.log('---');
    } catch (error) {
      console.log(`Email: ${email}`);
      console.log(`Error: ${error.message}`);
      console.log('---');
    }
  }
}

testEmailValidation(); 