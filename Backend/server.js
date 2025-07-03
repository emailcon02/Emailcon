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
// Enhanced Google OAuth endpoint
app.get('/auth/google', (req, res) => {
  // Verify required environment variables
  const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return res.status(500).json({ 
      error: "Server configuration error",
      missingVariables: missingVars
    });
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
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
      // Include these to ensure they're in the URL
      include_granted_scopes: true
    });

    console.log('Generated Auth URL:', authUrl);
    return res.redirect(authUrl);
  } catch (err) {
    console.error('Error generating auth URL:', err);
    return res.status(500).json({ 
      error: "Failed to initiate OAuth flow",
      details: err.message 
    });
  }
});

// Enhanced callback handler
app.get('/oauth2callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    // Handle OAuth errors from Google
    if (error) {
      throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error("Missing authorization code or state");
    }

    let parsedState;
    try {
      parsedState = JSON.parse(decodeURIComponent(state));
    } catch (err) {
      throw new Error("Invalid state parameter format");
    }

    const { userId } = parsedState;
    if (!userId) {
      throw new Error("User ID missing in state");
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user with token information
    user.google = {
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      tokenType: tokens.token_type,
      ...(tokens.refresh_token && { refreshToken: tokens.refresh_token })
    };

    await user.save();

    // More robust redirect handling
    const redirectUrl = new URL(`${apiconfigfrontend.baseURL}/user-login`);
    redirectUrl.searchParams.set('success', 'true');
    return res.redirect(redirectUrl.toString());
    
  } catch (err) {
    console.error("OAuth2 error:", err);
    
    const redirectUrl = new URL(`${apiconfigfrontend.baseURL}/auth-warning`);
    redirectUrl.searchParams.set('error', encodeURIComponent(err.message));
    return res.redirect(redirectUrl.toString());
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