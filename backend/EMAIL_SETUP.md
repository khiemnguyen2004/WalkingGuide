# Email Configuration Setup

## Problem
You're getting the error: `Error: Missing credentials for "PLAIN"` when trying to register users. This happens because the email service is not properly configured.

## Solution

### 1. Create Environment File
Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=walking_guide
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

### 2. Gmail App Password Setup

**Important**: For Gmail, you must use an App Password, not your regular password.

#### Steps to generate Gmail App Password:

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Click on "Security"
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Click on "Security"
   - Under "Signing in to Google", click on "App passwords"
   - Select "Mail" as the app and "Other" as the device
   - Click "Generate"
   - Copy the 16-character password

3. **Use the App Password**:
   - Replace `your_app_password_here` in the `.env` file with the generated password
   - Replace `your_email@gmail.com` with your actual Gmail address

### 3. Alternative Email Services

If you prefer not to use Gmail, you can modify the email configuration in `src/utils/email.js`:

#### For Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

#### For Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 4. Test Email Configuration

After setting up the environment variables, restart your backend server and try registering a new user. You should see:
- No more SMTP errors
- A verification email sent to the registered email address
- A success message in the console: "Verification email sent to [email]"

### 5. Troubleshooting

- **"Invalid login" error**: Make sure you're using an App Password, not your regular Gmail password
- **"Less secure app access" error**: This is deprecated by Google. Use App Passwords instead
- **"Connection timeout"**: Check your internet connection and firewall settings
- **"Authentication failed"**: Double-check your email and app password

### 6. Development vs Production

For development, you can:
- Use a test Gmail account
- Set up email forwarding to your main account
- Use services like Mailtrap for testing

For production, consider:
- Using a dedicated email service (SendGrid, Mailgun, etc.)
- Setting up proper SPF/DKIM records
- Using environment-specific configurations 