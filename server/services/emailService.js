const nodemailer = require("nodemailer");

// Create transporter (using Gmail as example - configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email verification
const sendVerificationEmail = async (email, token) => {
  try {
    // For development/testing - just log the verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    console.log("📧 Verification Email (Development Mode):");
    console.log(`To: ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log("In production, this would send an actual email.");

    // Uncomment the following lines when you have email configured:
    /*
    const transporter = createTransporter();
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
    */
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    // For development/testing - just log the reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("📧 Password Reset Email (Development Mode):");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("In production, this would send an actual email.");

    // Uncomment the following lines when you have email configured:
    /*
    const transporter = createTransporter();
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
    */
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
