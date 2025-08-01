import express from "express";
import {
  checkUser,
  deleteUser,
  login,
  logout,
  signUp,
  updateProfileImage,
  updateUserDetails,
  updateUserPassword,
  users,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.delete("/deleteUser", authMiddleware, deleteUser);

router.put("/updateUserPassword", authMiddleware, updateUserPassword);
router.put("/updateProfileImg", authMiddleware, updateProfileImage);
router.put("/updateUserDetails", authMiddleware, updateUserDetails);

router.get("/check", authMiddleware, checkUser);
router.get("/allUsers", authMiddleware, users);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
