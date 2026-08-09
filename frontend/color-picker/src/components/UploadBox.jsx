// ⚠️ একটি গুরুত্বপূর্ণ বিষয়: আপনার authentication system যদি token localStorage-এ অন্য কোনো key-তে রাখে, যেমন userToken, তাহলে "token"-এর জায়গায় সেই key দিতে হবে।

import { useCallback, useEffect, useRef, useState } from "react";

// 💥
import { useNavigate } from "react-router-dom";

import { useDropzone } from "react-dropzone";
import { Vibrant } from "node-vibrant/browser";
import { toast } from "react-toastify";

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

// RGB → HEX
const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.round(value).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

function UploadBox() {
  // =====================================================
  // STATE
  // =====================================================
  // 💥
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const DEFAULT_IMAGE = "/default-image.jpg";

  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");

  const [hoverColor, setHoverColor] = useState("");
  const [hoverRGB, setHoverRGB] = useState("");
  const [hoverHSL, setHoverHSL] = useState("");

  const [pixelPosition, setPixelPosition] = useState({ x: 0, y: 0 });
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0 });

  const [zoom, setZoom] = useState(1.5);
  const [expandedColors, setExpandedColors] = useState({});

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
  // 💥
  const handleImageLoad = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  };

  //08/08/2026 {time:  PM}
  // =====================================================
  // COMMON MAGNIFIER POSITION
  // Desktop + Mobile
  // =====================================================
  const updateMagnifierPosition = (clientX, clientY) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const rect = img.getBoundingClientRect();

    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;

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

    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    setMagnifier({
      visible: true,
      x: clientX,
      y: clientY,
    });
  };

  //08/08/2026 {time:  PM}
  // =====================================================
  // COMMON POINTER POSITION
  // Desktop Mouse + Mobile Finger
  // =====================================================
  const updateMagnifier = (clientX, clientY) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const rect = img.getBoundingClientRect();

    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;

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

    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    setMagnifier({
      visible: true,
      x: clientX,
      y: clientY,
    });
  };

  // =====================================================
  // MOUSE MOVE
  // =====================================================
  // const handleMouseMove = (e) => {
  //   const img = imageRef.current;
  //   const canvas = canvasRef.current;

  //   if (!img || !canvas) return;

  //   const rect = img.getBoundingClientRect();
  //   const displayX = e.clientX - rect.left;
  //   const displayY = e.clientY - rect.top;

  //   if (
  //     displayX < 0 ||
  //     displayY < 0 ||
  //     displayX >= rect.width ||
  //     displayY >= rect.height
  //   ) {
  //     return;
  //   }

  //   const scaleX = img.naturalWidth / rect.width;
  //   const scaleY = img.naturalHeight / rect.height;

  //   const pixelX = Math.min(
  //     img.naturalWidth - 1,
  //     Math.max(0, Math.floor(displayX * scaleX)),
  //   );

  //   const pixelY = Math.min(
  //     img.naturalHeight - 1,
  //     Math.max(0, Math.floor(displayY * scaleY)),
  //   );

  //   setPixelPosition({
  //     x: pixelX,
  //     y: pixelY,
  //   });

  //   setMagnifier({
  //     visible: true,
  //     x: e.clientX,
  //     y: e.clientY,
  //   });
  // };

  // // =====================
  // //MOUSE MOVE 2
  // // =====================
  const handleMouseMove = (e) => {
    updateMagnifier(e.clientX, e.clientY);
  };

  // =====================================================
  // IMAGE CLICK
  // =====================================================
  const handleImageClick = (e) => {
    //10/08/2026 {time:  PM}
    if (e.pointerType === "touch") return;

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

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
    const [r, g, b] = pixel;

    const hex =
      "#" +
      [r, g, b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    setHoverColor(hex);
    setHoverRGB(`rgb(${r}, ${g}, ${b})`);
    setHoverHSL(rgbToHsl(r, g, b));

    setPixelPosition({ x: pixelX, y: pixelY });

    toast.success(`Color Selected: ${hex}`, { autoClose: 800 });

    // 🔥 IMPORTANT
    //10/08/2026 {time:  PM}
    // Color select হওয়ার সাথে সাথে magnifier hide
    setMagnifier((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const handleMouseLeave = () => {
    setMagnifier((prev) => ({ ...prev, visible: false }));
  };

  //10/08/2026 {time:  PM}
  // =====================================================
  // MOBILE TOUCH MAGNIFIER
  // Desktop Mouse-এর মতো continuous tracking
  // =====================================================

  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    if (!touch) return;

    updateMagnifier(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];

    if (!touch) return;

    updateMagnifier(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) {
      setMagnifier((prev) => ({
        ...prev,
        visible: false,
      }));
      return;
    }

    // সর্বশেষ magnifier position
    const { x, y } = magnifier;

    const rect = img.getBoundingClientRect();

    const displayX = x - rect.left;
    const displayY = y - rect.top;

    if (
      displayX < 0 ||
      displayY < 0 ||
      displayX >= rect.width ||
      displayY >= rect.height
    ) {
      setMagnifier((prev) => ({
        ...prev,
        visible: false,
      }));
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

    const hex = rgbToHex(r, g, b);

    // 🎨 Color select
    setHoverColor(hex);
    setHoverRGB(`rgb(${r}, ${g}, ${b})`);
    setHoverHSL(rgbToHsl(r, g, b));

    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    // 🔍 Finger release → lens hide
    setMagnifier((prev) => ({
      ...prev,
      visible: false,
    }));

    toast.success(`Color Selected: ${hex}`, {
      autoClose: 800,
    });
  };

  // =====================================================
  // COLOR VARIATIONS GENERATOR
  // =====================================================
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const magnifierCanvas = magnifierCanvasRef.current;

    if (!canvas || !magnifierCanvas || !magnifier.visible) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    const magnifierCtx = magnifierCanvas.getContext("2d");

    if (!magnifierCtx) return;

    const lensSize = 120;

    // Number of pixels visible inside the lens
    // Lower value = more zoom
    const pixelsPerSide = Math.max(3, Math.round(12 / zoom));

    // Keep pixel grid centered
    const sourceSize = Math.min(canvas.width, canvas.height, pixelsPerSide);

    const half = Math.floor(sourceSize / 2);

    let sx = pixelPosition.x - half;
    let sy = pixelPosition.y - half;

    // Prevent source area from going outside image
    sx = Math.max(0, Math.min(canvas.width - sourceSize, sx));

    sy = Math.max(0, Math.min(canvas.height - sourceSize, sy));

    // Clear previous lens
    magnifierCtx.clearRect(0, 0, lensSize, lensSize);

    // Dark background
    magnifierCtx.fillStyle = "#111";
    magnifierCtx.fillRect(0, 0, lensSize, lensSize);

    // Draw zoomed pixels
    magnifierCtx.imageSmoothingEnabled = false;

    magnifierCtx.drawImage(
      canvas,
      sx,
      sy,
      sourceSize,
      sourceSize,
      0,
      0,
      lensSize,
      lensSize,
    );

    // ==========================================
    // PIXEL GRID
    // ==========================================
    const cellSize = lensSize / sourceSize;

    magnifierCtx.strokeStyle = "rgba(255, 255, 255, 0.22)";

    magnifierCtx.lineWidth = 1;

    for (let i = 1; i < sourceSize; i++) {
      const position = i * cellSize;

      // Vertical grid
      magnifierCtx.beginPath();
      magnifierCtx.moveTo(position, 0);
      magnifierCtx.lineTo(position, lensSize);
      magnifierCtx.stroke();

      // Horizontal grid
      magnifierCtx.beginPath();
      magnifierCtx.moveTo(0, position);
      magnifierCtx.lineTo(lensSize, position);
      magnifierCtx.stroke();
    }

    // ==========================================
    // CENTER PIXEL
    // ==========================================
    const centerIndex = Math.floor(sourceSize / 2);

    const centerX = centerIndex * cellSize;

    const centerY = centerIndex * cellSize;

    // Center pixel border
    magnifierCtx.strokeStyle = "rgba(255, 255, 255, 0.95)";

    magnifierCtx.lineWidth = 2;

    magnifierCtx.strokeRect(
      centerX + 1,
      centerY + 1,
      cellSize - 2,
      cellSize - 2,
    );

    // Center pixel glow
    magnifierCtx.shadowColor = "rgba(255, 255, 255, 0.8)";

    magnifierCtx.shadowBlur = 8;

    magnifierCtx.strokeRect(
      centerX + 2,
      centerY + 2,
      cellSize - 4,
      cellSize - 4,
    );

    magnifierCtx.shadowBlur = 0;
  }, [magnifier.visible, pixelPosition.x, pixelPosition.y, zoom]);

  // =====================================================
  // DEFAULT IMAGE COLOR PALETTE
  // =====================================================
  useEffect(() => {
    if (image !== DEFAULT_IMAGE) return;

    const extractDefaultColors = async () => {
      try {
        const palette = await Vibrant.from(DEFAULT_IMAGE).getPalette();

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
        }
      } catch (error) {
        console.error("Default palette extraction failed:", error);
      }
    };

    extractDefaultColors();
  }, [image]);

  // =====================================================
  // SAVE / DOWNLOAD / REMOVE ACTIONS
  // =====================================================

  const savePalette = async () => {
    console.log("Image:", image);
    console.log("Colors:", colors);
    console.log("Dominant:", dominantColor);
    console.log("Token:", localStorage.getItem("token"));
    console.log("User:", localStorage.getItem("user"));

    // Login check
    if (!isLoggedIn) {
      toast.warning("Please login to save your palette");
      navigate("/login");
      return;
    }

    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

    // try {
    //   await api.post("/colors", {
    //     colors,
    //     dominantColor,
    //     image,
    //     title: "My Color Palette",
    //   });

    //   toast.success("Palette saved successfully!");
    // } catch (error) {
    //   console.error(error);
    //   toast.error("Failed to save palette");
    // }

    //07/08/2026 {time:  PM}
    try {
      const res = await api.post("/colors", {
        title: "My Color Palette",
        colors,
        dominantColor,
        image,
      });

      console.log("SAVE RESPONSE:", res.data);
      toast.success("Palette saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);

      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to save palette");
    }
  };

  const downloadJSON = () => {
    // Login check
    if (!isLoggedIn) {
      toast.warning("Please login to download your color palette");
      navigate("/login");
      return;
    }

    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

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

    toast.success("Palette downloaded successfully!");
  };

  const removeImage = () => {
    setImage(DEFAULT_IMAGE);

    setHoverColor("");
    setHoverRGB("");
    setHoverHSL("");

    setPixelPosition({
      x: 0,
      y: 0,
    });

    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });

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
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {image && (
        // <div
        //   style={{
        //     maxWidth: "1100px",
        //     margin: "0 auto",
        //     padding: "25px",
        //     display: "grid",
        //     gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
        //     gap: "45px",
        //     background: "#08090a",
        //   }}
        // >

        //04/08/2026 {time:  PM}
        <div
          className="picker-main-layout"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(35px,1fr))",
            gap: "45px",
            background: "#08090a",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT SIDE — IMAGE & PALETTE */}
          <div className="picker-left-section">
            <h5 style={{ fontWeight: 700, marginBottom: "18px" }}>Image</h5>

            {/* <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "650px",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            > */}

            {/* //04/08/2026 {time:  PM} */}
            <div
              className="image-magnifier-container"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "650px",
              }}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                //04/08/2026 {time:  PM}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: "14px",
                  cursor: "crosshair",
                  userSelect: "none",

                  //10/08/2026 {time:  PM}
                  // Mobile touch
                  // vertical page scrolling allow করবে
                  touchAction: "pan-y",

                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                }}
                //08/08/2026 {time:  PM}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              />

              {magnifier.visible && (
                <div
                  style={{
                    position: "fixed",
                    left: magnifier.x + 20,
                    top: magnifier.y + 20,

                    width: "120px",
                    height: "120px",

                    borderRadius: "50%",
                    overflow: "hidden",

                    background: "rgba(10, 12, 15, 0.9)",

                    border: "3px solid rgba(255, 255, 255, 0.95)",

                    boxShadow: `
        0 0 0 2px rgba(0, 0, 0, 0.75),
        0 10px 35px rgba(0, 0, 0, 0.7),
        0 0 25px rgba(255, 255, 255, 0.15)
      `,

                    zIndex: 9999,
                    pointerEvents: "none",

                    transition: "left 0.05s ease-out, top 0.05s ease-out",
                  }}
                >
                  {/* ZOOMED PIXEL CANVAS */}
                  <canvas
                    ref={magnifierCanvasRef}
                    width={120}
                    height={120}
                    style={{
                      width: "120px",
                      height: "120px",

                      display: "block",

                      imageRendering: "pixelated",

                      userSelect: "none",
                    }}
                  />

                  {/* CENTER PIXEL FOCUS */}
                  <div
                    style={{
                      position: "absolute",

                      top: "50%",
                      left: "50%",

                      width: "28px",
                      height: "28px",

                      transform: "translate(-50%, -50%)",

                      border: "2px solid rgba(255,255,255,0.95)",

                      borderRadius: "4px",

                      boxShadow: `
          0 0 0 1px rgba(0,0,0,0.8),
          0 0 10px rgba(255,255,255,0.7)
        `,

                      pointerEvents: "none",
                    }}
                  />

                  {/* CENTER CROSSHAIR - VERTICAL */}
                  <div
                    style={{
                      position: "absolute",

                      top: "50%",
                      left: "50%",

                      width: "2px",
                      height: "34px",

                      transform: "translate(-50%, -50%)",

                      background: "rgba(255,255,255,0.95)",

                      boxShadow: "0 0 5px rgba(0,0,0,0.9)",

                      pointerEvents: "none",
                    }}
                  />

                  {/* CENTER CROSSHAIR - HORIZONTAL */}
                  <div
                    style={{
                      position: "absolute",

                      top: "50%",
                      left: "50%",

                      width: "34px",
                      height: "2px",

                      transform: "translate(-50%, -50%)",

                      background: "rgba(255,255,255,0.95)",

                      boxShadow: "0 0 5px rgba(0,0,0,0.9)",

                      pointerEvents: "none",
                    }}
                  />
                </div>
              )}
            </div>

            {/* UPLOAD BUTTON UNDER IMAGE */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "18px",
              }}
            >
              <input
                id="main-image-input"
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

            {/* HOVER / SELECTED COLOR INFO */}
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
              <div
                className="color-palette-section"
                style={{
                  marginTop: "28px",
                  maxWidth: "650px",
                  width: "100%",
                }}
              >
                <h5 style={{ fontWeight: 700, marginBottom: "15px" }}>
                  Color Palette
                </h5>

                <div
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   gap: "10px",
                  // }}

                  //04/08/2026 {time:  PM}
                  // style={{
                  //   display: "flex",
                  //   alignItems: "center",
                  //   gap: "10px",
                  //   width: "100%",
                  //   minWidth: 0,
                  // }}

                  //06/08/2026 {time:  PM}
                  className="color-palette-section"
                  style={{
                    marginTop: "28px",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <div className="palette-list">
                    {colors.map((color, index) => (
                      <div key={index}>
                        {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      > */}

                        {/* //06/08/2026 {time:  PM} */}
                        <div
                          className="palette-row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            minWidth: 0,
                            flexWrap: "nowrap",
                          }}
                        >
                          <div
                            onClick={() => {
                              const clean = color.replace("#", "");
                              const r = parseInt(clean.slice(0, 2), 16);
                              const g = parseInt(clean.slice(2, 4), 16);
                              const b = parseInt(clean.slice(4, 6), 16);

                              setHoverColor(color);
                              setHoverRGB(`rgb(${r}, ${g}, ${b})`);
                              setHoverHSL(rgbToHsl(r, g, b));
                            }}
                            // style={{
                            //   flex: 1,
                            //   height: "48px",
                            //   backgroundColor: color,
                            //   borderRadius: "10px",
                            //   cursor: "pointer",
                            //   border:
                            //     hoverColor === color
                            //       ? "3px solid white"
                            //       : "1px solid rgba(255,255,255,0.15)",
                            //   transition: "0.2s ease",
                            // }}

                            //04/08/2026 {time:  PM}
                            // style={{
                            //   flex: 1,
                            //   minWidth: 0,
                            //   height: "48px",
                            //   backgroundColor: color,
                            //   borderRadius: "10px",
                            //   cursor: "pointer",
                            //   border:
                            //     hoverColor === color
                            //       ? "3px solid white"
                            //       : "1px solid rgba(255,255,255,0.15)",
                            //   transition: "0.2s ease",
                            // }}

                            //06/08/2026 {time:  PM}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              height: "48px",
                              background: color,
                              borderRadius: "10px",
                            }}
                          />

                          <span
                            // style={{
                            //   width: "90px",
                            //   //04/08/2026 {time:  PM}
                            //   minWidth: "70px",
                            //   fontSize: "13px",
                            //   fontWeight: 600,
                            //   color: "#ddd",
                            //   overflow: "hidden",
                            //   textOverflow: "ellipsis",
                            //   whiteSpace: "nowrap",
                            //   fontSize: "13px",
                            //   fontWeight: 600,
                            //   color: "#ddd",
                            // }}

                            //06/08/2026 {time:  PM}
                            style={{
                              width: "80px",
                              minWidth: "60px",
                              fontSize: "13px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {color}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-light"
                            // style={{
                            //   width: "42px",
                            //   height: "42px",
                            //   borderRadius: "50%",
                            //   fontSize: "20px",
                            //   fontWeight: "bold",
                            //   padding: 0,
                            // }}

                            //06/08/2026 {time:  PM}
                            style={{
                              width: "36px",
                              height: "36px",
                              flexShrink: 0,
                            }}
                            onClick={() => {
                              setExpandedColors((prev) => ({
                                ...prev,
                                [index]: !prev[index],
                              }));
                            }}
                          >
                            {expandedColors[index] ? "−" : "+"}
                          </button>
                        </div>

                        {expandedColors[index] && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(6, 1fr)",
                              gap: "8px",
                              marginTop: "10px",
                              paddingLeft: "10px",
                            }}
                          >
                            {generateColorVariations(color).map(
                              (variation, variationIndex) => (
                                <div
                                  key={variationIndex}
                                  onClick={() => {
                                    const clean = variation.replace("#", "");
                                    const r = parseInt(clean.slice(0, 2), 16);
                                    const g = parseInt(clean.slice(2, 4), 16);
                                    const b = parseInt(clean.slice(4, 6), 16);

                                    setHoverColor(variation);
                                    setHoverRGB(`rgb(${r}, ${g}, ${b})`);
                                    setHoverHSL(rgbToHsl(r, g, b));

                                    toast.success(
                                      `Color Selected: ${variation}`,
                                      { autoClose: 800 },
                                    );
                                  }}
                                  style={{
                                    height: "42px",
                                    backgroundColor: variation,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    transition: "transform 0.2s ease",
                                  }}
                                  title={variation}
                                />
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — COLORS */}
          {/* //04/08/2026 {time:  PM} */}
          <div className="picker-right-section">
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

            {/* UPLOAD ANOTHER IMAGE / SIDEBAR */}
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
                  document.getElementById("side-image-input")?.click();
                }}
              >
                🖼️ Upload Another Image
              </button>

              <input
                id="side-image-input"
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

            {/* ACTION BUTTONS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {/* DOWNLOAD BUTTON */}
              <button
                type="button"
                onClick={downloadJSON}
                className="action-btn download-btn"
                style={{
                  minHeight: "52px",
                  borderRadius: "14px",
                  border: "1px solid #343a40",
                  background: "linear-gradient(135deg, #171c22, #111317)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#6c757d";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.25)";
                }}
              >
                <span style={{ fontSize: "20px" }}>📥</span>
                <span>Download JSON</span>
              </button>

              {/* SAVE BUTTON */}
              <button
                type="button"
                onClick={savePalette}
                className="action-btn save-btn"
                style={{
                  minHeight: "52px",
                  borderRadius: "14px",
                  border: "1px solid #ffffff",
                  background: "#ffffff",
                  color: "#08090a",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 6px 18px rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "#e9ecef";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(255,255,255,0.08)";
                }}
              >
                <span style={{ fontSize: "20px" }}>💾</span>
                <span>Save Palette</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UploadBox;
