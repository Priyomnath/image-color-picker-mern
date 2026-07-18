import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import api from "../api/api";
import ColorPalette from "./ColorPalette";
import { Vibrant } from "node-vibrant/browser";

//13/07/2026
import { toast } from "react-toastify";

function UploadBox() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");

  // add
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  //REPLACE
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Local preview
      const preview = URL.createObjectURL(file);
      setImage(preview);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await api.post("/upload", formData);

      const cloudImage = uploadRes.data.imageUrl;

      setImageUrl(cloudImage);

      // Extract colors from Cloudinary image
      const palette = await Vibrant.from(cloudImage).getPalette();

      const extracted = Object.values(palette)
        .filter(Boolean)
        .map((item) => item.hex);

      setColors(extracted);

      if (palette.Vibrant) {
        setDominantColor(palette.Vibrant.hex);
      }
    } catch (error) {
      console.error(error);
      alert("Image Upload Failed");
    }
  }, []);

  const downloadJSON = () => {
    if (colors.length === 0) return;

    const data = JSON.stringify(colors, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "color-palette.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  //ADD
  // const savePalette = async () => {
  //   try {
  //     setLoading(true);

  //     const user = JSON.parse(localStorage.getItem("user"));

  //     if (!user) {
  //       alert("Please Login First");
  //       return;
  //     }

  //     await api.post("/colors", {
  //       title: "My Palette",
  //       dominantColor,
  //       colors,

  //       //CHANGE
  //       image: imageUrl,
  //     });

  //     //13/07/2026
  //     toast.success("Palette Saved Successfully 🎨");
  //   } catch (error) {
  //     console.log(error);

  //     //13/07/2026
  //     toast.error(error.response?.data?.message || "Save Failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //18/07/2026
  export const savePalette = async (req, res) => {
    try {
      console.log("Body:", req.body);
      console.log("User:", req.user);

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
      console.error("========== ERROR ==========");
      console.error(error);
      console.error(error.message);
      console.error(error.stack);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className="border border-primary rounded p-5 text-center"
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        <h4>Click or Drag Image Here</h4>
      </div>
      {/* Image Preview */}
      {image && (
        <img src={image} className="img-fluid rounded mt-4" alt="Uploaded" />
      )}
      {/* Dominant Color Card */}
      {dominantColor && (
        <div
          className="mt-4 p-4 rounded shadow text-center"
          style={{
            background: dominantColor,
            color: "#fff",
          }}
        >
          <h4>Dominant Color</h4>
          <h2>{dominantColor}</h2>
        </div>
      )}
      {/* Download JSON Button */}
      {colors.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-success" onClick={downloadJSON}>
            Download Palette JSON
          </button>
        </div>
      )}

      {/*Add*/}
      <div className="text-center mt-3">
        <button
          className="btn btn-primary"
          onClick={savePalette}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Palette"}
        </button>
      </div>
      {/* Color Palette List */}
      <ColorPalette colors={colors} />
    </div>
  );
}

export default UploadBox;
