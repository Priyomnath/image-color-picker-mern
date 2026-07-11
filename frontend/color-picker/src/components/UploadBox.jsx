import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import api from "../api/api";
import ColorPalette from "./ColorPalette";
import { Vibrant } from "node-vibrant/browser";

function UploadBox() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);

    const palette = await Vibrant.from(url).getPalette();
    const extracted = Object.values(palette)
      .filter(Boolean)
      .map((item) => item.hex);

    setColors(extracted);

    if (palette.Vibrant) {
      setDominantColor(palette.Vibrant.hex);
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
  const savePalette = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please Login First");
        return;
      }

      await api.post("/colors", {
        title: "My Palette",
        dominantColor,
        colors,
        image,
      });

      alert("Palette Saved Successfully");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Save Failed");
    } finally {
      setLoading(false);
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
