import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { decryptPassword, encryptPassword } from "../config/encryption.js";
import nodemailer from "nodemailer";
import apiConfig from "../api/apiconfigfrontend.js";
import otptransporter from "../config/otp-mailer.js";
import resettransporter from "../config/reset-mailer.js";
import Adminuser from "../models/Adminuser.js";


export const signup = async (req, res) => {
  const { email, username, password, smtppassword, gender,phone } = req.body;

  try {
    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // If user exists but hasn't completed signup
      if (!existingUser.isActive) {
        await User.deleteOne({ _id: existingUser._id }); // Delete incomplete user
      } else {
        return res.status(400).json({
          message: "User already exists with this email or username.",
        });
      }
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
    const encryptedUserPassword = encryptPassword(password);


    // Save user to DB
    const user = new User({
      email,
      username,
      gender,
      phone,
      password: encryptedUserPassword, 
      smtppassword: encryptedSmtpPassword,
      paymentStatus: "pending",
      isActive: false,
      role:"demo",
    });

    await user.save();

    res.status(201).json({
      message: "Your details are saved",
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

export const employeesignup = async (req, res) => {
  const { email, username, password, smtppassword, gender,phone} = req.body;

  try {
    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // If user exists but hasn't completed signup
      if (!existingUser.isActive) {
        await User.deleteOne({ _id: existingUser._id }); // Delete incomplete user
      } else {
        return res.status(400).json({
          message: "User already exists with this email or username.",
        });
      }
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
    const encryptedUserPassword = encryptPassword(password);


    // Save user to DB
    const user = new User({
      email,
      username,
      gender,
      phone,
      role:"employee",
      password: encryptedUserPassword, 
      smtppassword: encryptedSmtpPassword,
      paymentStatus: "pending",
      isActive: false,
    });

    await user.save();

    res.status(201).json({
      message: "Your details are saved",
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
    const newEncryptedPassword = decryptPassword(user.password);
    if (newEncryptedPassword !== password) {
      return res.status(401).send("Invalid credentials.");
    }
    if (user.isActive === false && user.role === "employee") return res.status(404).send("Account not activated contact admin.");
    if (user.isActive === false && user.role === "demo") return res.status(404).send("Account not activated wait for admin response.");

    const latestPayment = await PaymentHistory.findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    if (!latestPayment) {
      return res.status(403).send("No payment history found.");
    }

    if (latestPayment.paymentStatus === "pending") {
      return res.status(403).send("Account not activated.");
    }


    if (latestPayment.paymentStatus === "expired" || user.isActive === false) {
      return res.status(402).json({
        message: "Payment expired.",
        expiryDate: latestPayment.expiryDate,
        userId:latestPayment.userId
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10d" });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
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
 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
  <div style="text-align:center; margin-bottom:20px; background:#2f327d; color:white; padding:20px;">
  <h1 style="font-size:30px; text-align:center;">🔐</h1>
  <h2 style="color:white;margin-bottom:5px; text-align:center;">Email<span style="color:#f48c06;">con</span> Password Reset Request</h2>
</div>

  <div style="text-align: center; margin: 30px 0;">
     <p style="color: #555; font-size: 15px;">Use the OTP below to reset your password.</p>
    <span style="font-size: 36px; color: #222; letter-spacing: 4px; font-weight: bold; background-color: #fff; padding: 15px 25px; border: 2px dashed #f48c06; border-radius: 8px;">
        ${otp}
      </span>
  </div>

  <p style="font-size: 14px; color: #666; text-align: center;">
    This OTP is valid for a 1 min only. If you did not request a password reset, please ignore this message.
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
    const newPassword = encryptPassword(password);
    if (newPassword === user.password) {
      return res.status(400).send("New password cannot be the same as the old password.");
    }
    user.password = newPassword; 
    await user.save();
    const htmlContent = `
<div style="max-width: 600px; margin: auto; background-color: #f4f6f8; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
    <!-- Header Section -->
    <div style="background-color: #2f327d; color: white; padding: 20px; text-align: center;">
     <h1 style="font-size: 32px; color: #f48c06;">✉️</h1>
      <p style="margin: 8px 0 0; font-size: 16px;">
         Email<span style="color: #f48c06;">con</span> Password Updated Successfully
      </p>
    </div>

    <!-- Content Section -->
    <div style="padding: 30px; text-align: center;">
      <p style="color: #333; font-size: 15px; margin-bottom: 30px;">
        Your password has been changed. If you did not perform this action, please contact support immediately.
      </p>

      <a href="${apiConfig.baseURL}/user-login" style="display: inline-block; background-color: #2f327d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Login Now
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; text-align: center; font-size: 13px; color: #aaa;">
      <p style="margin: 0;">Thanks,<br>Team Emailcon</p>
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


const ADMIN_EMAIL = "admin@emailcon.com";
const ADMIN_PASSWORD = "Superadmin123";
const ADMIN_ROLE = "super-admin";

export const adminLogin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // 1. SUPER-ADMIN HARDCODED LOGIN
    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD &&
      role === ADMIN_ROLE
    ) {
      return res.json({
        success: true,
        role: ADMIN_ROLE,
        token: "super_admin_token",
      });
    }

    // 2. NORMAL ADMIN OR USER FROM DB
    const user = await Adminuser.findOne({ email, role });
    if (!user) {
      return res.status(404).json({message: "User not found" });
    }

    // OPTIONAL: Use bcrypt if passwords are hashed
    const isMatch = password === user.password; 
    if (!isMatch) {
      return res.status(401).json({message: "Invalid password" });
    }

    if(user.isActive === false){
      return res.status(403).json({ message: "Account not activated" });
    }
    
    res.json({
      success: true,
      role: user.role,
      userId:user._id,
      token: "sub-admin-token", // send real JWT token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({message: "Server error" });
  }
};


export const updateUserpassword = async (req, res) => {
  const { userId, newPassword ,oldPassword} = req.body;

  const user=await User.findById(userId);

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const oldencrpytedPassword = decryptPassword(user.password);
   if (oldencrpytedPassword !== oldPassword) {
    return res.status(400).json({ message: "old password is mismatched." });
  } 
  const newencrpytedPassword = encryptPassword(newPassword);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newencrpytedPassword }, // Ensure this is hashed if needed
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compose HTML email
    const htmlContent = `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f6f8; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #2f327d;color:white;padding: 20px;text-align:center;">
          <h1 style="font-size: 32px; color: #f48c06;">✉️</h1>
          <h2>Email<span style="color: #f48c06;">con</span> Password Updated Successfully</h2>
        </div>
        <div style="text-align:center; margin:30px 0px;">
        <p style="color: #333; font-size: 15px;">Hello <strong>${updatedUser.username || updatedUser.email}</strong>,<br>Your password has been changed. If you did not perform this action, please contact support immediately.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${apiConfig.baseURL}/user-login" style="display: inline-block; background-color: #2f327d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login Now</a>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #aaa;">
          <p>Thanks,<br>Team Emailcon</p>
        </div>
      </div>
    `;

    // Send mail
    await resettransporter.sendMail({
      from: `"Emailcon Support" <reset-noreply@account.emailcon.in>`,
      to: updatedUser.email,
      subject: "Your Password Has Been Updated",
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.json({ message: "Password updated and email sent", updatedUser });
  } catch (err) {
    console.error("Error updating password or sending email:", err);
    res.status(500).json({ message: "Error updating password or sending email", error: err });
  }
};


export const updateAdminUserpassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  const user=await Adminuser.findById(userId);

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (newPassword === user.password) {
    return res.status(400).json({ message: "New password cannot be the same as the old password." });
  }

  try {
    const updatedUser = await Adminuser.findByIdAndUpdate(
      userId,
      { password: newPassword }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compose HTML email
    const htmlContent = `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f6f8; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #2f327d;color:white;padding: 20px;text-align:center;">
          <h1 style="font-size: 32px; color: #f48c06;">✉️</h1>
          <h2>Email<span style="color: #f48c06;">con</span> Password Updated Successfully</h2>
        </div>
        <div style="text-align:center; margin:30px 0px;">
        <p style="color: #333; font-size: 15px;">Hello <strong>${updatedUser.username || updatedUser.email}</strong>,<br>Your password has been changed. If you did not perform this action, please contact support immediately.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${apiConfig.baseURL}/admin-login" style="display: inline-block; background-color: #2f327d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login Now</a>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #aaa;">
          <p>Thanks,<br>Team Emailcon</p>
        </div>
      </div>
    `;

    // Send mail
      await resettransporter.sendMail({
      from: `"Emailcon Support" <reset-noreply@account.emailcon.in>`,
      to: updatedUser.email,
      subject: "Your Password Has Been Updated",
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.json({ message: "Password updated Successfully", updatedUser });
  } catch (err) {
    console.error("Error updating password or sending email:", err);
    res.status(500).json({ message: "Error updating password or sending email", error: err });
  }
};


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
