import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  getMe,
} from "../controllers/authController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// Protected Routes
router.get("/me", auth, getMe);
router.post("/logout", auth, logoutUser);

export default router;