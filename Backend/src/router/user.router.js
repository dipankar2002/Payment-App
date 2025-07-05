import express from "express";
import {
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();



router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
