import express from "express";

import {
  registerUser,
  verifyRegisterOTP,
  resendRegisterOTP,
  loginUser,
  googleLogin,
  logoutUser,
  getMe,
  sendLoginOTP,
  verifyLoginOTP,
} from "../controllers/authController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.post(
  "/register",
  registerUser,
);

router.post(
  "/register/verify-otp",
  verifyRegisterOTP,
);

router.post(
  "/register/resend-otp",
  resendRegisterOTP,
);

router.post(
  "/login",
  loginUser,
);

router.post(
  "/login/send-otp",
  sendLoginOTP,
);

router.post(
  "/login/verify-otp",
  verifyLoginOTP,
);

router.post(
  "/google",
  googleLogin,
);

// ==========================================
// PROTECTED ROUTES
// ==========================================

router.get(
  "/me",
  auth,
  getMe,
);

router.post(
  "/logout",
  auth,
  logoutUser,
);

export default router;