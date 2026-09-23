import Color from "../models/Color.js";

//22/09/2026 {time:  PM}💥
import axios from "axios";

export const downloadColorImage = async (req, res) => {
  try {
    const { id } = req.params;

    const palette = await Color.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!palette) {
      return res.status(404).json({
        success: false,
        message: "Palette not found",
      });
    }

    if (!palette.image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const response = await axios.get(palette.image, {
      responseType: "arraybuffer",
    });

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="color-palette-${palette._id}.jpg"`
    );

    return res.send(response.data);
  } catch (error) {
    console.error("DOWNLOAD IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download image",
    });
  }
};

// Save Palette

//07/08/2026 {time:  PM}
export const savePalette = async (req, res) => {
  try {
    console.log("========== SAVE PALETTE ==========");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const { colors, dominantColor, title, image } = req.body;

    const palette = await Color.create({
      user: req.user.id,
      colors,
      dominantColor,
      title,
      image,
    });

    res.status(201).json({
      success: true,
      palette,
    });
  } catch (error) {
    console.error("SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const savePalette = async (req, res) => {
//   try {
//     const { colors, dominantColor, title, image } = req.body;

//     const palette = await Color.create({
//       user: req.user.id,
//       colors,
//       dominantColor,
//       title,
//       image,
//     });

//     res.status(201).json({
//       success: true,
//       palette,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// 14/07/2026
export const toggleFavorite = async (req, res) => {
  try {
    const palette = await Color.findById(req.params.id);

    if (!palette) {
      return res.status(404).json({
        success: false,
        message: "Palette not found",
      });
    }

    palette.favorite = !palette.favorite;
    await palette.save();

    res.json({
      success: true,
      favorite: palette.favorite,
    });
  } catch (error) {
    console.error("Save Palette Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//12/07/2026
export const updatePalette = async (req, res) => {
  try {
    const { title } = req.body;

    const palette = await Color.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true },
    );

    res.json({
      success: true,
      palette,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Palettes
export const getPalettes = async (req, res) => {
  try {
    const palettes = await Color.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      palettes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete My Palette
export const deletePalette = async (req, res) => {
  try {
    const palette = await Color.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!palette) {
      return res.status(404).json({
        success: false,
        message: "Palette Not Found",
      });
    }

    res.json({
      success: true,
      message: "Palette Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
