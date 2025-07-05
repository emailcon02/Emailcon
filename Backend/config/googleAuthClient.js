import { google } from 'googleapis';
import User from '../models/User.js';

const getAuthorizedOAuthClient = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.google?.refreshToken) {
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

    // Save access token to DB (optional)
    user.google.accessToken = accessTokenResponse.token;
    await user.save();

    return oAuth2Client;
  } catch (err) {
    console.error("❌ Token refresh failed:", {
      message: err.message,
      code: err.code,
      errors: err.errors,
      response: err.response?.data,
    });

    // Optional: trigger re-auth if token is expired or invalid
    const reauthUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
    });

    // Instead of throwing just a message, throw an object
    throw {
      message: "Failed to refresh Google access token",
      authUrl: reauthUrl,
    };
  }
};

export default getAuthorizedOAuthClient;
