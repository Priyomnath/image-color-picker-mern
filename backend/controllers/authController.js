import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import OTP from "../models/OTP.js";

import { generateToken } from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/email.js";

// ==========================================
// GOOGLE CLIENT
// ==========================================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// COOKIE OPTIONS
// ==========================================

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ==========================================
// GENERATE OTP
// ==========================================

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// ==========================================
// REGISTER - SEND OTP
// ==========================================

// ==========================================
// REGISTER - SEND OTP
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // IMPORTANT: 30 seconds
    const expiresAt = new Date(
      Date.now() + 30 * 1000
    );

    // Remove old register OTP
    await OTP.deleteMany({
      email: normalizedEmail,
      purpose: "register",
    });

    // Save OTP
    await OTP.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      purpose: "register",

      name: normalizedEmail.split("@")[0],

      passwordHash: null,
    });

    // Send email
    try {
      await sendOTPEmail(
        normalizedEmail,
        otp
      );
    } catch (emailError) {
      console.error(
        "REGISTER OTP EMAIL FAILED:",
        emailError
      );

      await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "register",
      });

      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      requiresVerification: true,
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start registration",
    });
  }
};

// ==========================================
// VERIFY REGISTER OTP
// ==========================================

export const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // =========================================
    // VALIDATION
    // =========================================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedOTP = String(otp).trim();

    if (!/^\d{6}$/.test(normalizedOTP)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be 6 digits",
      });
    }

    // =========================================
    // FIND REGISTER OTP
    // =========================================

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "register",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired or not found",
      });
    }

    // =========================================
    // EXPIRY CHECK
    // =========================================

    if (
      !otpRecord.expiresAt ||
      Date.now() > new Date(otpRecord.expiresAt).getTime()
    ) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    // =========================================
    // ATTEMPT LIMIT
    // =========================================

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts",
      });
    }

    // =========================================
    // VERIFY OTP
    // =========================================

    const isValid = await bcrypt.compare(normalizedOTP, otpRecord.otpHash);

    if (!isValid) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // =========================================
    // CHECK AGAINST EXISTING USER
    // =========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    // =========================================
    // CREATE USER ONLY AFTER OTP SUCCESS
    // =========================================

    // const user = await User.create({
    //   name:
    //     otpRecord.name ||
    //     "User",

    //   email: normalizedEmail,

    //   password: otpRecord.passwordHash,

    //   isVerified: true,

    //   picture: "",
    // });

    //11/09/2026 {time:  PM} 💥
    const user = await User.create({
      name: otpRecord.name || normalizedEmail.split("@")[0],

      email: normalizedEmail,

      isVerified: true,

      picture: "",
    });

    // =========================================
    // DELETE USED OTP
    // =========================================

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // =========================================
    // GENERATE JWT
    // =========================================

    const token = generateToken(user._id);

    // =========================================
    // COOKIE
    // =========================================

    res.cookie("token", token, cookieOptions);

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(201).json({
      success: true,

      message: "Account created successfully",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        picture: user.picture || "",
      },
    });
  } catch (error) {
    console.error("VERIFY REGISTER OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration verification failed",
    });
  }
};

// ==========================================
// RESEND REGISTER OTP
// ==========================================

export const resendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // CHECK USER
    // =========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    // =========================================
    // FIND PENDING REGISTRATION
    // =========================================

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "register",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    // =========================================
    // GENERATE NEW OTP
    // =========================================

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 30 * 1000);

    otpRecord.otpHash = otpHash;

    otpRecord.expiresAt = expiresAt;

    otpRecord.attempts = 0;

    await otpRecord.save();

    // =========================================
    // SEND NEW OTP
    // =========================================

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("RESEND REGISTER OTP EMAIL FAILED:", emailError);

      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      throw emailError;
    }

    return res.status(200).json({
      success: true,

      message: "New verification code sent to your email",
    });
  } catch (error) {
    console.error("RESEND REGISTER OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
    });
  }
};

