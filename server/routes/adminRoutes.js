import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { adminProtect } from "../middlewares/adminMiddleware.js";
import {
  claimAdminRole,
  deleteResumeByAdmin,
  deleteUser,
  getAdminStats,
  getAllResumes,
  getAllUsers,
  updateUserRole,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Claim admin privilege for the configured administrator email only.
adminRouter.post("/claim-admin", protect, claimAdminRole);

// Administrator protected endpoints
adminRouter.get("/stats", adminProtect, getAdminStats);
adminRouter.get("/users", adminProtect, getAllUsers);
adminRouter.put("/users/:userId/role", adminProtect, updateUserRole);
adminRouter.delete("/users/:userId", adminProtect, deleteUser);
adminRouter.get("/resumes", adminProtect, getAllResumes);
adminRouter.delete("/resumes/:resumeId", adminProtect, deleteResumeByAdmin);

export default adminRouter;
