import { useState } from "react";
import { toast } from "react-toastify";

function ColorPalette({ colors }) {
  const [copied, setCopied] = useState("");

  // HEX → RGB
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // HEX → HSL
  const hexToHsl = (hex) => {
    const cleanHex = hex.replace("#", "");

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
          break;
      }

      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(
      s * 100
    )}%, ${Math.round(l * 100)}%)`;
  };

  // Copy Color
  const copyColor = async (value) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(value);

      toast.success(`${value} copied 📋`);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);

      toast.error("Copy failed");
    }
  };

  // Empty State
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <section className="mt-5">

      {/* ============================= */}
      {/* Section Header */}
      {/* ============================= */}

      <div className="mb-4">

        <h3 className="fw-bold mb-1 text-body">
          Extracted Color Palette
        </h3>

        <p className="text-muted mb-0">
          Explore and copy colors extracted from your image.
        </p>

      </div>

      {/* ============================= */}
      {/* Horizontal Color Strip */}
      {/* ============================= */}

      <div
        className="d-flex overflow-hidden rounded-4 shadow-sm mb-5"
        style={{
          height: "120px",
        }}
      >

        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="flex-fill position-relative"
            style={{
              backgroundColor: color,
              minWidth: "80px",
              transition: "transform 0.2s ease",
            }}
            title={color}
          >

            {/* Color Number */}

            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                color: "#fff",
                fontWeight: "700",
                textShadow:
                  "0 2px 6px rgba(0,0,0,0.5)",
              }}
            >
              {index + 1}
            </div>

          </div>
        ))}

      </div>

      {/* ============================= */}
      {/* Color Cards */}
      {/* ============================= */}

      <div className="row g-4">

        {colors.map((color, index) => {
          const rgb = hexToRgb(color);
          const hsl = hexToHsl(color);

          return (
            <div
              className="col-xl-4 col-lg-6"
              key={`${color}-${index}`}
            >

              <div
                className="card border-0 shadow-sm h-100 overflow-hidden"
                style={{
                  borderRadius: "20px",
                }}
              >

                {/* Color Preview */}

                <div
                  style={{
                    height: "180px",
                    backgroundColor: color,
                  }}
                />

                {/* Color Information */}

                <div className="p-4">

                  {/* Color Title */}

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                      <small className="text-muted">
                        COLOR {index + 1}
                      </small>

                      <h5 className="fw-bold mb-0">
                        {color.toUpperCase()}
                      </h5>

                    </div>

                    <div
                      className="rounded-circle border"
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: color,
                      }}
                    />

                  </div>

                  {/* HEX */}

                  <div className="mb-3">

                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-3">

                      <div>
                        <small className="text-muted d-block">
                          HEX
                        </small>

                        <strong>
                          {color.toUpperCase()}
                        </strong>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-primary copy-color-btn"
                        onClick={() =>
                          copyColor(color.toUpperCase())
                        }
                      >
                        {copied === color.toUpperCase()
                          ? "Copied ✓"
                          : "Copy"}
                      </button>

                    </div>

                  </div>

                  {/* RGB */}

                  <div className="mb-3">

                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-3">

                      <div>
                        <small className="text-muted d-block">
                          RGB
                        </small>

                        <strong>
                          {rgb}
                        </strong>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-primary copy-color-btn"
                        onClick={() => copyColor(rgb)}
                      >
                        {copied === rgb
                          ? "Copied ✓"
                          : "Copy"}
                      </button>

                    </div>

                  </div>

                  {/* HSL */}

                  <div>

                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-3">

                      <div>
                        <small className="text-muted d-block">
                          HSL
                        </small>

                        <strong>
                          {hsl}
                        </strong>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-primary copy-color-btn"
                        onClick={() => copyColor(hsl)}
                      >
                        {copied === hsl
                          ? "Copied ✓"
                          : "Copy"}
                      </button>

                    </div>

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