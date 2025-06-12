import express from "express";
import { signup, login, sendOtp, resetPassword, adminLogin,updateUserpassword, updateUsersmtppassword, updateUseravatar, updateAdminUserpassword, employeesignup } from '../controllers/authController.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/employee-signup", employeesignup);
router.post("/login", login);
router.post("/send-otp",sendOtp);
router.post("/reset-password",resetPassword);
router.post("/admin-login",adminLogin); // Admin login route
router.put("/update-password",updateUserpassword); // Update password route
router.put("/update-admin-password",updateAdminUserpassword); // Update password route
router.put("/update-smtp-password",updateUsersmtppassword); // Update user password route
router.put("/update-avatar",updateUseravatar); // Update user avatar route

export default router;