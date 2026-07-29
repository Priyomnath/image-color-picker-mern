import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Vibrant } from "node-vibrant/browser";
import { toast } from "react-toastify";

import ColorPalette from "./ColorPalette";
import api from "../api/api";

function UploadBox() {
  // =====================================================
  // STATE
  // =====================================================

  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");

  const [hoverColor, setHoverColor] = useState("");
  const [hoverRGB, setHoverRGB] = useState("");

  const [pixelPosition, setPixelPosition] = useState({
    x: 0,
    y: 0,
  });

  const [magnifier, setMagnifier] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  //29/07/2026 {time:  PM}
  const [isColorLocked, setIsColorLocked] = useState(false);

  // Magnifier zoom
  const [zoom, setZoom] = useState(1);

  // =====================================================
  // REFS
  // =====================================================

  const imageRef = useRef(null);

  // Hidden original image canvas
  const canvasRef = useRef(null);

  // Magnifier canvas
  const magnifierCanvasRef = useRef(null);

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    // Reset previous data
    setImage(imageUrl);
    setColors([]);
    setDominantColor("");
    setHoverColor("");
    setHoverRGB("");

    setPixelPosition({
      x: 0,
      y: 0,
    });

    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });

    setZoom(1);

    try {
      // Extract colors using Vibrant
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

      // Set dominant color
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

    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },

    multiple: false,
  });

  // =====================================================
  // IMAGE LOAD
  // =====================================================

  const handleImageLoad = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    // Canvas size = Original image size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    // Draw original image into hidden canvas
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  };

  // ```jsx
// =====================================================
// MOUSE MOVE
// REAL PIXEL COLOR DETECTION
// =====================================================

