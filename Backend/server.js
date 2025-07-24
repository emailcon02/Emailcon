import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/MainRoutes.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import './config/cron-scheduler.js';
import './config/cron-birthday.js';
import './config/cron-userexpiry.js';
import createOrderRoute from './routes/create-order.js';
import { google } from 'googleapis';
import User from './models/User.js';
// import apiconfigbackend from './api/apiconfigbackend.js';
import apiconfigfrontend from './api/apiconfigfrontend.js';
import getAuthorizedOAuthClient from './config/googleAuthClient.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - CORRECTED VERSION
app.use(cors());
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true })); 


//google end-point
app.get('/auth/google', (req, res) => {  
  const { userId } = req.query; // Important for associating with your user
  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const state = encodeURIComponent(JSON.stringify({ userId }));
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    state,
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid'
    ]
  });
  res.redirect(authUrl);
});
// Modified /oauth2callback endpoint
// Modified /oauth2callback endpoint
app.get('/oauth2callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      throw new Error("Missing authorization code or state");
    }

    const { userId } = JSON.parse(decodeURIComponent(state));
    if (!userId) {
      throw new Error("Invalid state parameter");
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Check if the required scope is present
    const grantedScopes = tokens.scope?.split(' ') || [];
    const hasGmailSend = grantedScopes.includes('https://www.googleapis.com/auth/gmail.send');
    const retryUrl = `${apiconfigfrontend.baseURL}/api/auth/google?userId=${userId}`;

    if (!hasGmailSend) {
      return res.redirect(`${apiconfigfrontend.baseURL}/auth-warning?message=Gmail send scope permission not granted. Please enable it to continue.&userId=${userId}&redirectTo=${encodeURIComponent(retryUrl)}`);

    }

    // Fetch user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.email.toLowerCase() !== googleEmail.toLowerCase()) {
      return res.redirect(`${apiconfigfrontend.baseURL}/auth-warning?message=Google auth email mismatch&email=${googleEmail}&userId=${userId}&redirectTo=${encodeURIComponent(retryUrl)}`);
    }

    // Save tokens if scope and email match
    user.google = {
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      tokenType: tokens.token_type,
      ...(tokens.refresh_token && { refreshToken: tokens.refresh_token })
    };

    await user.save();

    return res.redirect(`${apiconfigfrontend.baseURL}/user-login?success=true`);
  } catch (err) {
    console.error("OAuth2 error:", err);
    return res.redirect(`${apiconfigfrontend.baseURL}/auth-warning?error=${encodeURIComponent(err.message)}`);
  }
});

//Temporary test route
app.get('/test-oauth/:id', async (req, res) => {
  try {
    const client = await getAuthorizedOAuthClient(req.params.id);
    res.send("✅ Token refresh and OAuth client ready");
  } catch (err) {
    console.error("❌ Error in /api/test-oauth:", err);

    if (err.authUrl) {
      return res.status(401).json({
        error: err.message,
        authUrl: err.authUrl,
      });
    }

    res.status(500).send("❌ " + err.message);
  }
});


// Routes
app.use('/api/stud', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/order', createOrderRoute);

app.get('/', (req, res) => {
    res.json('Hello demo route welcome');
});

// Error Handling
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));