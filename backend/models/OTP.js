import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    purpose: {
      type: String,
      enum: ["login", "register"],
      default: "login",
    },

    // =========================================
    // TEMPORARY REGISTRATION DATA
    // =========================================

    name: {
      type: String,
      default: null,
    },

    passwordHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "OTP",
  otpSchema,
);