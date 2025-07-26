import express from "express";
import { getUserStats,getTotalPublishedBlogs  } from "../controllers/statsController.js";
import { protect }  from "../middleware/auth.js";

const router = express.Router();

router.get("/user-stats", protect, getUserStats);
router.get("/published-blogs", protect, getTotalPublishedBlogs);

export default router;
