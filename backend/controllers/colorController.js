import Color from "../models/Color.js";

export const savePalette = async (req, res) => {
  try {
    const { user, colors, dominantColor, title, image } = req.body;

    const palette = await Color.create({
      user,
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
      message: error.message,
    });
  }
};

export const getPalettes = async (req, res) => {
  try {
    const palettes = await Color.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      palettes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePalette = async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Palette Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};