// ==========================================
// LOGIN WITH EMAIL + PASSWORD
// ==========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =========================================
    // VALIDATION
    // =========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // FIND USER
    // =========================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // =========================================
    // VERIFY ACCOUNT
    // =========================================

    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // =========================================
    // GOOGLE-ONLY ACCOUNT
    // =========================================

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google Login. Please continue with Google.",
      });
    }

    // =========================================
    // PASSWORD CHECK
    // =========================================

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // =========================================
    // JWT
    // =========================================

    const token = generateToken(user._id);

    // =========================================
    // COOKIE
    // =========================================

    res.cookie("token", token, cookieOptions);

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        picture: user.picture || "",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ==========================================
// SEND LOGIN OTP
// ==========================================

export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // FIND USER
    // =========================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a verification code has been sent.",
      });
    }

    // =========================================
    // VERIFY USER
    // =========================================

    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    // =========================================
    // GENERATE OTP
    // =========================================

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 90 * 1000);

    // =========================================
    // DELETE OLD LOGIN OTP
    // =========================================

    await OTP.deleteMany({
      email: normalizedEmail,
      purpose: "login",
    });

    // =========================================
    // SAVE LOGIN OTP
    // =========================================

    await OTP.create({
      email: normalizedEmail,

      otpHash,

      expiresAt,

      attempts: 0,

      purpose: "login",
    });

    // =========================================
    // SEND EMAIL
    // =========================================

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("LOGIN OTP EMAIL FAILED:", emailError);

      await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "login",
      });

      throw emailError;
    }

    return res.status(200).json({
      success: true,

      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("SEND LOGIN OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

// ==========================================
// VERIFY LOGIN OTP
// ==========================================

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedOTP = String(otp).trim();

    // =========================================
    // FIND LOGIN OTP ONLY
    // =========================================

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "login",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired or not found",
      });
    }

    // =========================================
    // EXPIRY
    // =========================================

    if (
      !otpRecord.expiresAt ||
      Date.now() > new Date(otpRecord.expiresAt).getTime()
    ) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    // =========================================
    // ATTEMPT LIMIT
    // =========================================

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts",
      });
    }

    // =========================================
    // CHECK OTP
    // =========================================

    const isValid = await bcrypt.compare(normalizedOTP, otpRecord.otpHash);

    if (!isValid) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // =========================================
    // FIND USER
    // =========================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    // =========================================
    // VERIFY ACCOUNT
    // =========================================

    if (user.isVerified === false) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    // =========================================
    // DELETE USED OTP
    // =========================================

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // =========================================
    // JWT
    // =========================================

    const token = generateToken(user._id);

    // =========================================
    // COOKIE
    // =========================================

    res.cookie("token", token, cookieOptions);

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        picture: user.picture || "",
      },
    });
  } catch (error) {
    console.error("VERIFY LOGIN OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

// ==========================================
// GOOGLE LOGIN / REGISTER
// ==========================================

export const googleLogin = async (req, res) => {
  try {
    // =========================================
    // GET GOOGLE CREDENTIAL
    // =========================================

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // =========================================
    // VERIFY GOOGLE ID TOKEN
    // =========================================

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    // =========================================
    // GOOGLE USER DATA
    // =========================================

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase().trim();
    const name = payload.name || "Google User";
    const picture = payload.picture || "";

    // =========================================
    // EMAIL CHECK
    // =========================================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    // =========================================
    // EMAIL VERIFIED CHECK
    // =========================================

    if (payload.email_verified !== true) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // =========================================
    // FIND USER
    // =========================================

    let user = await User.findOne({
      email,
    });

    // =========================================
    // CREATE USER IF NOT EXISTS
    // =========================================

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        isVerified: true,
      });
    } else {
      // =======================================
      // UPDATE GOOGLE INFORMATION
      // =======================================

      user.googleId = googleId;
      user.picture = picture || user.picture;
      user.isVerified = true;

      // যদি পুরোনো account-এর name না থাকে
      if (!user.name) {
        user.name = name;
      }

      await user.save();
    }

    // =========================================
    // CREATE JWT
    // =========================================

    // 💥💥
    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     email: user.email,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    // 💥💥
    const token = generateToken(user._id);

    // =========================================
    // SECURE COOKIE
    // =========================================

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // =========================================
    // RESPONSE USER
    // =========================================

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error("GOOGLE BACKEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    success: true,

    message: "Logout successful",
  });
};

// ==========================================
// CURRENT USER
// ==========================================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};