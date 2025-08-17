import express from "express";
import { generateContent } from "../controllers/assistantController.js";

const router = express.Router();

// POST /api/assistant/generate
router.post("/generate", generateContent);

export default router;
