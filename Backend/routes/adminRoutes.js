import express from "express";
import { createAdminUser, deleteAdminUser, editAdminUser, getAdminUsers, getUserById, getUserform, getUsers, sendAdminCredentials, sendCredentials, updateAdminStatusmanually, updateFormData, updateStatus, updateStatusemployee, updateStatusmanually, Userform } from '../controllers/adminController.js';
const router = express.Router();

router.get("/users", getUsers);
router.post("/update-status", updateStatus);
router.post("/update-admin-status-manually", updateAdminStatusmanually);
router.post("/update-status-manually", updateStatusmanually);
router.post("/update-status-employee", updateStatusemployee);
router.post("/update-admin-status-manually", updateAdminStatusmanually);
router.get("/user/:id", getUserById);
router.post("/send-credentials", sendCredentials);
router.post("/admin-send-credentials", sendAdminCredentials);
router.post("/user-form",Userform);
router.get("/user-form-data",getUserform);
router.post("/admin-user-create",createAdminUser);
router.get("/getadminuser",getAdminUsers);
router.put("/edit-user/:id", editAdminUser);
router.put("/update-form-data/:id", updateFormData);
router.delete("/delete-user/:id", deleteAdminUser);


export default router;
