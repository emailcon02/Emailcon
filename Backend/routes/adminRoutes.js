import express from "express";
import { getUserById, getUserform, getUsers, sendCredentials, updateStatus, Userform } from '../controllers/adminController.js';
const router = express.Router();

router.get("/users", getUsers);
router.post("/update-status", updateStatus);
router.get("/user/:id", getUserById);
router.post("/user-form",Userform);
router.get("/user-form-data",getUserform)
router.post("/send-credentials",sendCredentials)


export default router;
