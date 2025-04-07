// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const emailService = require("../services/emailService");

// Handle the callback from the frontend
router.post("/callback", async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log(
      "Received callback with token and email:",
      token ? "Token present" : "No token",
      email
    );

    if (!token || !email) {
      return res.status(400).json({ message: "Token and email are required" });
    }

    const isValid = await authService.validateToken(token);

    console.log("Token validation result:", isValid);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      // Send email with the token
      console.log("Sending email to:", email);
      await emailService.sendTokenEmail(email, token);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(200).json({
      message: "Authentication successful! Token has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in /auth/callback:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
