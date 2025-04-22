import { Router } from "express";
import {
  createFile,
  deleteFile,
  getFiles,
  getFilesById,
  updateFile,
  getFileByWorkspaceId,
} from "../controllers/files.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", AuthMiddleware, createFile);
router.put("/update/:id", AuthMiddleware, updateFile);
router.get("/get", AuthMiddleware, getFiles);
router.get("/get/:id", AuthMiddleware, getFilesById);
router.get("/get/workspace/:workspaceId", AuthMiddleware, getFileByWorkspaceId);
router.delete("/delete/:id", AuthMiddleware, deleteFile);

export default router;
