import { Router } from "express";
import {
  getUser,
  getUserFiles,
  getUserWorkspaces,
  login,
  logout,
  register,
} from "../controllers/users.controllers.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", AuthMiddleware, getUser);
router.get("/workspaces", AuthMiddleware, getUserWorkspaces);
router.get("/files", AuthMiddleware, getUserFiles);
router.post("/logout", AuthMiddleware, logout);

export default router;
