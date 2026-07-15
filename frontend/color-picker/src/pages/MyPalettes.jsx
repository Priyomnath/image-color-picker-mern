import { useEffect, useState } from "react";
import api from "../api/api";

//13/07/2026
import { toast } from "react-toastify";

function MyPalettes() {
  const [palettes, setPalettes] = useState([]);

  //12/07/2026
  const [search, setSearch] = useState("");

  //15/07/2026
  const [showFavorites, setShowFavorites] = useState(false);

  const loadPalettes = async () => {
    try {
      const { data } = await api.get("/colors");
      setPalettes(data.palettes);
    } catch (err) {
      console.log(err);
    }
  };

  //12/07/2026
  const copyPalette = (colors) => {
    navigator.clipboard.writeText(colors.join(", "));

    //13/07/2026
    toast.success("Palette Copied 📋");
  };

  //15/07/2026
  const exportCSS = (colors) => {
    const css = `:root {
  ${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}
  }`;

    const blob = new Blob([css], { type: "text/css" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "colors.css";

    a.click();

    URL.revokeObjectURL(url);

    toast.success("CSS Exported 🎨");
  };

  //15/07/2026
  const exportTailwind = (colors) => {
    const content = `export default {
  theme: {
    extend: {
      colors: {
${colors
  .map((color, index) => `        color${index + 1}: "${color}",`)
  .join("\n")}
      },
    },
  },
};`;

    const blob = new Blob([content], {
      type: "application/javascript",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "tailwind-colors.js";
    a.click();

    URL.revokeObjectURL(url);

    toast.success("Tailwind Config Exported 🚀");
  };

  const deletePalette = async (id) => {
    try {
      await api.delete(`/colors/${id}`);
      loadPalettes();

      //13/07/2026
      toast.success("Palette Deleted 🗑️");
    } catch (err) {
      console.log(err);

      //13/07/2026
      toast.error("Something went wrong");
    }
  };

  //15/07/2026
  const toggleFavorite = async (id) => {
    try {
      await api.put(`/colors/${id}/favorite`);

      loadPalettes();

      toast.success("Favorite Updated ❤️");
    } catch (err) {
      console.log(err);
      toast.error("Failed to Update Favorite");
    }
  };

  //12/07/2026
  const renamePalette = async (id, oldTitle) => {
    const newTitle = prompt("Enter New Palette Name", oldTitle);

    if (!newTitle || newTitle.trim() === "") return;

    try {
      await api.put(`/colors/${id}`, {
        title: newTitle,
      });

      loadPalettes();

      //13/07/2026
      toast.success("Palette Renamed ✏️");
    } catch (err) {
      console.log(err);
      // alert("Rename Failed");

      //13/07/2026
      toast.error("Rename Failed ❌");
    }
  };

  useEffect(() => {
    loadPalettes();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Palettes</h2>

      {/* 12/07/2026 */}
      <input
        className="form-control mb-4"
        placeholder="Search Palette..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 15/07/2026 */}
      <div className="mb-4">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Show All" : "❤️ Favorites"}
        </button>
      </div>

      <div className="row">
        {palettes
          //15/07/2026
          .filter((palette) => {
            const matchSearch = (palette.title || "")
              .toLowerCase()
              .includes(search.toLowerCase());

            const matchFavorite = showFavorites ? palette.favorite : true;

            return matchSearch && matchFavorite;
          })

          .map((palette) => (
            <div className="col-md-4 mb-4" key={palette._id}>
              <div className="card shadow">
                {/* Add */}
                {palette.image ? (
                  <img
                    src={palette.image}
                    alt={palette.title}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "220px",
                      background: palette.dominantColor,
                    }}
                  />
                )}

                <div className="card-body">
                  {/* //15/07/2026 */}
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{palette.title}</h5>

                    <button
                      className="btn btn-light border-0 fs-4"
                      onClick={() => toggleFavorite(palette._id)}
                    >
                      {palette.favorite ? "❤️" : "🤍"}
                    </button>
                  </div>

                  {/* 13/07/2026 */}
                  <small className="text-muted d-block mb-2">
                    Created: {new Date(palette.createdAt).toLocaleString()}
                  </small>

                  <p>{palette.dominantColor}</p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: 25,
                          height: 25,
                          background: color,
                          borderRadius: 4,
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                  </div>

                  {/* 12/07/2026 */}
                  <button
                    className="btn btn-success w-100 mb-2"
                    onClick={() => copyPalette(palette.colors)}
                  >
                    Copy Palette
                  </button>

                  {/* //15/07/2026 */}
                  <button
                    className="btn btn-info w-100 mb-2"
                    onClick={() => exportCSS(palette.colors)}
                  >
                    Export CSS
                  </button>

                  {/* //15/07/2026 */}
                  <button
                    className="btn btn-dark w-100 mb-2"
                    onClick={() => exportTailwind(palette.colors)}
                  >
                    Export Tailwind
                  </button>

                  {/* //12/07/2026 */}
                  <button
                    className="btn btn-warning w-100 mb-2"
                    onClick={() => renamePalette(palette._id, palette.title)}
                  >
                    Rename
                  </button>

                  <button
                    className="btn btn-danger w-100"
                    onClick={() => deletePalette(palette._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyPalettes;
