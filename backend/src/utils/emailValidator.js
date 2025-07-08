const dns = require('dns').promises;

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if email domain has valid MX records
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>} - True if domain has valid MX records
 */
async function hasValidDomain(email) {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords.length > 0;
  } catch (error) {
    console.log(`Domain validation failed for ${email}:`, error.message);
    return false;
  }
}

/**
 * Checks if email looks like a real email (not obviously fake)
 * @param {string} email - Email address to check
 * @returns {boolean} - True if email looks legitimate
 */
function looksLikeRealEmail(email) {
  const username = email.split('@')[0];
  
  // Check for obviously fake usernames
  const fakePatterns = [
    /^[a-z]{1,3}$/i,           // Too short (1-3 characters)
    /^[0-9]{1,3}$/,            // Only numbers (1-3 digits)
    /^[a-z0-9]{1,2}$/i,        // Too short alphanumeric
    /^test/i,                   // Starts with "test"
    /^fake/i,                   // Starts with "fake"
    /^temp/i,                   // Starts with "temp"
    /^demo/i,                   // Starts with "demo"
    /^admin/i,                  // Starts with "admin"
    /^user/i,                   // Starts with "user"
    /^guest/i,                  // Starts with "guest"
    /^anonymous/i,              // Contains "anonymous"
    /^noreply/i,                // Contains "noreply"
    /^no-reply/i,               // Contains "no-reply"
    /^donotreply/i,             // Contains "donotreply"
    /^spam/i,                   // Contains "spam"
    /^trash/i,                  // Contains "trash"
    /^junk/i,                   // Contains "junk"
    /^temp/i,                   // Contains "temp"
    /^fake/i,                   // Contains "fake"
    /^test/i,                   // Contains "test"
    /^demo/i,                   // Contains "demo"
    /^example/i,                // Contains "example"
    /^sample/i,                 // Contains "sample"
    /^dummy/i,                  // Contains "dummy"
    /^placeholder/i,            // Contains "placeholder"
    /^123456789/,               // Sequential numbers
    /^abcdefgh/,                // Sequential letters
    /^qwerty/,                  // Common keyboard pattern
    /^asdfgh/,                  // Common keyboard pattern
    /^zxcvbn/,                  // Common keyboard pattern
    /^password/,                // Common word
    /^123123/,                  // Repeated pattern
    /^abcabc/,                  // Repeated pattern
    /^111111/,                  // Repeated numbers
    /^aaaaaa/,                  // Repeated letters
    /^kkjkjkjk/,                // Repeated pattern (like your example)
    /^[a-z]{10,}$/i,           // Too long random letters
    /^[0-9]{10,}$/,            // Too long random numbers
  ];

  // Check if username matches any fake patterns
  for (const pattern of fakePatterns) {
    if (pattern.test(username)) {
      return false;
    }
  }

  // Check for reasonable length (3-30 characters)
  if (username.length < 3 || username.length > 30) {
    return false;
  }

  return true;
}

/**
 * Comprehensive email validation
 * @param {string} email - Email address to validate
 * @returns {Promise<{isValid: boolean, reason?: string}>} - Validation result
 */
async function validateEmail(email) {
  // Check email format
  if (!isValidEmailFormat(email)) {
    return {
      isValid: false,
      reason: "Email format không hợp lệ."
    };
  }

  // Check if email looks like a real email
  if (!looksLikeRealEmail(email)) {
    return {
      isValid: false,
      reason: "Email không hợp lệ. Vui lòng sử dụng email thật."
    };
  }

  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.org', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com',
    'getairmail.com', 'mailnesia.com', 'maildrop.cc', 'yopmail.com',
    'getnada.com', 'mailmetrash.com', 'trashmail.com', 'mailnull.com',
    'test.com', 'example.com', 'invalid.com', 'fake.com', 'dummy.com',
    'sample.com', 'placeholder.com', 'temp.com', 'demo.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return {
      isValid: false,
      reason: "Email tạm thời không được phép sử dụng. Vui lòng sử dụng email thật."
    };
  }

  // Check domain MX records
  const hasValidMX = await hasValidDomain(email);
  if (!hasValidMX) {
    return {
      isValid: false,
      reason: "Email không tồn tại hoặc không hợp lệ."
    };
  }

  return {
    isValid: true
  };
}

module.exports = {
  validateEmail,
  isValidEmailFormat,
  hasValidDomain,
  looksLikeRealEmail
}; 