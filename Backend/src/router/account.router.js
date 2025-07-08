import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAccountBalance,
  getTransactionHistory,
  transfer,
} from "../controllers/account.controller.js";

const router = express.Router();

router.post("/transfer", authMiddleware, transfer);

router.get("/transactions", authMiddleware, getTransactionHistory);
router.get("/balance", authMiddleware, getAccountBalance);

export default router;
