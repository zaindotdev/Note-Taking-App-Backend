import { Router } from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspaces.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", AuthMiddleware, createWorkspace);
router.get("/get/:workspaceId", AuthMiddleware, getWorkspaceById);
router.get("/get", AuthMiddleware, getWorkspaces);
router.get("/get/user-workspaces", AuthMiddleware, getUserWorkspaces);
router.put("/update/:workspaceId", AuthMiddleware, updateWorkspace);
router.delete("/delete/:workspaceId", AuthMiddleware, deleteWorkspace);

export default router;
