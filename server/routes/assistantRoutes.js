import express from "express";
import { generateContent } from "../controllers/assistantController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/assistant/generate
router.post("/generate", protect, generateContent);

export default router;
