import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAccountBalance,
  transfer,
} from "../controllers/account.controller.js";

const router = express.Router();

router.post("/transfer", authMiddleware, transfer);

router.get("/balance", authMiddleware, getAccountBalance);

export default router;
