import express, { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  extractAndUpdateResume,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/extract-update-resume", protect, extractAndUpdateResume);

export default aiRouter;
