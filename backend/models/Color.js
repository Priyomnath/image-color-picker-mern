import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    colors: {
      type: [String],
      required: true,
    },

    dominantColor: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Palette",
    },

    // 14/07/2026
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Color", colorSchema);
