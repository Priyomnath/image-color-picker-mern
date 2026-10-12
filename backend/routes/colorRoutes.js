// import express from "express";
// import {
//   savePalette,
//   getPalettes,
//   deletePalette,
//   updatePalette,
//   toggleFavorite,
//   getColors,
//   downloadColorImage,
// } from "../controllers/colorController.js"; 

// import auth from "../middleware/auth.js";

// const router = express.Router();

// // সব Palette Route protected
// router.post("/", auth, savePalette);
// router.get("/", auth, getPalettes);
// //22/09/2026 {time:  PM}💥
// router.get("/:id/download", auth, downloadColorImage);
// router.delete("/:id", auth, deletePalette);
// router.put("/:id", auth, updatePalette);

// // 14/07/2026
// router.put("/:id/favorite", auth, toggleFavorite);

// export default router;










import express from "express";

import {
  savePalette,
  getPalettes,
  deletePalette,
  updatePalette,
  toggleFavorite,
  downloadColorImage,
} from "../controllers/colorController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Save Palette
router.post("/", auth, savePalette);

// Get My Palettes
router.get("/", auth, getPalettes);

// Download Palette Image
router.get("/:id/download", auth, downloadColorImage);

// Delete Palette
router.delete("/:id", auth, deletePalette);

// Update Palette
router.put("/:id", auth, updatePalette);

// Toggle Favorite
router.put("/:id/favorite", auth, toggleFavorite);

export default router;
