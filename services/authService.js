// backend/services/authService.js
const axios = require("axios");

async function validateToken(token) {
  try {
    // Use Auth0's userinfo endpoint to validate the token
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("validateToken: response", response.data);
    return response.status === 200;
  } catch (error) {
    console.error(
      "Token validation with userinfo endpoint failed:",
      error.message
    );
  }
}

module.exports = {
  validateToken,
};
