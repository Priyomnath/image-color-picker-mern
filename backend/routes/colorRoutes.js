import express from "express";
import {
  savePalette,
  getPalettes,
  deletePalette,
} from "../controllers/colorController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// সব Palette Route protected
router.post("/", auth, savePalette);
router.get("/", auth, getPalettes);
router.delete("/:id", auth, deletePalette);

export default router;