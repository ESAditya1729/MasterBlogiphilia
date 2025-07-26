import express from "express";
import { getUserStats } from "../controllers/statsController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/user-stats", protect, getUserStats);

export default router;
