import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/balance", authMiddleware, getAccountBalance);

export default router;
