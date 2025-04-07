// backend/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'marilie78@ethereal.email',
      pass: 'cfapvNyHxXSxnvXVVU'
  }
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// Send the email with the token
async function sendTokenEmail(email, token) {
  try {
    // Create a more user-friendly token display
    const shortToken = `${token.substring(0, 15)}...${token.substring(
      token.length - 15
    )}`;

    const mailOptions = {
      from: `"Auth0 Demo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Authentication Token",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Authentication Successful</h2>
          <p>You have successfully authenticated with our application.</p>
          <p>Here is your authentication token:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; word-break: break-all;">
            ${shortToken}
          </div>
          <p><strong>Note:</strong> This token is sensitive. Do not share it with anyone.</p>
          <p>If you did not request this authentication, please contact us immediately.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  sendTokenEmail,
};
