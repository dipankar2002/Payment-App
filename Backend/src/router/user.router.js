import express from "express";
import {
  checkUser,
  login,
  logout,
  signUp,
  users,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();



router.get("/check", authMiddleware, checkUser);
router.get("/allUsers", authMiddleware, users);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
