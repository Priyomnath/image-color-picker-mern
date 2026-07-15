import express from "express";
import {
  savePalette,
  getPalettes,
  deletePalette,
  updatePalette,
  toggleFavorite,
} from "../controllers/colorController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// সব Palette Route protected
router.post("/", auth, savePalette);
router.get("/", auth, getPalettes);
router.delete("/:id", auth, deletePalette);
router.put("/:id", auth, updatePalette);

// 14/07/2026
router.put("/:id/favorite", auth, toggleFavorite);

export default router;