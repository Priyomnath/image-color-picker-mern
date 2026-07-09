import express from "express";
import {
  savePalette,
  getPalettes,
  deletePalette,
} from "../controllers/colorController.js";

const router = express.Router();

router.post("/", savePalette);

router.get("/", getPalettes);

router.delete("/:id", deletePalette);

export default router;