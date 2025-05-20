import express from "express";
import { createAdminUser, getAdminUsers, getUserById, getUserform, getUsers, sendCredentials, updateStatus, updateStatusmanually, Userform } from '../controllers/adminController.js';
const router = express.Router();

router.get("/users", getUsers);
router.post("/update-status", updateStatus);
router.post("/update-status-manually", updateStatusmanually);
router.get("/user/:id", getUserById);
router.post("/user-form",Userform);
router.get("/user-form-data",getUserform);
router.post("/admin-user-create",createAdminUser);
router.get("/getadminuser",getAdminUsers);




export default router;
