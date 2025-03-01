import { Router } from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspaces.controllers.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", AuthMiddleware, createWorkspace);
router.get("/:workspaceId", AuthMiddleware, getWorkspaceById);
router.get("/", AuthMiddleware, getWorkspaces);
router.get("/user-workspaces", AuthMiddleware, getUserWorkspaces);
router.put("/:workspaceId", AuthMiddleware, updateWorkspace);
router.delete("/:workspaceId", AuthMiddleware, deleteWorkspace);

export default router;
