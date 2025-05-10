import express from "express";
import { signup, login, sendOtp, resetPassword, adminLogin,updateUserpassword, updateUsersmtppassword, updateUseravatar } from '../controllers/authController.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp",sendOtp);
router.post("/reset-password",resetPassword);
router.post("/admin-login",adminLogin); // Admin login route
router.put("/update-password",updateUserpassword); // Update password route
router.put("/update-smtp-password",updateUsersmtppassword); // Update user password route
router.put("/update-avatar",updateUseravatar); // Update user avatar route

export default router;