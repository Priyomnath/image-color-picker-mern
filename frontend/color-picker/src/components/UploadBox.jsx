import { useCallback, useEffect, useRef, useState } from "react";
import "../pages/UploadBox.css";

import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Vibrant } from "node-vibrant/browser";
import { toast } from "react-toastify";

import api from "../api/api";
import { useTheme } from "../context/ThemeContext";

// =====================================================
// RGB → HSL
// =====================================================

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  let s;

  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;

    s =
      l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

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
        h = 0;
    }

    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(
    s * 100,
  )}%, ${Math.round(l * 100)}%)`;
};

// =====================================================
// RGB → HEX
// =====================================================

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.round(value)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
};

// =====================================================
// COMPONENT
// =====================================================

function UploadBox() {
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  // =====================================================
  // THEME
  // =====================================================

  const theme = {
    background: darkMode ? "#08090a" : "#f6f8fb",
    card: darkMode ? "#171c22" : "#ffffff",
    text: darkMode ? "#ffffff" : "#1f2937",
    muted: darkMode ? "#9da3aa" : "#6b7280",
    border: darkMode ? "#292d32" : "#dfe3e8",
    input: darkMode ? "#111317" : "#ffffff",
  };

  // =====================================================
  // DEFAULT IMAGE
  // =====================================================

  const DEFAULT_IMAGE = "/default-image.jpg";

  // =====================================================
  // AUTH
  // =====================================================

  const isLoggedIn = !!localStorage.getItem("token");

  // =====================================================
  // STATES
  // =====================================================

  const [image, setImage] = useState(DEFAULT_IMAGE);

  const [colors, setColors] = useState([]);

  const [dominantColor, setDominantColor] = useState("");

  const [hoverColor, setHoverColor] = useState("");

  const [hoverRGB, setHoverRGB] = useState("");

  const [hoverHSL, setHoverHSL] = useState("");

  const [pixelPosition, setPixelPosition] = useState({
    x: 0,
    y: 0,
  });

  const [magnifier, setMagnifier] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1.5);

  // =====================================================
  // MAGNIFIER DISABLED AFTER CLICK
  // =====================================================

  const [magnifierDisabled, setMagnifierDisabled] =
    useState(false);

  // =====================================================
  // PALETTE EXPANSION
  // =====================================================

  const [expandedColors, setExpandedColors] = useState({});

  // =====================================================
  // REFS
  // =====================================================

  const imageRef = useRef(null);

  const canvasRef = useRef(null);

  const magnifierCanvasRef = useRef(null);

  const magnifierContainerRef = useRef(null);

  const lastTouchPositionRef = useRef({
    x: 0,
    y: 0,
  });

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

    // =================================================
    // RESET OLD IMAGE DATA
    // =================================================

    setImage(imageUrl);

    setColors([]);

    setDominantColor("");

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

    setMagnifierDisabled(false);

    setZoom(1.5);

    setExpandedColors({});

    try {
      // =================================================
      // EXTRACT COLORS
      // =================================================

      const palette =
        await Vibrant.from(imageUrl).getPalette();

      const extractedColors = [
        palette.Vibrant?.hex,
        palette.LightVibrant?.hex,
        palette.DarkVibrant?.hex,
        palette.Muted?.hex,
        palette.LightMuted?.hex,
        palette.DarkMuted?.hex,
      ]
        .filter(Boolean)
        .map((color) => color.toUpperCase());

      console.log(
        "Extracted Palette:",
        extractedColors,
      );

      // =================================================
      // SET 6 COLORS
      // =================================================

      setColors(extractedColors);

      // =================================================
      // DOMINANT COLOR
      // =================================================

      if (palette.Vibrant?.hex) {
        setDominantColor(
          palette.Vibrant.hex.toUpperCase(),
        );
      } else if (extractedColors.length > 0) {
        setDominantColor(extractedColors[0]);
      }
    } catch (error) {
      console.error(
        "Color extraction error:",
        error,
      );

      toast.error("Failed to extract colors");
    }
  }, []);

  // =====================================================
  // DROPZONE
  // =====================================================

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
      ],
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

    canvas.width = img.naturalWidth;

    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
    );
  };

  // =====================================================
  // GET PIXEL FROM CLIENT POSITION
  // =====================================================

  const getPixelFromClientPosition = (
    clientX,
    clientY,
  ) => {
    const img = imageRef.current;

    if (!img) return null;

    const rect = img.getBoundingClientRect();

    const displayX = clientX - rect.left;

    const displayY = clientY - rect.top;

    if (
      displayX < 0 ||
      displayY < 0 ||
      displayX >= rect.width ||
      displayY >= rect.height
    ) {
      return null;
    }

    const scaleX =
      img.naturalWidth / rect.width;

    const scaleY =
      img.naturalHeight / rect.height;

    const pixelX = Math.min(
      img.naturalWidth - 1,
      Math.max(
        0,
        Math.floor(displayX * scaleX),
      ),
    );

    const pixelY = Math.min(
      img.naturalHeight - 1,
      Math.max(
        0,
        Math.floor(displayY * scaleY),
      ),
    );

    return {
      pixelX,
      pixelY,
      clientX,
      clientY,
    };
  };

  // =====================================================
  // UPDATE MAGNIFIER
  // =====================================================

  const updateMagnifier = (
    clientX,
    clientY,
  ) => {
    // Lens disabled হলে hide
    if (magnifierDisabled) {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });

      return;
    }

    const position =
      getPixelFromClientPosition(
        clientX,
        clientY,
      );

    // Image-এর বাইরে গেলে hide
    if (!position) {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });

      return;
    }

    setPixelPosition({
      x: position.pixelX,
      y: position.pixelY,
    });

    setMagnifier({
      visible: true,
      x: clientX,
      y: clientY,
    });

    lastTouchPositionRef.current = {
      x: clientX,
      y: clientY,
    };
  };

  // =====================================================
  // READ COLOR FROM PIXEL
  // =====================================================

  const selectPixelColor = (
    clientX,
    clientY,
    showToast = true,
  ) => {
    const position =
      getPixelFromClientPosition(
        clientX,
        clientY,
      );

    if (!position) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    const pixel = ctx.getImageData(
      position.pixelX,
      position.pixelY,
      1,
      1,
    ).data;

    const [r, g, b] = pixel;

    const hex = rgbToHex(r, g, b);

    setHoverColor(hex);

    setHoverRGB(
      `rgb(${r}, ${g}, ${b})`,
    );

    setHoverHSL(
      rgbToHsl(r, g, b),
    );

    setPixelPosition({
      x: position.pixelX,
      y: position.pixelY,
    });

    if (showToast) {
      toast.success(
        `Color Selected: ${hex}`,
        {
          autoClose: 800,
        },
      );
    }
  };

  // =====================================================
  // DESKTOP MOUSE MOVE
  // =====================================================

  const handleMouseMove = (e) => {
    if (magnifierDisabled) {
      return;
    }

    updateMagnifier(
      e.clientX,
      e.clientY,
    );
  };

  // =====================================================
  // DESKTOP IMAGE CLICK
  // =====================================================

  const handleImageClick = (e) => {
    e.preventDefault();

    e.stopPropagation();

    const img = imageRef.current;

    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const rect =
      img.getBoundingClientRect();

    const displayX =
      e.clientX - rect.left;

    const displayY =
      e.clientY - rect.top;

    if (
      displayX < 0 ||
      displayY < 0 ||
      displayX >= rect.width ||
      displayY >= rect.height
    ) {
      return;
    }

    const scaleX =
      img.naturalWidth / rect.width;

    const scaleY =
      img.naturalHeight / rect.height;

    const pixelX = Math.min(
      img.naturalWidth - 1,
      Math.max(
        0,
        Math.floor(
          displayX * scaleX,
        ),
      ),
    );

    const pixelY = Math.min(
      img.naturalHeight - 1,
      Math.max(
        0,
        Math.floor(
          displayY * scaleY,
        ),
      ),
    );

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    const pixel = ctx.getImageData(
      pixelX,
      pixelY,
      1,
      1,
    ).data;

    const [r, g, b] = pixel;

    const hex = rgbToHex(r, g, b);

    setHoverColor(hex);

    setHoverRGB(
      `rgb(${r}, ${g}, ${b})`,
    );

    setHoverHSL(
      rgbToHsl(r, g, b),
    );

    setPixelPosition({
      x: pixelX,
      y: pixelY,
    });

    // =================================================
    // IMPORTANT
    // Click করার সাথে সাথে lens permanently hide
    // যতক্ষণ না image থেকে বের হয়ে আবার ঢোকে
    // =================================================

    setMagnifierDisabled(true);

    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });

    toast.success(
      `Color Selected: ${hex}`,
      {
        autoClose: 800,
      },
    );
  };

  // =====================================================
  // MOUSE LEAVE
  // =====================================================

  const handleMouseLeave = () => {
    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });

    // Image থেকে বের হলে আবার enable
    setMagnifierDisabled(false);
  };

  // =====================================================
  // MOBILE TOUCH START
  // =====================================================

  const handleTouchStart = (e) => {
    if (magnifierDisabled) {
      return;
    }

    const touch = e.touches[0];

    if (
      !touch ||
      !imageRef.current
    ) {
      return;
    }

    const position =
      getPixelFromClientPosition(
        touch.clientX,
        touch.clientY,
      );

    if (!position) {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });

      return;
    }

    setPixelPosition({
      x: position.pixelX,
      y: position.pixelY,
    });

    setMagnifier({
      visible: true,
      x: touch.clientX,
      y: touch.clientY,
    });

    lastTouchPositionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  // =====================================================
  // MOBILE TOUCH MOVE
  // =====================================================

  const handleTouchMove = (e) => {
    if (magnifierDisabled) {
      return;
    }

    const touch = e.touches[0];

    if (
      !touch ||
      !imageRef.current
    ) {
      return;
    }

    const position =
      getPixelFromClientPosition(
        touch.clientX,
        touch.clientY,
      );

    if (!position) {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });

      return;
    }

    setPixelPosition({
      x: position.pixelX,
      y: position.pixelY,
    });

    setMagnifier({
      visible: true,
      x: touch.clientX,
      y: touch.clientY,
    });

    lastTouchPositionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  // =====================================================
  // MOBILE TOUCH END
  // =====================================================

  const handleTouchEnd = () => {
    const { x, y } =
      lastTouchPositionRef.current;

    if (!x && !y) {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });

      return;
    }

    selectPixelColor(
      x,
      y,
      true,
    );

    // Touch শেষ হলে lens hide
    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  // =====================================================
  // MAGNIFIER CLICK / POINTER DOWN
  // =====================================================

  const handleMagnifierPointerDown = (
    e,
  ) => {
    e.preventDefault();

    e.stopPropagation();

    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  // =====================================================
  // TOUCH CANCEL
  // =====================================================

  const handleTouchCancel = () => {
    setMagnifier({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  // =====================================================
  // HIDE LENS ON PAGE SCROLL
  // =====================================================

  useEffect(() => {
    const handlePageScroll = () => {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });
    };

    window.addEventListener(
      "scroll",
      handlePageScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handlePageScroll,
      );
    };
  }, []);

  // =====================================================
  // HIDE LENS ON RESIZE
  // =====================================================

  useEffect(() => {
    const handleResize = () => {
      setMagnifier({
        visible: false,
        x: 0,
        y: 0,
      });
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  // =====================================================
  // MAGNIFIER CANVAS
  // =====================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    const magnifierCanvas =
      magnifierCanvasRef.current;

    if (
      !canvas ||
      !magnifierCanvas ||
      !magnifier.visible
    ) {
      return;
    }

    const ctx =
      canvas.getContext("2d", {
        willReadFrequently: true,
      });

    const magnifierCtx =
      magnifierCanvas.getContext("2d");

    if (
      !ctx ||
      !magnifierCtx
    ) {
      return;
    }

    // =================================================
    // LENS SIZE
    // =================================================

    const lensSize = 120;

    // =================================================
    // ZOOM
    // =================================================

    const pixelsPerSide = Math.max(
      3,
      Math.round(12 / zoom),
    );

    const sourceSize = Math.min(
      canvas.width,
      canvas.height,
      pixelsPerSide,
    );

    const half =
      Math.floor(
        sourceSize / 2,
      );

    let sx =
      pixelPosition.x - half;

    let sy =
      pixelPosition.y - half;

    sx = Math.max(
      0,
      Math.min(
        canvas.width -
          sourceSize,
        sx,
      ),
    );

    sy = Math.max(
      0,
      Math.min(
        canvas.height -
          sourceSize,
        sy,
      ),
    );

    // =================================================
    // CLEAR
    // =================================================

    magnifierCtx.clearRect(
      0,
      0,
      lensSize,
      lensSize,
    );

    // =================================================
    // BACKGROUND
    // =================================================

    magnifierCtx.fillStyle =
      darkMode
        ? "#111317"
        : "#ffffff";

    magnifierCtx.fillRect(
      0,
      0,
      lensSize,
      lensSize,
    );

    // =================================================
    // PIXELATED IMAGE
    // =================================================

    magnifierCtx.imageSmoothingEnabled =
      false;

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

    // =================================================
    // PIXEL GRID
    // =================================================

    const cellSize =
      lensSize / sourceSize;

    magnifierCtx.strokeStyle =
      darkMode
        ? "rgba(255,255,255,0.22)"
        : "rgba(0,0,0,0.22)";

    magnifierCtx.lineWidth = 1;

    for (
      let i = 1;
      i < sourceSize;
      i++
    ) {
      const position =
        i * cellSize;

      // Vertical
      magnifierCtx.beginPath();

      magnifierCtx.moveTo(
        position,
        0,
      );

      magnifierCtx.lineTo(
        position,
        lensSize,
      );

      magnifierCtx.stroke();

      // Horizontal
      magnifierCtx.beginPath();

      magnifierCtx.moveTo(
        0,
        position,
      );

      magnifierCtx.lineTo(
        lensSize,
        position,
      );

      magnifierCtx.stroke();
    }

    // =================================================
    // CENTER PIXEL
    // =================================================

    const centerIndex =
      Math.floor(
        sourceSize / 2,
      );

    const centerX =
      centerIndex * cellSize;

    const centerY =
      centerIndex * cellSize;

    magnifierCtx.strokeStyle =
      darkMode
        ? "rgba(255,255,255,0.95)"
        : "rgba(0,0,0,0.95)";

    magnifierCtx.lineWidth = 2;

    magnifierCtx.strokeRect(
      centerX + 1,
      centerY + 1,
      cellSize - 2,
      cellSize - 2,
    );

    // =================================================
    // CENTER GLOW
    // =================================================

    magnifierCtx.shadowColor =
      darkMode
        ? "rgba(255,255,255,0.8)"
        : "rgba(0,0,0,0.35)";

    magnifierCtx.shadowBlur = 8;

    magnifierCtx.strokeRect(
      centerX + 2,
      centerY + 2,
      Math.max(
        1,
        cellSize - 4,
      ),
      Math.max(
        1,
        cellSize - 4,
      ),
    );

    magnifierCtx.shadowBlur = 0;
  }, [
    magnifier.visible,
    pixelPosition.x,
    pixelPosition.y,
    zoom,
    darkMode,
  ]);

  // =====================================================
  // DEFAULT IMAGE COLORS
  // =====================================================

  useEffect(() => {
    if (image !== DEFAULT_IMAGE) {
      return;
    }

    const extractDefaultColors =
      async () => {
        try {
          const palette =
            await Vibrant.from(
              DEFAULT_IMAGE,
            ).getPalette();

          const extractedColors = [
            palette.Vibrant?.hex,
            palette.LightVibrant?.hex,
            palette.DarkVibrant?.hex,
            palette.Muted?.hex,
            palette.LightMuted?.hex,
            palette.DarkMuted?.hex,
          ]
            .filter(Boolean)
            .map((color) =>
              color.toUpperCase(),
            );

          setColors(
            extractedColors,
          );

          if (
            palette.Vibrant?.hex
          ) {
            setDominantColor(
              palette.Vibrant.hex.toUpperCase(),
            );
          } else if (
            extractedColors.length
          ) {
            setDominantColor(
              extractedColors[0],
            );
          }
        } catch (error) {
          console.error(
            "Default palette extraction failed:",
            error,
          );
        }
      };

    extractDefaultColors();
  }, [image]);

  // =====================================================
  // COLOR VARIATIONS
  // =====================================================

  const generateColorVariations = (
    hex,
  ) => {
    const clean =
      hex.replace("#", "");

    const r = parseInt(
      clean.slice(0, 2),
      16,
    );

    const g = parseInt(
      clean.slice(2, 4),
      16,
    );

    const b = parseInt(
      clean.slice(4, 6),
      16,
    );

    const variations = [];

    // Light
    [0.15, 0.3, 0.45].forEach(
      (amount) => {
        variations.push(
          rgbToHex(
            r +
              (255 - r) *
                amount,
            g +
              (255 - g) *
                amount,
            b +
              (255 - b) *
                amount,
          ),
        );
      },
    );

    // Dark
    [0.15, 0.3, 0.45].forEach(
      (amount) => {
        variations.push(
          rgbToHex(
            r *
              (1 - amount),
            g *
              (1 - amount),
            b *
              (1 - amount),
          ),
        );
      },
    );

    return variations;
  };

  // =====================================================
  // SELECT PALETTE COLOR
  // =====================================================

  const selectPaletteColor = (
    color,
  ) => {
    const clean =
      color.replace("#", "");

    const r = parseInt(
      clean.slice(0, 2),
      16,
    );

    const g = parseInt(
      clean.slice(2, 4),
      16,
    );

    const b = parseInt(
      clean.slice(4, 6),
      16,
    );

    setHoverColor(color);

    setHoverRGB(
      `rgb(${r}, ${g}, ${b})`,
    );

    setHoverHSL(
      rgbToHsl(r, g, b),
    );
  };

  // =====================================================
  // SAVE PALETTE
  // =====================================================

  const savePalette = async () => {
    const token =
      localStorage.getItem(
        "token",
      );

    console.log(
      "Image:",
      image,
    );

    console.log(
      "Colors:",
      colors,
    );

    console.log(
      "Dominant:",
      dominantColor,
    );

    console.log(
      "Token:",
      token,
    );

    // Login required
    if (!token) {
      toast.warning(
        "Please login to save your palette",
      );

      navigate("/login");

      return;
    }

    if (!colors.length) {
      toast.error(
        "No colors available",
      );

      return;
    }

    try {
      const res =
        await api.post(
          "/colors",
          {
            title:
              "My Color Palette",
            colors,
            dominantColor,
            image,
          },
        );

      console.log(
        "SAVE RESPONSE:",
        res.data,
      );

      toast.success(
        "Palette saved successfully!",
      );
    } catch (error) {
      console.error(
        "Save Error:",
        error,
      );

      console.log(
        "Status:",
        error.response?.status,
      );

      console.log(
        "Data:",
        error.response?.data,
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to save palette",
      );
    }
  };

  // =====================================================
  // DOWNLOAD JSON
  // =====================================================

  const downloadJSON = () => {
    if (!colors.length) {
      toast.error(
        "No colors available",
      );

      return;
    }

    const data = {
      colors,
      dominantColor,
      createdAt:
        new Date().toISOString(),
    };

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2,
        ),
      ],
      {
        type: "application/json",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement(
        "a",
      );

    link.href = url;

    link.download =
      "color-palette.json";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(url);

    toast.success(
      "Palette downloaded successfully!",
    );
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

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

    setMagnifierDisabled(false);

    setZoom(1.5);

    setExpandedColors({});
  };

  // =====================================================
  // COMMON STYLES
  // =====================================================

  const cardStyle = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    color: theme.text,
    transition:
      "background 0.3s ease, color 0.3s ease, border 0.3s ease",
  };

  const inputStyle = {
    background: theme.input,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="container-fluid py-4"
      style={{
        background:
          theme.background,
        color: theme.text,
        minHeight: "100vh",
        transition:
          "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* =================================================
          HIDDEN CANVAS
      ================================================= */}

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div
        className="picker-main-layout"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "20px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1.55fr) minmax(300px, 0.85fr)",
          gap: "35px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* =================================================
            LEFT SECTION
        ================================================= */}

        <div className="picker-left-section">
          {/* IMAGE TITLE */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div>
              <h5
                style={{
                  fontWeight: 800,
                  margin: 0,
                  color: theme.text,
                }}
              >
                Image
              </h5>

              <small
                style={{
                  color:
                    theme.muted,
                }}
              >
                Move your pointer or
                finger over the image
              </small>
            </div>
          </div>

          {/* =================================================
              IMAGE AREA
          ================================================= */}

          <div
            ref={
              magnifierContainerRef
            }
            className="image-magnifier-container"
            {...getRootProps()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "700px",
              minHeight: "300px",
              borderRadius: "18px",
              overflow: "visible",
              background:
                darkMode
                  ? "#111317"
                  : "#ffffff",
              border: `1px solid ${theme.border}`,
              boxShadow: darkMode
                ? "0 20px 50px rgba(0,0,0,0.35)"
                : "0 15px 40px rgba(0,0,0,0.08)",
              padding: "10px",
              boxSizing: "border-box",
              transition:
                "all 0.3s ease",
            }}
          >
            <input
              {...getInputProps()}
            />

            <img
              ref={imageRef}
              src={image}
              alt="Uploaded"
              onLoad={handleImageLoad}
              onMouseMove={
                handleMouseMove
              }
              onMouseLeave={
                handleMouseLeave
              }
              onClick={
                handleImageClick
              }
              onTouchStart={
                handleTouchStart
              }
              onTouchMove={
                handleTouchMove
              }
              onTouchEnd={
                handleTouchEnd
              }
              onTouchCancel={
                handleTouchCancel
              }
              draggable={false}
              style={{
                width: "100%",
                maxWidth: "700px",
                userSelect: "none",
                WebkitUserSelect:
                  "none",
                touchAction: "none",
                display: "block",
                cursor:
                  magnifierDisabled
                    ? "default"
                    : "crosshair",
              }}
            />

            {/* =================================================
                MAGNIFIER LENS
            ================================================= */}

            {magnifier.visible &&
              !magnifierDisabled && (
                <div
                  onPointerDown={
                    handleMagnifierPointerDown
                  }
                  style={{
                    position: "fixed",

                    // Cursor থেকে মাত্র 15px দূরে
                    left: `${Math.max(
                      8,
                      Math.min(
                        magnifier.x +
                          15,
                        window.innerWidth -
                          128,
                      ),
                    )}px`,

                    top: `${Math.max(
                      8,
                      Math.min(
                        magnifier.y +
                          15,
                        window.innerHeight -
                          128,
                      ),
                    )}px`,

                    width: "120px",
                    height: "120px",

                    borderRadius: "50%",

                    overflow: "hidden",

                    background:
                      "rgba(10, 12, 15, 0.9)",

                    border:
                      "3px solid rgba(255,255,255,0.95)",

                    boxShadow: `
                      0 0 0 2px rgba(0,0,0,0.75),
                      0 10px 35px rgba(0,0,0,0.7),
                      0 0 25px rgba(255,255,255,0.15)
                    `,

                    zIndex: 99999,

                    pointerEvents:
                      "auto",

                    touchAction:
                      "none",

                    userSelect:
                      "none",

                    WebkitUserSelect:
                      "none",
                  }}
                >
                  {/* ZOOMED PIXEL CANVAS */}

                  <canvas
                    ref={
                      magnifierCanvasRef
                    }
                    width={120}
                    height={120}
                    style={{
                      width: "120px",
                      height: "120px",
                      display: "block",
                      imageRendering:
                        "pixelated",
                      userSelect:
                        "none",
                      pointerEvents:
                        "none",
                    }}
                  />

                  {/* CENTER PIXEL FOCUS */}

                  <div
                    style={{
                      position:
                        "absolute",

                      top: "50%",

                      left: "50%",

                      width: "28px",

                      height: "28px",

                      transform:
                        "translate(-50%, -50%)",

                      border:
                        "2px solid rgba(255,255,255,0.95)",

                      borderRadius:
                        "4px",

                      boxShadow: `
                        0 0 0 1px rgba(0,0,0,0.8),
                        0 0 10px rgba(255,255,255,0.7)
                      `,

                      pointerEvents:
                        "none",
                    }}
                  />

                  {/* CENTER CROSSHAIR VERTICAL */}

                  <div
                    style={{
                      position:
                        "absolute",

                      top: "50%",

                      left: "50%",

                      width: "2px",

                      height: "34px",

                      transform:
                        "translate(-50%, -50%)",

                      background:
                        "rgba(255,255,255,0.95)",

                      boxShadow:
                        "0 0 5px rgba(0,0,0,0.9)",

                      pointerEvents:
                        "none",
                    }}
                  />

                  {/* CENTER CROSSHAIR HORIZONTAL */}

                  <div
                    style={{
                      position:
                        "absolute",

                      top: "50%",

                      left: "50%",

                      width: "34px",

                      height: "2px",

                      transform:
                        "translate(-50%, -50%)",

                      background:
                        "rgba(255,255,255,0.95)",

                      boxShadow:
                        "0 0 5px rgba(0,0,0,0.9)",

                      pointerEvents:
                        "none",
                    }}
                  />
                </div>
              )}
          </div>

          {/* =================================================
              UPLOAD BUTTON
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              marginTop: "18px",
            }}
          >
            <input
              id="main-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{
                display: "none",
              }}
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                onDrop([file]);

                e.target.value = "";
              }}
            />
          </div>

          {/* =================================================
              SELECTED COLOR INFO
          ================================================= */}

          {hoverColor && (
            <div
              className="mt-4"
              style={{
                width: "100%",
                maxWidth: "700px",
                padding:
                  "16px 20px",
                background:
                  hoverColor,
                color: "#ffffff",
                borderRadius:
                  "14px",
                textShadow:
                  "0 1px 4px rgba(0,0,0,0.8)",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap:
                    "wrap",
                  alignItems:
                    "center",
                  gap: "30px",
                }}
              >
                <div>
                  <small
                    style={{
                      opacity: 0.75,
                    }}
                  >
                    HEX
                  </small>

                  <div
                    style={{
                      fontWeight: 800,
                    }}
                  >
                    {hoverColor}
                  </div>
                </div>

                <div>
                  <small
                    style={{
                      opacity: 0.75,
                    }}
                  >
                    RGB
                  </small>

                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {hoverRGB}
                  </div>
                </div>

                <div>
                  <small
                    style={{
                      opacity: 0.75,
                    }}
                  >
                    Pixel
                  </small>

                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {pixelPosition.x},{" "}
                    {pixelPosition.y}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              COLOR PALETTE
          ================================================= */}

          {colors.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                width: "100%",
                maxWidth: "700px",
              }}
            >
              <h5
                style={{
                  fontWeight: 800,
                  marginBottom:
                    "16px",
                }}
              >
                Color Palette
              </h5>

              <div
                className="palette-list"
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                }}
              >
                {colors.map(
                  (
                    color,
                    index,
                  ) => (
                    <div
                      key={index}
                    >
                      {/* PALETTE ROW */}

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          width:
                            "100%",
                          minWidth: 0,
                        }}
                      >
                        {/* COLOR */}

                        <div
                          onClick={() =>
                            selectPaletteColor(
                              color,
                            )
                          }
                          style={{
                            flex: 1,
                            minWidth: 0,
                            height:
                              "48px",
                            background:
                              color,
                            borderRadius:
                              "10px",
                            cursor:
                              "pointer",
                            border:
                              hoverColor ===
                              color
                                ? `3px solid ${theme.text}`
                                : "1px solid rgba(255,255,255,0.12)",
                            boxShadow:
                              hoverColor ===
                              color
                                ? "0 0 0 2px rgba(13,110,253,0.35)"
                                : "none",
                            transition:
                              "all 0.2s ease",
                          }}
                        />

                        {/* HEX */}

                        <span
                          style={{
                            width:
                              "82px",
                            minWidth:
                              "60px",
                            fontSize:
                              "13px",
                            fontWeight:
                              700,
                            color:
                              theme.text,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {color}
                        </span>

                        {/* PLUS */}

                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            setExpandedColors(
                              (
                                prev,
                              ) => ({
                                ...prev,
                                [index]:
                                  !prev[
                                    index
                                  ],
                              }),
                            )
                          }
                          style={{
                            width:
                              "38px",
                            height:
                              "38px",
                            flexShrink:
                              0,
                            borderRadius:
                              "10px",
                            border: `1px solid ${theme.border}`,
                            background:
                              theme.card,
                            color:
                              theme.text,
                            fontSize:
                              "20px",
                            fontWeight:
                              700,
                            padding: 0,
                          }}
                        >
                          {expandedColors[
                            index
                          ]
                            ? "−"
                            : "+"}
                        </button>
                      </div>

                      {/* VARIATIONS */}

                      {expandedColors[
                        index
                      ] && (
                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "repeat(6, 1fr)",
                            gap: "8px",
                            marginTop:
                              "10px",
                            padding:
                              "10px",
                            background:
                              theme.card,
                            border: `1px solid ${theme.border}`,
                            borderRadius:
                              "12px",
                          }}
                        >
                          {generateColorVariations(
                            color,
                          ).map(
                            (
                              variation,
                              variationIndex,
                            ) => (
                              <div
                                key={
                                  variationIndex
                                }
                                onClick={() => {
                                  selectPaletteColor(
                                    variation,
                                  );

                                  toast.success(
                                    `Color Selected: ${variation}`,
                                    {
                                      autoClose: 800,
                                    },
                                  );
                                }}
                                title={
                                  variation
                                }
                                style={{
                                  height:
                                    "42px",
                                  background:
                                    variation,
                                  borderRadius:
                                    "8px",
                                  cursor:
                                    "pointer",
                                  border:
                                    "1px solid rgba(0,0,0,0.15)",
                                  transition:
                                    "transform 0.2s ease",
                                }}
                              />
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT SECTION
        ================================================= */}

        <div className="picker-right-section">
          <h5
            style={{
              fontWeight: 800,
              marginBottom: "18px",
            }}
          >
            Colors
          </h5>

          {/* =================================================
              COLOR PREVIEW
          ================================================= */}

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom:
                "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "100px",
                borderRadius:
                  "14px",
                backgroundColor:
                  hoverColor ||
                  "#4CAF4F",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.12)",
              }}
            />

            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius:
                  "14px",
                backgroundColor:
                  dominantColor ||
                  "#4CAF4F",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.12)",
              }}
            />
          </div>

          {/* =================================================
              HEX
          ================================================= */}

          <div
            style={{
              ...cardStyle,
              display: "grid",
              gridTemplateColumns:
                "70px 1fr 45px",
              alignItems:
                "center",
              minHeight: "55px",
              borderRadius:
                "14px",
              marginBottom:
                "10px",
              overflow:
                "hidden",
            }}
          >
            <span
              style={{
                padding: "15px",
                color:
                  theme.muted,
                fontWeight: 700,
              }}
            >
              HEX
            </span>

            <strong
              style={{
                padding: "15px",
                borderLeft: `1px solid ${theme.border}`,
              }}
            >
              {hoverColor ||
                "#4CAF4F"}
            </strong>

            <button
              type="button"
              style={{
                border: "none",
                background:
                  "transparent",
                color:
                  theme.text,
                fontSize:
                  "16px",
              }}
              onClick={() => {
                if (!hoverColor)
                  return;

                navigator.clipboard.writeText(
                  hoverColor,
                );

                toast.success(
                  "HEX Copied!",
                );
              }}
            >
              📋
            </button>
          </div>

          {/* =================================================
              RGB
          ================================================= */}

          <div
            style={{
              ...cardStyle,
              display: "grid",
              gridTemplateColumns:
                "70px 1fr 45px",
              alignItems:
                "center",
              minHeight: "55px",
              borderRadius:
                "14px",
              marginBottom:
                "10px",
              overflow:
                "hidden",
            }}
          >
            <span
              style={{
                padding: "15px",
                color:
                  theme.muted,
                fontWeight: 700,
              }}
            >
              RGB
            </span>

            <strong
              style={{
                padding: "15px",
                borderLeft: `1px solid ${theme.border}`,
                fontSize:
                  "14px",
              }}
            >
              {hoverRGB ||
                "rgb(76, 175, 79)"}
            </strong>

            <button
              type="button"
              style={{
                border: "none",
                background:
                  "transparent",
                color:
                  theme.text,
                fontSize:
                  "16px",
              }}
              onClick={() => {
                if (!hoverRGB)
                  return;

                navigator.clipboard.writeText(
                  hoverRGB,
                );

                toast.success(
                  "RGB Copied!",
                );
              }}
            >
              📋
            </button>
          </div>

          {/* =================================================
              HSL
          ================================================= */}

          <div
            style={{
              ...cardStyle,
              display: "grid",
              gridTemplateColumns:
                "70px 1fr 45px",
              alignItems:
                "center",
              minHeight: "55px",
              borderRadius:
                "14px",
              marginBottom:
                "25px",
              overflow:
                "hidden",
            }}
          >
            <span
              style={{
                padding: "15px",
                color:
                  theme.muted,
                fontWeight: 700,
              }}
            >
              HSL
            </span>

            <strong
              style={{
                padding: "15px",
                borderLeft: `1px solid ${theme.border}`,
                fontSize:
                  "14px",
              }}
            >
              {hoverHSL ||
                "hsl(122, 39%, 49%)"}
            </strong>

            <button
              type="button"
              style={{
                border: "none",
                background:
                  "transparent",
                color:
                  theme.text,
                fontSize:
                  "16px",
              }}
              onClick={() => {
                if (!hoverHSL)
                  return;

                navigator.clipboard.writeText(
                  hoverHSL,
                );

                toast.success(
                  "HSL Copied!",
                );
              }}
            >
              📋
            </button>
          </div>

          {/* =================================================
              USE YOUR OWN IMAGE
          ================================================= */}

          <div
            style={{
              marginTop: "20px",
              padding: "22px",
              borderRadius:
                "16px",
              background:
                theme.card,
              border: `1px solid ${theme.border}`,
              transition:
                "all 0.3s ease",
            }}
          >
            <h5
              style={{
                fontWeight: 800,
                marginBottom:
                  "15px",
              }}
            >
              Use your own image
            </h5>

            <button
              type="button"
              className="btn w-100"
              onClick={() =>
                document
                  .getElementById(
                    "side-image-input",
                  )
                  ?.click()
              }
              style={{
                background:
                  darkMode
                    ? "#ffffff"
                    : "#212529",
                color:
                  darkMode
                    ? "#08090a"
                    : "#ffffff",
                border: "none",
                borderRadius:
                  "12px",
                padding: "12px",
                fontWeight: 700,
              }}
            >
              🖼️ Upload Another
              Image
            </button>

            <input
              id="side-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{
                display: "none",
              }}
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                onDrop([file]);

                e.target.value = "";
              }}
            />
          </div>

          {/* =================================================
              ZOOM CONTROLS
          ================================================= */}

          <div
            style={{
              ...cardStyle,
              marginTop: "14px",
              padding: "15px",
              borderRadius:
                "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <strong>
                Magnifier Zoom
              </strong>

              <span
                style={{
                  color:
                    theme.muted,
                  fontWeight: 700,
                }}
              >
                {zoom.toFixed(2)}x
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop:
                  "12px",
              }}
            >
              <button
                type="button"
                className="btn flex-fill"
                onClick={() =>
                  setZoom(
                    (prev) =>
                      Math.max(
                        0.5,
                        Number(
                          (
                            prev -
                            0.25
                          ).toFixed(
                            2,
                          ),
                        ),
                      ),
                  )
                }
                style={{
                  background:
                    theme.card,
                  color:
                    theme.text,
                  border: `1px solid ${theme.border}`,
                }}
              >
                −
              </button>

              <button
                type="button"
                className="btn flex-fill"
                onClick={() =>
                  setZoom(
                    (prev) =>
                      Math.min(
                        8,
                        Number(
                          (
                            prev +
                            0.25
                          ).toFixed(
                            2,
                          ),
                        ),
                      ),
                  )
                }
                style={{
                  background:
                    theme.card,
                  color:
                    theme.text,
                  border: `1px solid ${theme.border}`,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* =================================================
              REMOVE IMAGE
          ================================================= */}

          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={
              removeImage
            }
            style={{
              marginTop: "14px",
              minHeight: "48px",
              borderRadius:
                "12px",
              fontWeight: 700,
            }}
          >
            🗑️ Remove Image
          </button>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
              marginTop:
                "16px",
            }}
          >
            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={
                downloadJSON
              }
              style={{
                minHeight: "52px",
                borderRadius:
                  "14px",
                border: `1px solid ${theme.border}`,
                background:
                  theme.card,
                color:
                  theme.text,
                fontSize:
                  "14px",
                fontWeight: 700,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
                cursor:
                  "pointer",
                transition:
                  "all 0.25s ease",
              }}
            >
              <span
                style={{
                  fontSize:
                    "20px",
                }}
              >
                📥
              </span>

              <span>
                Download
              </span>
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={
                savePalette
              }
              style={{
                minHeight: "52px",
                borderRadius:
                  "14px",
                border:
                  "1px solid #0d6efd",
                background:
                  "#0d6efd",
                color:
                  "#ffffff",
                fontSize:
                  "14px",
                fontWeight: 700,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
                cursor:
                  "pointer",
                transition:
                  "all 0.25s ease",
                boxShadow:
                  "0 8px 20px rgba(13,110,253,0.2)",
              }}
            >
              <span
                style={{
                  fontSize:
                    "20px",
                }}
              >
                💾
              </span>

              <span>
                Save Palette
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE STYLE
      ===================================================== */}

      <style>
        {`
          .image-magnifier-container {
            transition:
              background 0.3s ease,
              border 0.3s ease,
              box-shadow 0.3s ease;
          }

          .palette-list > div {
            transition:
              transform 0.2s ease;
          }

          .palette-list > div:hover {
            transform: translateY(-1px);
          }

          @media (max-width: 991px) {
            .picker-main-layout {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
            }

            .picker-right-section {
              width: 100%;
            }
          }

          @media (max-width: 576px) {
            .picker-main-layout {
              padding: 12px !important;
              gap: 22px !important;
            }

            .image-magnifier-container {
              min-height: 220px !important;
              padding: 7px !important;
              border-radius: 14px !important;
            }

            .image-magnifier-container img {
              border-radius: 10px !important;
            }

            .picker-right-section h5 {
              font-size: 17px;
            }

            .color-palette-section {
              margin-top: 22px !important;
            }

            .palette-row {
              gap: 7px !important;
            }

            .palette-row span {
              width: 68px !important;
              min-width: 55px !important;
              font-size: 11px !important;
            }

            .palette-row button {
              width: 34px !important;
              height: 34px !important;
            }

            .color-value {
              grid-template-columns:
                60px 1fr 42px !important;
            }

            .action-buttons {
              grid-template-columns:
                1fr !important;
            }
          }

          @media (max-width: 380px) {
            .picker-main-layout {
              padding: 8px !important;
            }

            .palette-row span {
              width: 62px !important;
              font-size: 10px !important;
            }

            .palette-row button {
              width: 32px !important;
              height: 32px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default UploadBox;