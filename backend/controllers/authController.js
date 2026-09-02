import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

import crypto from "crypto";
import OTP from "../models/OTP.js";
import { sendOTPEmail } from "../utils/email.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// REGISTER - SEND OTP
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // =========================================
    // VALIDATION
    // =========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // EMAIL FORMAT VALIDATION
    // =========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // =========================================
    // PASSWORD VALIDATION
    // =========================================

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // =========================================
    // CHECK EXISTING USER
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
    // GENERATE OTP
    // =========================================

    const otp = generateOTP();

    // =========================================
    // HASH PASSWORD
    // =========================================

    const passwordHash = await bcrypt.hash(password, 10);

    // =========================================
    // HASH OTP
    // =========================================

    const otpHash = await bcrypt.hash(otp, 10);

    // =========================================
    // OTP EXPIRY
    // =========================================

    const expiresAt = new Date(Date.now() + 90 * 1000);

    // =========================================
    // REMOVE OLD REGISTER OTP
    // =========================================

    await OTP.deleteMany({
      email: normalizedEmail,
      purpose: "register",
    });

    // =========================================
    // SAVE PENDING REGISTRATION
    // =========================================

    await OTP.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      purpose: "register",
      name: normalizedName,
      passwordHash,
    });

    // =========================================
    // SEND OTP
    // =========================================

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("REGISTER OTP EMAIL FAILED:", emailError);

      await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "register",
      });

      throw emailError;
    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({
      success: true,
      requiresVerification: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start registration",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =========================================
    // VALIDATE INPUT
    // =========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // =========================================
    // FIND USER
    // =========================================

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // User doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // =========================================
    // GOOGLE-ONLY ACCOUNT CHECK
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
    // GENERATE JWT
    // =========================================

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
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,
      message: "Login Successful",
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

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// =========================================
// SEND LOGIN OTP
// =========================================

export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //this is
    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // FIND USER
    // =========================================

    // 💥
    // const user = await User.findOne({
    //   email: normalizedEmail,
    // });

    // // Don't reveal whether account exists
    // if (!user) {
    //   return res.status(200).json({
    //     success: true,
    //     message:
    //       "If an account exists with this email, a verification code has been sent.",
    //   });
    // }

    //1/09/2026 {time:  PM}
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (user.isVerified !== true) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // =========================================
    // GENERATE OTP
    // =========================================

    const otp = generateOTP();

    // =========================================
    // HASH OTP
    // =========================================

    const otpHash = await bcrypt.hash(otp, 10);

    // =========================================
    // 90 SECOND EXPIRY
    // =========================================

    const expiresAt = new Date(Date.now() + 90 * 1000);

    // =========================================
    // REMOVE OLD OTP
    // =========================================

    await OTP.deleteMany({
      email: normalizedEmail,
    });

    // =========================================
    // SAVE OTP
    // =========================================

    await OTP.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      purpose: "login",
    });

    // =========================================
    // SEND EMAIL WITH RESEND
    // =========================================

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("OTP EMAIL FAILED:", emailError);

      // Remove OTP if email was not sent
      await OTP.deleteMany({
        email: normalizedEmail,
      });

      throw emailError;
    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

//31/08/2026 {time:  PM}
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

    if (Date.now() > otpRecord.expiresAt.getTime()) {
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
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    // =========================================
    // VERIFY OTP
    // =========================================

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // =========================================
    // CHECK USER AGAIN
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
    // CREATE VERIFIED USER
    // =========================================

    const user = await User.create({
      name: otpRecord.name,
      email: normalizedEmail,
      password: otpRecord.passwordHash,
      isVerified: true,
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
    // SECURE COOKIE
    // =========================================

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(201).json({
      success: true,
      message: "Email verified and account created successfully",

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
    // FIND PENDING REGISTRATION
    // =========================================

    const pendingRegistration = await OTP.findOne({
      email: normalizedEmail,
      purpose: "register",
    });

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    // =========================================
    // CHECK USER
    // =========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "register",
      });

      return res.status(400).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    // =========================================
    // NEW OTP
    // =========================================

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 90 * 1000);

    // =========================================
    // UPDATE OTP
    // =========================================

    pendingRegistration.otpHash = otpHash;

    pendingRegistration.expiresAt = expiresAt;

    pendingRegistration.attempts = 0;

    await pendingRegistration.save();

    // =========================================
    // SEND EMAIL
    // =========================================

    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent",
    });
  } catch (error) {
    console.error("RESEND REGISTER OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
    });
  }
};

// =========================================
// VERIFY LOGIN OTP
// =========================================

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

    // =========================================
    // FIND OTP
    // =========================================

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
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

    if (Date.now() > otpRecord.expiresAt.getTime()) {
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

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

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
    // SECURE COOKIE
    // =========================================

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

// ==========================================
// GOOGLE LOGIN
// ==========================================
export const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    // =========================================
    // CHECK ACCESS TOKEN
    // =========================================

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: "Google access token is required",
      });
    }

    // =========================================
    // GET GOOGLE USER INFORMATION
    // =========================================

    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!googleResponse.ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google access token",
      });
    }

    const payload = await googleResponse.json();

    // =========================================
    // GOOGLE USER DATA
    // =========================================

    const { sub: googleId, email, name, picture, email_verified } = payload;

    // =========================================
    // CHECK EMAIL
    // =========================================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    // =========================================
    // CHECK EMAIL VERIFICATION
    // =========================================

    if (email_verified !== true) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // FIND EXISTING USER
    // =========================================

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // =========================================
    // CREATE USER
    // =========================================

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email: normalizedEmail,
        googleId,
        picture: picture || "",
      });
    } else {
      // =======================================
      // LINK GOOGLE ACCOUNT
      // =======================================

      if (!user.googleId) {
        user.googleId = googleId;
      }

      // =======================================
      // UPDATE PROFILE PICTURE
      // =======================================

      if (picture) {
        user.picture = picture;
      }

      await user.save();
    }

    // =========================================
    // GENERATE JWT
    // =========================================

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
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      message: "Google login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || "",
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
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

  res.json({
    success: true,
    message: "Logout Successful",
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

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};