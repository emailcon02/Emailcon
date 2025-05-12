import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { encryptPassword } from "../config/encryption.js";
import nodemailer from "nodemailer";
import apiconfigfrontend from "../api/apiconfigfrontend.js";
import otptransporter from "../config/otp-mailer.js";
import resettransporter from "../config/reset-mailer.js";

export const signup = async (req, res) => {
  const { email, username, password, smtppassword, gender } = req.body;

  try {
    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or username." });
    }

    // Validate SMTP credentials only for Gmail addresses
    if (email.includes("@gmail.com")) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: email,
          pass: smtppassword,
        },
      });

      try {
        await transporter.verify();
      } catch (smtpError) {
        console.error("SMTP verification failed:", smtpError);
        return res.status(400).json({
          message:
            "Invalid Gmail SMTP credentials. Please check your email or app password.",
        });
      }
    }

    // Encrypt SMTP password
    const encryptedSmtpPassword = encryptPassword(smtppassword);

    // Save user to DB
    const user = new User({
      email,
      username,
      gender,
      password, // Use bcrypt to hash this in production
      smtppassword: encryptedSmtpPassword,
      paymentStatus: "pending",
      isActive: false,
    });

    await user.save();

    res.status(201).json({
      message: "Your details are saved. Wait for account activation.",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving user." });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    if (!user.isActive) return res.status(403).send("Account not activated.");
    if (password !== user.password) {
      return res.status(401).send("Invalid credentials.");
    }
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).send("Login failed.");
  }
};
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit random OTP


    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2f327d; margin-bottom: 5px;">🔐 Password Reset Request</h2>
      <p style="color: #555; font-size: 15px;">Use the OTP below to reset your password.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 36px; color: #222; letter-spacing: 4px; font-weight: bold; background-color: #fff; padding: 15px 25px; border: 2px dashed #f48c06; border-radius: 8px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #666; text-align: center;">
      This OTP is valid for a limited time only. If you did not request a password reset, please ignore this email.
    </p>

    <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #aaa;">
      <p>Thank you,<br>Team Emailcon</p>
    </div>
  </div>
`;


    await otptransporter.sendMail({
      from: `"Emailcon Support" <code-noreply@account.emailcon.in>`,
      to: email || user.email,
      replyTo:"support@emailcon.in",
      subject: "Password Reset OTP",
      html: htmlContent,
    });
    res.json({ message: "OTP sent", otp: otp.toString() }); // return OTP for frontend matching
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send OTP");
  }
};
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    user.password = password; 
    await user.save();
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f6f8; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #198754;">✅ Password Updated Successfully</h2>
        <p style="color: #333; font-size: 15px;">Your password has been changed. If you did not perform this action, please contact support immediately.</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${apiconfigfrontend.baseURL}" style="display: inline-block; background-color: #198754; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login Now</a>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #aaa;">
        <p>Thanks,<br>Team Emailcon</p>
      </div>
    </div>
    `;

    await resettransporter.sendMail({
      from: `"Emailcon Support" <reset-noreply@account.emailcon.in>`,
      to: email || user.email,
      subject: "Your Password Has Been Updated",
      replyTo:"support@emailcon.in",
      html: htmlContent,
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to reset password");
  }
};


// Dummy Admin Credentials
const ADMIN_EMAIL = "admin@emailcon.com";
const ADMIN_PASSWORD = "admin123";
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: "secret_key" // you should ideally generate JWT token here
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
export const updateUserpassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {password: newPassword }, // Directly set new password (no hashing)
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err });
  }
} 
export const updateUseravatar = async (req, res) => {
  const { userId,avatar,username,gender } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar,username,gender }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profiile updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  }
} 

export const updateUsersmtppassword = async (req, res) => {
  const { userId, newSmtpPassword, userEmail } = req.body;

  if (!userId || !newSmtpPassword || !userEmail) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Validate SMTP credentials
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: userEmail,
      pass: newSmtpPassword,
    },
  });

  try {
    await transporter.verify();
  } catch (err) {
    // SMTP authentication failed
    return res.status(400).json({ message: "Invalid SMTP credentials. Please check your email or app password." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { smtppassword: newSmtpPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "SMTP password updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating SMTP password", error: err });
  }
};