//29/07/2026 {time:  PM}
const handleMouseMove = (e) => {
  const img = imageRef.current;
  const canvas = canvasRef.current;

  if (!img || !canvas) return;

  const rect = img.getBoundingClientRect();

  // Mouse position relative to displayed image
  const displayX =
    e.clientX - rect.left;

  const displayY =
    e.clientY - rect.top;

  // Ignore outside image
  if (
    displayX < 0 ||
    displayY < 0 ||
    displayX >= rect.width ||
    displayY >= rect.height
  ) {
    return;
  }

  // Display → Original image scale
  const scaleX =
    img.naturalWidth / rect.width;

  const scaleY =
    img.naturalHeight / rect.height;

  // Original image pixel coordinate
  const pixelX = Math.min(
    img.naturalWidth - 1,
    Math.max(
      0,
      Math.floor(
        displayX * scaleX
      )
    )
  );

  const pixelY = Math.min(
    img.naturalHeight - 1,
    Math.max(
      0,
      Math.floor(
        displayY * scaleY
      )
    )
  );

  // ===================================================
  // ALWAYS UPDATE MAGNIFIER POSITION
  // ===================================================

  setPixelPosition({
    x: pixelX,
    y: pixelY,
  });

  setMagnifier({
    visible: true,
    x: e.clientX,
    y: e.clientY,
  });

  // ===================================================
  // IF COLOR IS LOCKED
  // DON'T CHANGE COLOR
  // ===================================================

  if (isColorLocked) {
    return;
  }

  // ===================================================
  // READ CURRENT PIXEL COLOR
  // ===================================================

  const ctx =
    canvas.getContext(
      "2d",
      {
        willReadFrequently: true,
      }
    );

  const pixel =
    ctx.getImageData(
      pixelX,
      pixelY,
      1,
      1
    ).data;

  const [
    r,
    g,
    b,
  ] = pixel;

  // ===================================================
  // RGB → HEX
  // ===================================================

  const hex =
    "#" +
    [r, g, b]
      .map((value) =>
        value
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
      .toUpperCase();

  // Update selected color
  setHoverColor(hex);

  setHoverRGB(
    `rgb(${r}, ${g}, ${b})`
  );
};


{isColorLocked && (
  <button
    type="button"
    className="btn btn-warning mt-3"
    onClick={() => {
      setIsColorLocked(false);
    }}
  >
    🔓 Unlock Color
  </button>
)}
// ```



  

  // =====================================================
  // MOUSE LEAVE
  // =====================================================

  const handleMouseLeave = () => {
    setMagnifier((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // =====================================================
  // PROFESSIONAL PIXEL MAGNIFIER
  // =====================================================

  useEffect(() => {
    if (!magnifier.visible) return;

    const img = imageRef.current;

    const sourceCanvas = canvasRef.current;

    const magnifierCanvas = magnifierCanvasRef.current;

    if (!img || !sourceCanvas || !magnifierCanvas) {
      return;
    }

    const ctx = magnifierCanvas.getContext("2d");

    if (!ctx) return;

    // =================================================
    // SETTINGS
    // =================================================

    const lensSize = 220;

    // Always show a 9 × 9 grid
    const gridSize = 9;

    // =================================================
    // CALCULATE SOURCE PIXELS
    // =================================================

    // Higher zoom = fewer source pixels
    const pixelsPerSide = Math.max(1, Math.round(gridSize / zoom));

    // Always keep odd number
    const sourceSize =
      pixelsPerSide % 2 === 0 ? pixelsPerSide + 1 : pixelsPerSide;

    const half = Math.floor(sourceSize / 2);

    // =================================================
    // KEEP CENTER PIXEL INSIDE IMAGE
    // =================================================

    const maxSourceX = Math.max(0, img.naturalWidth - sourceSize);

    const maxSourceY = Math.max(0, img.naturalHeight - sourceSize);

    const sourceX = Math.max(0, Math.min(pixelPosition.x - half, maxSourceX));

    const sourceY = Math.max(0, Math.min(pixelPosition.y - half, maxSourceY));

    // =================================================
    // CLEAR MAGNIFIER
    // =================================================

    ctx.clearRect(0, 0, lensSize, lensSize);

    // Disable smoothing
    ctx.imageSmoothingEnabled = false;

    // =================================================
    // DRAW REAL IMAGE PIXELS
    // =================================================

    ctx.drawImage(
      sourceCanvas,

      // Source
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,

      // Destination
      0,
      0,
      lensSize,
      lensSize,
    );

    // =================================================
    // PIXEL CELL SIZE
    // =================================================

    const cellSize = lensSize / sourceSize;

    // =================================================
    // DRAW PIXEL GRID
    // =================================================

    ctx.strokeStyle = "rgba(255,255,255,0.30)";

    ctx.lineWidth = 1;

    for (let i = 0; i <= sourceSize; i++) {
      const position = i * cellSize;

      // Vertical line
      ctx.beginPath();

      ctx.moveTo(position, 0);

      ctx.lineTo(position, lensSize);

      ctx.stroke();

      // Horizontal line
      ctx.beginPath();

      ctx.moveTo(0, position);

      ctx.lineTo(lensSize, position);

      ctx.stroke();
    }

    // =================================================
    // CENTER PIXEL
    // =================================================

    const center = Math.floor(sourceSize / 2);

    const centerPosition = center * cellSize;

    // Center pixel subtle overlay
    ctx.fillStyle = "rgba(255,255,255,0.08)";

    ctx.fillRect(centerPosition, centerPosition, cellSize, cellSize);

    // =================================================
    // CENTER PIXEL BORDER
    // =================================================

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 3;

    ctx.strokeRect(
      centerPosition + 1,
      centerPosition + 1,
      cellSize - 2,
      cellSize - 2,
    );

    // =================================================
    // CENTER CROSSHAIR
    // =================================================

    ctx.strokeStyle = "rgba(255,255,255,0.85)";

    ctx.lineWidth = 1;

    // Vertical
    ctx.beginPath();

    ctx.moveTo(lensSize / 2, 0);

    ctx.lineTo(lensSize / 2, lensSize);

    ctx.stroke();

    // Horizontal
    ctx.beginPath();

    ctx.moveTo(0, lensSize / 2);

    ctx.lineTo(lensSize, lensSize / 2);

    ctx.stroke();
  }, [magnifier.visible, pixelPosition, zoom]);

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

    setPixelPosition({
      x: 0,
      y: 0,
    });

    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });

    setZoom(1);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="container py-5">
      {/* =================================================
          HIDDEN ORIGINAL IMAGE CANVAS
      ================================================= */}

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />

      {/* =================================================
          UPLOAD AREA
      ================================================= */}

      {!image && (
        <div
          {...getRootProps()}
          className={`upload-box ${isDragActive ? "active" : ""}`}
          style={{
            border: "2px dashed #aaa",

            borderRadius: "20px",

            padding: "60px 20px",

            textAlign: "center",

            cursor: "pointer",

            background: "rgba(255,255,255,0.04)",

            transition: "all 0.3s ease",
          }}
        >
          <input {...getInputProps()} />

          <div
            style={{
              fontSize: "50px",
            }}
          >
            🖼️
          </div>

          <h3 className="fw-bold mb-2 text-dark">
            {isDragActive ? "Drop your image here" : "Upload an Image"}
          </h3>

          <p className="text-muted">Drag & drop or click to select an image</p>
        </div>
      )}

      {/* =================================================
          IMAGE PREVIEW
      ================================================= */}

      {image && (
        <div className="mt-4">
          {/* IMAGE CONTAINER */}

          <div
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "100%",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setIsColorLocked(true);
            }}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Uploaded"
              onLoad={handleImageLoad}
              style={{
                maxWidth: "100%",

                maxHeight: "600px",

                display: "block",

                borderRadius: "16px",

                cursor: "crosshair",

                userSelect: "none",
              }}
            />
          </div>

          {/* =================================================
              PROFESSIONAL MAGNIFIER
          ================================================= */}

          {magnifier.visible && (
            <div
              style={{
                position: "fixed",

                left: magnifier.x + 25,

                top: magnifier.y + 25,

                width: "220px",

                height: "280px",

                borderRadius: "18px",

                overflow: "hidden",

                background: "#111",

                border: "3px solid white",

                boxShadow: "0 15px 45px rgba(0,0,0,0.5)",

                zIndex: 9999,

                pointerEvents: "none",
              }}
            >
              {/* MAGNIFIER CANVAS */}

              <canvas
                ref={magnifierCanvasRef}
                width={220}
                height={220}
                style={{
                  width: "220px",

                  height: "220px",

                  display: "block",

                  imageRendering: "pixelated",
                }}
              />

              {/* =================================================
                  PIXEL INFORMATION
              ================================================= */}

              <div
                style={{
                  padding: "8px 12px",

                  background: "#181818",

                  color: "white",

                  fontSize: "12px",
                }}
              >
                {/* COLOR + HEX */}

                <div
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "18px",

                      height: "18px",

                      borderRadius: "4px",

                      backgroundColor: hoverColor,

                      border: "1px solid white",

                      flexShrink: 0,
                    }}
                  />

                  <strong>{hoverColor}</strong>
                </div>

                {/* RGB */}

                <div
                  style={{
                    marginTop: "3px",
                  }}
                >
                  {hoverRGB}
                </div>

                {/* COORDINATES */}

                <div
                  style={{
                    marginTop: "3px",

                    opacity: 0.7,
                  }}
                >
                  X: {pixelPosition.x}
                  {" | "}
                  Y: {pixelPosition.y}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              SELECTED COLOR INFORMATION
          ================================================= */}

          {hoverColor && (
            <div className="mt-4">
              <div
                className="d-flex align-items-center gap-3 p-3 rounded-4"
                style={{
                  backgroundColor: hoverColor,

                  color: "#fff",

                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",

                  transition: "background-color 0.15s ease",
                }}
              >
                {/* HEX */}

                <div>
                  <strong>HEX</strong>

                  <div>{hoverColor}</div>
                </div>

                {/* RGB */}

                <div>
                  <strong>RGB</strong>

                  <div>{hoverRGB}</div>
                </div>

                {/* PIXEL */}

                <div>
                  <strong>Pixel</strong>

                  <div>
                    {pixelPosition.x}, {pixelPosition.y}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              MAGNIFIER ZOOM CONTROLS
          ================================================= */}

          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                setZoom((prev) =>
                  Math.max(0.5, Number((prev - 0.25).toFixed(2))),
                )
              }
            >
              −
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled
            >
              🔍 {zoom.toFixed(2)}x
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                setZoom((prev) => Math.min(8, Number((prev + 0.25).toFixed(2))))
              }
            >
              +
            </button>
          </div>

          {isColorLocked && (
            <button
              type="button"
              className="btn btn-warning mt-3"
              onClick={() => {
                setIsColorLocked(false);
              }}
            >
              🔓 Unlock Color
            </button>
          )}

          {/* =================================================
              COLOR PALETTE
          ================================================= */}

          {colors.length > 0 && (
            <div className="mt-5">
              <ColorPalette
                colors={colors}
                selectedColor={hoverColor}
                setSelectedColor={setHoverColor}
                selectedRGB={hoverRGB}
                setSelectedRGB={setHoverRGB}
              />
            </div>
          )}

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="d-flex flex-wrap gap-3 mt-4">
            {/* SAVE */}

            <button
              type="button"
              className="btn btn-primary"
              onClick={savePalette}
            >
              💾 Save Palette
            </button>

            {/* DOWNLOAD */}

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={downloadJSON}
            >
              📥 Download JSON
            </button>

            {/* REMOVE */}

            <button
              type="button"
              className="btn btn-outline-danger"
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
// ```
