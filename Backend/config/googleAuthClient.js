import { google } from 'googleapis';
import User from '../models/User.js';

const getAuthorizedOAuthClient = async (userId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Google authentication required");
  }

  // ✅ DIRECT check (avoid optional chaining)
  if (!user.google.refreshToken || typeof user.google.refreshToken !== 'string') {
    throw new Error("Google authentication required");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: user.google.refreshToken,
  });

  try {
    const { credentials } = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(credentials);

    user.google.accessToken = credentials.access_token;
    user.google.expiryDate = credentials.expiry_date;
    await user.save();

    // console.log("✅ Token refreshed successfully for user:", userId);
    return oAuth2Client;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    throw new Error("Failed to refresh Google access token");
  }
};

export default getAuthorizedOAuthClient;
