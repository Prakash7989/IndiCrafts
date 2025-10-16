const nodemailer = require("nodemailer");

// Create transporter (uses EMAIL_HOST/EMAIL_PORT if provided, otherwise falls back to Gmail service)
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment to send emails');
  }

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined;

  const auth = { user, pass };

  const transporterOptions = host
    ? {
        host,
        port,
        secure: port === 465, // true for 465, false for 587
        auth,
      }
    : {
        service: 'gmail',
        auth,
      };

  return nodemailer.createTransport(transporterOptions);
};

// Send email verification
const sendVerificationEmail = async (email, token) => {
  try {
    // For development/testing - just log the verification URL
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:8080';
    const verificationUrl = `${frontendBase}/verify-email?token=${token}`;
    console.log("📧 Verification Email (Development Mode):");
    console.log(`To: ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log("In production, this would send an actual email.");
    // Try to send the email if credentials are present. Keep development-friendly logging.
    let transporter;
    try {
      transporter = createTransporter();
    } catch (err) {
      // Missing credentials — we already logged the URL above. Do not throw here to avoid failing registration.
      console.warn('Email transporter not configured:', err.message);
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your IndiCrafts Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d2691e;">Welcome to IndiCrafts!</h2>
          <p>Thank you for registering with IndiCrafts. Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #d2691e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    // For development/testing - just log the reset URL
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendBase}/reset-password?token=${token}`;
    console.log("📧 Password Reset Email (Development Mode):");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("In production, this would send an actual email.");

    // Try to create transporter if email credentials are present
    let transporter;
    try {
      transporter = createTransporter();
    } catch (err) {
      console.warn('Email transporter not configured:', err.message);
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your IndiCrafts Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d2691e;">Password Reset Request</h2>
          <p>You requested to reset your password for your IndiCrafts account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #d2691e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
