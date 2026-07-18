import Color from "../models/Color.js";

// Save Palette
export const savePalette = async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
