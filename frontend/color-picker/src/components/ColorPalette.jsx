import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ColorPalette({
  colors,
  selectedColor,
  setSelectedColor,
  selectedRGB,
  setSelectedRGB,
}) {
  const [copied, setCopied] = useState("");
  const [lockedColors, setLockedColors] = useState([]);
  const [palette, setPalette] = useState([]);

  // ==========================================
  // SYNC COLORS FROM UPLOADBOX
  // ==========================================
  useEffect(() => {
    if (colors && colors.length > 0) {
      setPalette(colors);
    }
  }, [colors]);

  // ==========================================
  // HEX → RGB
  // ==========================================
  const hexToRgb = (hex) => {
    if (!hex) return "";

    const cleanHex = hex.replace("#", "");

    if (cleanHex.length !== 6) {
      return "";
    }

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // ==========================================
  // HEX → HSL
  // ==========================================
  const hexToHsl = (hex) => {
    if (!hex) return "";

    const cleanHex = hex.replace("#", "");

    if (cleanHex.length !== 6) {
      return "";
    }

    let r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    let g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    let b = parseInt(cleanHex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;

    if (max !== min) {
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

    return `hsl(${Math.round(h * 360)}, ${Math.round(
      s * 100
    )}%, ${Math.round(l * 100)}%)`;
  };

  // ==========================================
  // COPY COLOR
  // ==========================================
  const copyColor = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(value);

      toast.success(`${value} copied 📋`, {
        autoClose: 1200,
      });

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Copy failed");
    }
  };

  // ==========================================
  // SELECT COLOR
  // ==========================================
  const handleSelectColor = (color) => {
    const hex = color.toUpperCase();
    const rgb = hexToRgb(hex);

    if (setSelectedColor) {
      setSelectedColor(hex);
    }

    if (setSelectedRGB) {
      setSelectedRGB(rgb);
    }

    toast.success(`${hex} selected 🎨`, {
      autoClose: 1000,
    });
  };

  // ==========================================
  // LOCK / UNLOCK COLOR
  // ==========================================
  const toggleLock = (index) => {
    setLockedColors((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      return [...prev, index];
    });
  };

  // ==========================================
  // RANDOM COLOR GENERATOR
  // ==========================================
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";

    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  // ==========================================
  // RANDOMIZE PALETTE
  // LOCKED COLORS WILL STAY SAME
  // ==========================================
  const randomizePalette = () => {
    if (!palette.length) return;

    const newPalette = palette.map((color, index) => {
      if (lockedColors.includes(index)) {
        return color;
      }

      return generateRandomColor();
    });

    setPalette(newPalette);

    toast.success("Palette randomized 🔀", {
      autoClose: 1200,
    });
  };

  // ==========================================
  // RESET PALETTE
  // ==========================================
  const resetPalette = () => {
    if (!colors || colors.length === 0) return;

    setPalette(colors);
    setLockedColors([]);

    toast.success("Palette reset successfully ↩️", {
      autoClose: 1200,
    });
  };

  // ==========================================
  // DOWNLOAD PALETTE JSON
  // ==========================================
  const downloadPalette = () => {
    if (!palette.length) return;

    const data = JSON.stringify(
      {
        colors: palette,
      },
      null,
      2
    );

    const blob = new Blob([data], {
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

    toast.success("Palette downloaded 📥", {
      autoClose: 1200,
    });
  };

  // ==========================================
  // EMPTY STATE
  // ==========================================
  if (!palette || palette.length === 0) {
    return null;
  }

  // ==========================================
  // SELECTED COLOR DATA
  // ==========================================
  const selectedHex = selectedColor || palette[0];

  const selectedHexUpper = selectedHex?.toUpperCase();

  const selectedRgb = selectedRGB || hexToRgb(selectedHexUpper);

  const selectedHsl = hexToHsl(selectedHexUpper);

  return (
    <section className="mt-5">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <span
            className="badge rounded-pill px-3 py-2 mb-2"
            style={{
              background: "rgba(13, 110, 253, 0.1)",
              color: "#0d6efd",
            }}
          >
            🎨 COLOR PALETTE
          </span>

          <h3 className="fw-bold mb-1 text-body">Extracted Color Palette</h3>

          <p className="text-muted mb-0">
            Select, lock, randomize and copy your colors.
          </p>
        </div>

        {/* PALETTE ACTIONS */}

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-primary rounded-pill px-3"
            onClick={randomizePalette}
          >
            🔀 Randomize
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3"
            onClick={resetPalette}
          >
            ↩️ Reset
          </button>

          <button
            type="button"
            className="btn btn-outline-success rounded-pill px-3"
            onClick={downloadPalette}
          >
            ⬇️ Download
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* PREMIUM PALETTE STRIP */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div
          className="d-flex"
          style={{
            minHeight: "180px",
          }}
        >
          {palette.map((color, index) => {
            const hex = color.toUpperCase();

            const isSelected = selectedHexUpper === hex;

            const isLocked = lockedColors.includes(index);

            return (
              <div
                key={`${color}-${index}`}
                className="position-relative flex-fill"
                style={{
                  backgroundColor: color,
                  minWidth: "70px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: isSelected ? "scaleY(1.04)" : "scaleY(1)",
                  zIndex: isSelected ? 5 : 1,
                }}
                onClick={() => handleSelectColor(color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {/* SELECTED BORDER */}

                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "5px",
                      border: "3px solid #ffffff",
                      boxShadow: "0 0 0 2px rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* COLOR NUMBER */}

                <div
                  className="position-absolute top-0 start-50 translate-middle-x mt-3"
                  style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "13px",
                    textShadow: "0 2px 7px rgba(0,0,0,0.6)",
                  }}
                >
                  {index + 1}
                </div>

                {/* LOCK BUTTON */}

                <button
                  type="button"
                  className="position-absolute top-0 end-0 m-2 border-0 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(0,0,0,0.35)",
                    color: "#ffffff",
                    backdropFilter: "blur(5px)",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  title={isLocked ? "Unlock color" : "Lock color"}
                >
                  {isLocked ? "🔒" : "🔓"}
                </button>

                {/* HEX */}

                <div
                  className="position-absolute bottom-0 start-0 end-0 text-center py-3"
                  style={{
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.65))",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {hex}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================= */}
      {/* SELECTED COLOR PANEL */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
        <div className="row g-0">
          {/* COLOR PREVIEW */}

          <div className="col-lg-4">
            <div
              style={{
                minHeight: "300px",
                height: "100%",
                backgroundColor: selectedHexUpper,
                position: "relative",
              }}
            >
              <div
                className="position-absolute top-50 start-50 translate-middle text-center"
                style={{
                  color: "#ffffff",
                  textShadow: "0 3px 12px rgba(0,0,0,0.6)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: "2px",
                    marginBottom: "8px",
                  }}
                >
                  SELECTED COLOR
                </div>

                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                  }}
                >
                  {selectedHexUpper}
                </div>
              </div>
            </div>
          </div>

          {/* COLOR DETAILS */}

          <div className="col-lg-8">
            <div className="p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <small className="text-muted">CURRENT SELECTION</small>

                  <h4 className="fw-bold mb-0 mt-1 text-body">
                    Color Information
                  </h4>
                </div>

                <div
                  className="rounded-circle"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: selectedHexUpper,
                    border: "4px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                  }}
                />
              </div>

              {/* HEX */}

              <div className="mb-3">
                <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">HEX</small>

                    <strong className="text-body">{selectedHexUpper}</strong>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      copied === selectedHexUpper
                        ? "btn-success"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => copyColor(selectedHexUpper)}
                  >
                    {copied === selectedHexUpper ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* RGB */}

              <div className="mb-3">
                <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">RGB</small>

                    <strong className="text-body">{selectedRgb}</strong>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      copied === selectedRgb
                        ? "btn-success"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => copyColor(selectedRgb)}
                  >
                    {copied === selectedRgb ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* HSL */}

              <div>
                <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">HSL</small>

                    <strong className="text-body">{selectedHsl}</strong>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      copied === selectedHsl
                        ? "btn-success"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => copyColor(selectedHsl)}
                  >
                    {copied === selectedHsl ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ALL COLOR CARDS */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-body">All Colors</h4>

          <p className="text-muted mb-0">
            Click any color to make it your active selection.
          </p>
        </div>

        <span className="badge bg-primary rounded-pill px-3 py-2">
          {palette.length} Colors
        </span>
      </div>

      <div className="row g-4">
        {palette.map((color, index) => {
          const hex = color.toUpperCase();

          const rgb = hexToRgb(hex);

          const hsl = hexToHsl(hex);

          const isSelected = selectedHexUpper === hex;

          const isLocked = lockedColors.includes(index);

          return (
            <div className="col-xl-4 col-lg-6" key={`${color}-${index}`}>
              <div
                className="card border-0 shadow-sm h-100 overflow-hidden"
                style={{
                  borderRadius: "22px",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  outline: isSelected ? "3px solid #0d6efd" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";

                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* PREVIEW */}

                <div
                  className="position-relative"
                  style={{
                    height: "190px",
                    backgroundColor: color,
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectColor(color)}
                >
                  {/* NUMBER */}

                  <div
                    className="position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "700",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    COLOR {index + 1}
                  </div>

                  {/* LOCK STATUS */}

                  {isLocked && (
                    <div
                      className="position-absolute top-0 end-0 m-3"
                      style={{
                        fontSize: "18px",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                      }}
                    >
                      🔒
                    </div>
                  )}

                  {/* HEX */}

                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-3"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.7))",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong
                        className="text-white"
                        style={{
                          fontSize: "20px",
                          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                        }}
                      >
                        {hex}
                      </strong>

                      {isSelected && (
                        <span className="badge bg-light text-primary rounded-pill">
                          Selected ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD BODY */}

                <div className="p-4">
                  {/* HEADER */}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <small className="text-muted">EXTRACTED COLOR</small>

                      <h5 className="fw-bold mb-0 mt-1 text-body">
                        Color {index + 1}
                      </h5>
                    </div>

                    <div
                      className="rounded-circle"
                      style={{
                        width: "42px",
                        height: "42px",
                        backgroundColor: color,
                        border: "3px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  </div>

                  {/* HEX */}

                  <div className="mb-3">
                    <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <small className="text-muted d-block">HEX</small>

                        <strong className="text-body">{hex}</strong>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${
                          copied === hex
                            ? "btn-success"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => copyColor(hex)}
                      >
                        {copied === hex ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* RGB */}

                  <div className="mb-3">
                    <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <small className="text-muted d-block">RGB</small>

                        <strong className="text-body">{rgb}</strong>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${
                          copied === rgb
                            ? "btn-success"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => copyColor(rgb)}
                      >
                        {copied === rgb ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* HSL */}

                  <div className="mb-4">
                    <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <small className="text-muted d-block">HSL</small>

                        <strong className="text-body">{hsl}</strong>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${
                          copied === hsl
                            ? "btn-success"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => copyColor(hsl)}
                      >
                        {copied === hsl ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn flex-grow-1 rounded-pill ${
                        isSelected ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => handleSelectColor(color)}
                    >
                      {isSelected ? "✓ Selected" : "Select Color"}
                    </button>

                    <button
                      type="button"
                      className={`btn rounded-pill ${
                        isLocked ? "btn-dark" : "btn-outline-secondary"
                      }`}
                      onClick={() => toggleLock(index)}
                      title={isLocked ? "Unlock color" : "Lock color"}
                    >
                      {isLocked ? "🔒" : "🔓"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ColorPalette;