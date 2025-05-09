import { Router } from "express";
import {
  getRefreshToken,
  getUser,
  getUserFiles,
  getUserWorkspaces,
  login,
  logout,
  register,
} from "../controllers/users.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", AuthMiddleware, getUser);
router.get("/get/workspaces", AuthMiddleware, getUserWorkspaces);
router.get("/get/files", AuthMiddleware, getUserFiles);
router.post("/logout", AuthMiddleware, logout);
router.get("/refresh-token", AuthMiddleware, getRefreshToken);

export default router;
