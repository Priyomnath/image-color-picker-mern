import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Vibrant } from "node-vibrant/browser";
import { toast } from "react-toastify";

import ColorPalette from "./ColorPalette";
import api from "../api/api";

// RGB to HSL Convert Helper Function
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

function UploadBox() {
  // =====================================================
  // STATE
  // =====================================================
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");

  const [hoverColor, setHoverColor] = useState("");
  const [hoverRGB, setHoverRGB] = useState("");
  const [hoverHSL, setHoverHSL] = useState("");

  const [pixelPosition, setPixelPosition] = useState({ x: 0, y: 0 });
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0 });

  const [isColorLocked, setIsColorLocked] = useState(false);
  const [zoom, setZoom] = useState(1.5);

  // =====================================================
  // REFS
  // =====================================================
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const magnifierCanvasRef = useRef(null);

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setColors([]);
    setDominantColor("");
    setHoverColor("");
    setHoverRGB("");
    setHoverHSL("");

    setPixelPosition({ x: 0, y: 0 });
    setMagnifier({ visible: false, x: 0, y: 0 });
    setZoom(1.5);

    try {
      const palette = await Vibrant.from(imageUrl).getPalette();

      const extractedColors = [
        palette.Vibrant?.hex,
        palette.LightVibrant?.hex,
        palette.DarkVibrant?.hex,
        palette.Muted?.hex,
        palette.LightMuted?.hex,
        palette.DarkMuted?.hex,
      ].filter(Boolean);

      setColors(extractedColors);

      if (palette.Vibrant?.hex) {
        setDominantColor(palette.Vibrant.hex);
      } else if (extractedColors.length > 0) {
        setDominantColor(extractedColors[0]);
      }
    } catch (error) {
      console.error("Color extraction error:", error);
      toast.error("Failed to extract colors");
    }
  }, []);

  // =====================================================
  // DROPZONE
  // =====================================================
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
  });

  // =====================================================
  // IMAGE LOAD
  // =====================================================
  const handleImageLoad = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  };

  // =====================================================
  // MOUSE MOVE: REAL PIXEL COLOR DETECTION
  // =====================================================
  const handleMouseMove = (e) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const rect = img.getBoundingClientRect();

    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    if (
      displayX < 0 ||
      displayY < 0 ||
      displayX >= rect.width ||
      displayY >= rect.height
    ) {
      return;
    }

    const scaleX = img.naturalWidth / rect.width;

    const scaleY = img.naturalHeight / rect.height;

    const pixelX = Math.min(
      img.naturalWidth - 1,
      Math.max(0, Math.floor(displayX * scaleX)),
    );

    const pixelY = Math.min(
      img.naturalHeight - 1,
      Math.max(0, Math.floor(displayY * scaleY)),
    );

    // Magnifier শুধু move করবে
    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    setMagnifier({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  //31/07/2026 {time:  PM}
  const handleImageClick = (e) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const rect = img.getBoundingClientRect();

    const displayX = e.clientX - rect.left;

    const displayY = e.clientY - rect.top;

    if (
      displayX < 0 ||
      displayY < 0 ||
      displayX >= rect.width ||
      displayY >= rect.height
    ) {
      return;
    }

    const scaleX = img.naturalWidth / rect.width;

    const scaleY = img.naturalHeight / rect.height;

    const pixelX = Math.min(
      img.naturalWidth - 1,
      Math.max(0, Math.floor(displayX * scaleX)),
    );

    const pixelY = Math.min(
      img.naturalHeight - 1,
      Math.max(0, Math.floor(displayY * scaleY)),
    );

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;

    const [r, g, b] = pixel;

    const hex =
      "#" +
      [r, g, b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    // Click করলেই Color Lock/Select হবে
    setHoverColor(hex);

    setHoverRGB(`rgb(${r}, ${g}, ${b})`);

    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    toast.success(`Color Selected: ${hex}`, {
      autoClose: 800,
    });
  };

  const handleMouseLeave = () => {
    setMagnifier((prev) => ({ ...prev, visible: false }));
  };

  // 💥
  const generateColorVariations = (hex) => {
    const clean = hex.replace("#", "");

    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);

    const variations = [];

    // Light shades
    [0.15, 0.3, 0.45].forEach((amount) => {
      variations.push(
        rgbToHex(
          r + (255 - r) * amount,
          g + (255 - g) * amount,
          b + (255 - b) * amount,
        ),
      );
    });

    // Dark shades
    [0.15, 0.3, 0.45].forEach((amount) => {
      variations.push(
        rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount)),
      );
    });

    return variations;
  };

  // =====================================================
  // PROFESSIONAL PIXEL MAGNIFIER
  // =====================================================
  useEffect(() => {
    if (!magnifier.visible) return;

    const sourceCanvas = canvasRef.current;
    const magnifierCanvas = magnifierCanvasRef.current;

    if (!sourceCanvas || !magnifierCanvas) return;

    const ctx = magnifierCanvas.getContext("2d");
    if (!ctx) return;

    const size = 80;
    const sourceSize = Math.max(10, Math.floor(size / zoom));

    const sourceX = Math.max(
      0,
      Math.min(
        sourceCanvas.width - sourceSize,
        pixelPosition.x - Math.floor(sourceSize / 2),
      ),
    );
    const sourceY = Math.max(
      0,
      Math.min(
        sourceCanvas.height - sourceSize,
        pixelPosition.y - Math.floor(sourceSize / 2),
      ),
    );

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, size, size);

    // Zoomed portion draw
    ctx.drawImage(
      sourceCanvas,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size,
    );

    // Center Crosshair / Target reticle
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 7, 0, 2 * Math.PI);
    ctx.stroke();
  }, [magnifier.visible, pixelPosition.x, pixelPosition.y, zoom]);

  // =====================================================
  // SAVE PALETTE
  // =====================================================
  const savePalette = async () => {
    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

    try {
      await api.post("/colors", {
        colors,
        dominantColor,
        image,
        title: "My Color Palette",
      });

      toast.success("Palette saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save palette");
    }
  };

  // =====================================================
  // DOWNLOAD JSON
  // =====================================================
  const downloadJSON = () => {
    const data = {
      colors,
      dominantColor,
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "color-palette.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================
  const removeImage = () => {
    setImage(null);
    setColors([]);
    setDominantColor("");
    setHoverColor("");
    setHoverRGB("");
    setHoverHSL("");
    setIsColorLocked(false);
    setPixelPosition({ x: 0, y: 0 });
    setMagnifier({ visible: false, x: 0, y: 0 });
    setZoom(1.5);
  };

  // =====================================================
  // UI RENDER
  // =====================================================
  return (
    <section
      className="container-fluid py-4"
      style={{
        background: "#08090a",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Hidden Original Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* UPLOAD AREA */}
      {!image && (
        <div
          {...getRootProps()}
          className={`upload-box ${isDragActive ? "active" : ""}`}
          style={{
            maxWidth: "700px",
            margin: "60px auto",
            padding: "70px 30px",
            textAlign: "center",
            border: "2px dashed #444",
            borderRadius: "20px",
            background: "#111317",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: "50px" }}>🖼️</div>
          <h3 className="fw-bold mt-3">
            {isDragActive ? "Drop your image here" : "Upload an Image"}
          </h3>
          <p style={{ color: "#8f969f" }}>
            Drag & drop or click to select an image
          </p>
        </div>
      )}

      {/* MAIN COLOR PICKER UI */}
      {image && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "25px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
            gap: "45px",
            background: "#08090a",
          }}
        >
          {/* LEFT SIDE — IMAGE */}
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: "18px" }}>Image</h5>

            {/* Image Wrapper */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "650px",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: "14px",
                  cursor: "crosshair",
                  userSelect: "none",
                }}
              />

              {/* CIRCULAR MAGNIFIER */}
              {magnifier.visible && (
                <div
                  style={{
                    position: "fixed",

                    left: magnifier.x + 15,
                    top: magnifier.y + 15,

                    width: "80px",
                    height: "80px",

                    borderRadius: "50%",

                    overflow: "hidden",

                    background: "rgba(17, 17, 17, 0.55)",

                    border: "2px solid rgba(255,255,255,0.75)",

                    boxShadow: "0 8px 30px rgba(0,0,0,0.65)",

                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",

                    filter: "blur(0.8px)",

                    zIndex: 9999,

                    pointerEvents: "none",
                  }}
                >
                  <canvas
                    ref={magnifierCanvasRef}
                    width={80}
                    height={80}
                    style={{
                      width: "80px",
                      height: "80px",

                      display: "block",

                      imageRendering: "pixelated",

                      opacity: 0.9,
                    }}
                  />
                </div>
              )}
            </div>

            {/* SELECTED COLOR INFO */}
            {hoverColor && (
              <div
                className="mt-3"
                style={{
                  width: "100%",
                  maxWidth: "650px",
                  padding: "14px 18px",
                  background: hoverColor,
                  color: "#fff",
                  borderRadius: "12px",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  transition: "background 0.2s ease",
                }}
              >
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <div>
                    <small style={{ opacity: 0.8 }}>HEX</small>
                    <div style={{ fontWeight: 700 }}>{hoverColor}</div>
                  </div>
                  <div>
                    <small style={{ opacity: 0.8 }}>RGB</small>
                    <div style={{ fontWeight: 600 }}>{hoverRGB}</div>
                  </div>
                  <div>
                    <small style={{ opacity: 0.8 }}>Pixel</small>
                    <div style={{ fontWeight: 600 }}>
                      {pixelPosition.x}, {pixelPosition.y}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COLOR PALETTE */}
            {colors.length > 0 && (
              <div style={{ marginTop: "28px", maxWidth: "650px" }}>
                <h5 style={{ fontWeight: 700, marginBottom: "15px" }}>
                  Color Palette
                </h5>

                {/* 💥 */}
                <button
                  type="button"
                  onClick={() => {
                    setExpandedColors((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                  }}
                >
                  {expandedColors[index] ? "−" : "+"}
                </button>

                <div className="d-flex align-items-center gap-3">
                  {/* Zoom Out */}
                  {/* <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      setZoom((prev) =>
                        Math.max(1, Number((prev - 0.5).toFixed(1))),
                      );
                    }}
                  >
                    −
                  </button> */}

                  {/* Zoom In */}
                  {/* <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      setZoom((prev) =>
                        Math.min(8, Number((prev + 0.5).toFixed(1))),
                      );
                    }}
                  >
                    +
                  </button> */}

                  {/* Color Strip */}
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      height: "48px",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          backgroundColor: color,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setHoverColor(color);
                        }}
                      />
                    ))}
                  </div>

                  {/* Download */}
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                    }}
                    onClick={downloadJSON}
                  >
                    📥
                  </button>

                  {/* Save */}
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                    }}
                    onClick={savePalette}
                  >
                    💾
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — COLORS */}
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: "18px" }}>Colors</h5>

            {/* Color Preview */}
            <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
              <div
                style={{
                  flex: 1,
                  height: "100px",
                  borderRadius: "12px",
                  backgroundColor: hoverColor || "#4CAF4F",
                }}
              />

                {/* 💥 */}
                {
    expandedColors[index] && (
      <div className="mt-3">
        {generateColorVariations(color).map((variation, variationIndex) => (
          <div
            key={variationIndex}
            onClick={() => {
              setSelectedColor(variation);
              setSelectedRGB(hexToRgb(variation));
            }}
            style={{
              backgroundColor: variation,
              width: "100%",
              height: "45px",
              cursor: "pointer",
              borderRadius: "8px",
              marginBottom: "5px",
            }}
          >
            {variation}
          </div>
        ))}
      </div>
    );
  }

              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "12px",
                  backgroundColor: dominantColor || "#4CAF4F",
                }}
              />
            </div>

            {/* HEX */}
            <div
              className="color-value"
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 45px",
                alignItems: "center",
                minHeight: "55px",
                border: "1px solid #292d32",
                borderRadius: "14px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <span
                style={{ padding: "15px", color: "#9da3aa", fontWeight: 600 }}
              >
                HEX
              </span>
              <strong
                style={{ padding: "15px", borderLeft: "1px solid #292d32" }}
              >
                {hoverColor || "#4CAF4F"}
              </strong>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                }}
                onClick={() => {
                  if (hoverColor) {
                    navigator.clipboard.writeText(hoverColor);
                    toast.success("HEX Copied!");
                  }
                }}
              >
                📋
              </button>
            </div>

            {/* RGB */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 45px",
                alignItems: "center",
                minHeight: "55px",
                border: "1px solid #292d32",
                borderRadius: "14px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <span
                style={{ padding: "15px", color: "#9da3aa", fontWeight: 600 }}
              >
                RGB
              </span>
              <strong
                style={{
                  padding: "15px",
                  borderLeft: "1px solid #292d32",
                  fontSize: "14px",
                }}
              >
                {hoverRGB || "rgb(76, 175, 79)"}
              </strong>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                }}
                onClick={() => {
                  if (hoverRGB) {
                    navigator.clipboard.writeText(hoverRGB);
                    toast.success("RGB Copied!");
                  }
                }}
              >
                📋
              </button>
            </div>

            {/* HSL */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 45px",
                alignItems: "center",
                minHeight: "55px",
                border: "1px solid #292d32",
                borderRadius: "14px",
                marginBottom: "25px",
                overflow: "hidden",
              }}
            >
              <span
                style={{ padding: "15px", color: "#9da3aa", fontWeight: 600 }}
              >
                HSL
              </span>
              <strong
                style={{
                  padding: "15px",
                  borderLeft: "1px solid #292d32",
                  fontSize: "14px",
                }}
              >
                {hoverHSL || "hsl(122, 39%, 49%)"}
              </strong>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                }}
                onClick={() => {
                  if (hoverHSL) {
                    navigator.clipboard.writeText(hoverHSL);
                    toast.success("HSL Copied!");
                  }
                }}
              >
                📋
              </button>
            </div>

            {/* UPLOAD ANOTHER IMAGE / UNLOCK */}
            <div
              style={{
                marginTop: "20px",
                padding: "22px",
                borderRadius: "16px",
                background: "#171c22",
              }}
            >
              <h5 style={{ fontWeight: 700, marginBottom: "15px" }}>
                Use your own image
              </h5>

              <button
                type="button"
                className="btn btn-light w-100 mb-2"
                onClick={() => {
                  document.getElementById("another-image-input")?.click();
                }}
              >
                🖼️ Upload Another Image
              </button>

              <input
                id="another-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onDrop([file]);
                  e.target.value = "";
                }}
              />
            </div>

            {/* REMOVE IMAGE */}
            <button
              type="button"
              className="btn btn-outline-danger w-100 mt-3"
              onClick={removeImage}
            >
              🗑️ Remove Image
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default UploadBox;
