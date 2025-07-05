import { google } from 'googleapis';
import User from '../models/User.js';

const getAuthorizedOAuthClient = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.google.refreshToken) {
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
    const accessTokenResponse = await oAuth2Client.getAccessToken();

    if (!accessTokenResponse || !accessTokenResponse.token) {
      throw new Error("Failed to retrieve access token");
    }

    user.google.accessToken = accessTokenResponse.token;
    await user.save(); // ✅ Save updated access token

    return oAuth2Client;
  } catch (err) {
    console.error("❌ Token refresh failed:", err.message);
    throw new Error("Failed to refresh Google access token");
  }
};

export default getAuthorizedOAuthClient;
