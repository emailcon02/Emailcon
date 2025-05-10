import express from "express";
import { getUserform, getUsers, updateStatus, Userform } from '../controllers/adminController.js';
const router = express.Router();

router.get("/users", getUsers);
router.post("/update-status", updateStatus);
router.post("/user-form",Userform);
router.get("/user-form-data",getUserform)


export default router;
