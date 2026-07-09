import { useState } from "react";

function ColorPalette({ colors }) {
  const [copied, setCopied] = useState("");

  const copyColor = async (color) => {
    await navigator.clipboard.writeText(color);
    setCopied(color);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="row mt-5">
      {colors.map((color, index) => (
        <div className="col-lg-2 col-md-3 col-6 mb-4" key={index}>
          <div
            className="shadow rounded overflow-hidden"
            style={{
              background: "#fff",
            }}
          >
            <div
              style={{
                background: color,
                height: "120px",
              }}
            ></div>

            <div className="p-3">

              <h6 className="text-center">{color}</h6>

              <small className="text-muted d-block text-center">
                RGB({hexToRgb(color)})
              </small>

              <button
                className={`btn mt-3 w-100 ${
                  copied === color
                    ? "btn-success"
                    : "btn-primary"
                }`}
                onClick={() => copyColor(color)}
              >
                {copied === color ? "Copied ✓" : "Copy"}
              </button>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ColorPalette;