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

// Load environment variables with explicit path
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Validate required environment variables
const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('FATAL: Missing required environment variables:', missingVars);
  process.exit(1);
}

console.log('OAuth Configuration Verified:', {
  clientId: !!process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI,
  environment: process.env.NODE_ENV
});

// Connect to MongoDB
connectDB();

const app = express();

// Enhanced CORS configuration
app.use(cors());

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.get('/auth/google', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ 
      error: "User ID required",
      solution: "Add ?userId=YOUR_USER_ID to the request"
    });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    const state = encodeURIComponent(JSON.stringify({ 
      userId,
      timestamp: Date.now(),
      source: 'emailcon'
    }));

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
      include_granted_scopes: true
    });

    console.log(`Generated Auth URL for user ${userId}`);
    return res.redirect(authUrl);
  } catch (err) {
    console.error('OAuth Initiation Error:', err);
    return res.status(500).redirect(
      `${apiconfigfrontend.baseURL}/auth-error?message=${encodeURIComponent(err.message)}`
    );
  }
});

/**
 * Google OAuth Callback Handler
 * Route: /api/oauth2callback
 */
app.get('/oauth2callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    // Handle OAuth errors from Google
    if (error) {
      throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error("Missing required parameters: code and state");
    }

    // State validation
    let parsedState;
    try {
      parsedState = JSON.parse(decodeURIComponent(state));
    } catch (err) {
      throw new Error("Invalid state parameter format");
    }

    const { userId, timestamp, source } = parsedState;
    if (!userId || !timestamp || source !== 'emailcon') {
      throw new Error("Invalid state data");
    }

    // State timestamp validation (10 minute expiry)
    const stateAge = Date.now() - timestamp;
    if (stateAge > 10 * 60 * 1000) {
      throw new Error("OAuth session expired - please try again");
    }

    // Initialize OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Verify and update user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found in database");
    }

    // Store tokens securely
    user.google = {
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      tokenType: tokens.token_type,
      ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
      lastAuth: new Date()
    };

    await user.save();

    // Successful redirect
    const redirectUrl = new URL(`${apiconfigfrontend.baseURL}/user-login`);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('userId', userId);
    return res.redirect(redirectUrl.toString());
    
  } catch (err) {
    console.error("OAuth Callback Error:", err);
    
    const redirectUrl = new URL(`${apiconfigfrontend.baseURL}/auth-error`);
    redirectUrl.searchParams.set('error', encodeURIComponent(err.message));
    return res.redirect(redirectUrl.toString());
  }
});

// Debug endpoint to verify configuration
app.get('/debug/oauth-config', (req, res) => {
  res.json({
    status: 'active',
    clientId: process.env.CLIENT_ID ? 'configured' : 'missing',
    redirectUri: process.env.REDIRECT_URI,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date(),
    frontendBase: apiconfigfrontend.baseURL
  });
});

// OAuth test endpoint
app.get('/api/test-oauth/:id', async (req, res) => {
  try {
    const oAuth2Client = await getAuthorizedOAuthClient(req.params.id);
    res.json({
      status: "success",
      message: "OAuth client is ready",
      client: {
        credentials: oAuth2Client.credentials
      }
    });
  } catch (err) {
    console.error("OAuth Test Error:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      solution: "Check user's OAuth tokens and refresh if needed"
    });
  }
});

// Application Routes
app.use('/stud', studentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/order", createOrderRoute);

// Basic health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'EmailCon API',
    version: '1.0',
    timestamp: new Date()
  });
});

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableEndpoints: [
      '/auth/google',
      '/oauth2callback',
      '/stud',
      '/auth',
      '/admin',
      '/order'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    requestId: req.id,
    timestamp: new Date()
  });
});

// Server startup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`OAuth Redirect URI: ${process.env.REDIRECT_URI}`);
});