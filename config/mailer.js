const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.E_PASS,
  },
});

async function sendMail(to, otp) {
  try {
    if (!to || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(to)) {
      throw new Error('Invalid email address');
    }

    const text = `Dear user,\n\nThank you for registering with Qezee. Your One-Time Password (OTP) is ${otp}. Please use this OTP to complete your registration.\n\nBest regards,\nQezee Team`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Welcome to Qezee!</h2>
        <p>Dear user,</p>
        <p>Thank you for registering with Qezee. Your One-Time Password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</div>
        <p>Please use this OTP to complete your registration. The OTP is valid for 5 minutes.</p>
        <p>Best regards,<br>Qezee Team</p>
        <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777;">If you did not initiate this request, please ignore this email.</p>
        </div>
      </div>
    `;
   
    const info = await transporter.sendMail({
      from: `"Qezee Team" <${process.env.EMAIL}>`,
      to: to,
      subject: "OTP Verification from Qezee",
      text: text,
      html: html,
    });
    console.log("Email Sent: %s", info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendMailpasswordreset(to, content) {
  const text = `Click here to reset your password: ${content}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Password Reset Request</h2>
      <p>To reset your password, please click the link below:</p>
      <a href="${content}" style="color: #007bff;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Qezee Team" <${process.env.EMAIL}>`,
    to: to,
    subject: "Password Reset Request",
    text: text,
    html: html,
  });
  console.log("Email Sent: %s", info.messageId);
}

module.exports = {
  sendMail,
  sendMailpasswordreset
};
