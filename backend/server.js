import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS

//18/07/2026
const allowedOrigins = [
  "http://localhost:5173",
  "https://image-color-picker-mern-z72c-lilac.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Routes
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Image Color Picker Pro API Running 🚀",
//   });
// });

// টেস্ট করার জন্য সাময়িক HTML Form (ছবি আপলোডের জন্য)
app.get("/", (req, res) => {
  res.send(`
    <h2>Cloudinary Upload Test</h2>
    <form action="/api/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" required />
      <button type="submit">Upload Image</button>
    </form>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/upload", uploadRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
