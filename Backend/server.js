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
import apiconfigbackend from './api/apiconfigbackend.js';
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
  console.log('CLIENT_ID:', process.env.CLIENT_ID);
  console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
  console.log('REDIRECT_URI:', process.env.REDIRECT_URI); 
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI // Make sure this matches exactly
  );

  const state = encodeURIComponent(JSON.stringify({ userId }));
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid'
    ],
    state,
    redirect_uri: process.env.REDIRECT_URI // Explicitly include this
  });
  
  console.log('Generated Auth URL:', authUrl); // For debugging
  res.redirect(authUrl);
});

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

    // Verify the user exists before storing tokens
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Always update these fields
    user.google = {
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      tokenType: tokens.token_type,
      ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }) // Only update if new refresh token
    };

    await user.save();

    return res.redirect(`${apiconfigfrontend.baseURL}/user-login?success=true`);
  } catch (err) {
    console.error("OAuth2 error:", err);
    return res.redirect(`${apiconfigfrontend.baseURL}/auth-warning?error=${encodeURIComponent(err.message)}`);
  }
});

app.get('/debug/oauth-config', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date()
  });
});

// Temporary test route
app.get('/api/test-oauth/:id', async (req, res) => {
  try {
    const oAuth2Client = await getAuthorizedOAuthClient(req.params.id);
    res.send("✅ Token refresh and OAuth client ready");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ " + err.message);
  }
});


// Routes
app.use('/stud', studentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/order", createOrderRoute);

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