const nodemailer = require('nodemailer');

// Check if email configuration is available
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

// Create transporter only if configuration is available
const createTransporter = () => {
  if (!isEmailConfigured()) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

async function sendVerificationEmail(to, link, isReset = false) {
  try {
    if (!isEmailConfigured()) {
      console.warn('Email configuration missing. Skipping email sending.');
      return;
    }

    const transporter = createTransporter();
    let subject, html;
    if (isReset) {
      subject = 'Đặt lại mật khẩu - Walking Guide';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới để đặt lại mật khẩu mới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p>Nếu nút không hoạt động, hãy sao chép và dán liên kết này vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${link}</p>
          <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        </div>
      `;
    } else {
      subject = 'Verify your email - Walking Guide';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Walking Guide!</h2>
          <p>Thank you for registering! Please verify your email by clicking the link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${link}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    await transporter.sendMail(mailOptions);
    console.log(`Verification/reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending verification/reset email:', error);
    // Don't throw error to prevent registration from failing
  }
}

module.exports = { sendVerificationEmail, isEmailConfigured };
