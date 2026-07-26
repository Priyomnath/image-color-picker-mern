import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function MyPalettes() {
  const [palettes, setPalettes] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme();

  // =========================================
  // Load Palettes
  // =========================================

  const loadPalettes = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/colors");

      setPalettes(data.palettes || []);
    } catch (error) {
      console.error("Load Palettes Error:", error);

      toast.error(error.response?.data?.message || "Failed to load palettes");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // Copy Entire Palette
  // =========================================

  const copyPalette = async (colors = []) => {
    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

    try {
      await navigator.clipboard.writeText(colors.join(", "));

      toast.success("Palette Copied 📋");
    } catch (error) {
      console.error("Copy Error:", error);

      toast.error("Copy Failed");
    }
  };

  // =========================================
  // Copy Single Color
  // =========================================

  const copyColor = async (color) => {
    try {
      await navigator.clipboard.writeText(color);

      toast.success(`${color} copied 📋`);
    } catch (error) {
      console.error("Copy Color Error:", error);

      toast.error("Copy Failed");
    }
  };

  // =========================================
  // Export CSS
  // =========================================

  const exportCSS = (colors = []) => {
    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

    const css = `:root {
${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}
}`;

    const blob = new Blob([css], {
      type: "text/css",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "colors.css";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    toast.success("CSS Exported 🎨");
  };

  // =========================================
  // Export Tailwind
  // =========================================

  const exportTailwind = (colors = []) => {
    if (!colors.length) {
      toast.error("No colors available");
      return;
    }

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

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    toast.success("Tailwind Config Exported 🚀");
  };

  // =========================================
  // Delete Palette
  // =========================================

  const deletePalette = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this palette?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/colors/${id}`);

      setPalettes((prev) => prev.filter((palette) => palette._id !== id));

      toast.success("Palette Deleted 🗑️");
    } catch (error) {
      console.error("Delete Palette Error:", error);

      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  // =========================================
  // Toggle Favorite
  // =========================================

  const toggleFavorite = async (id) => {
    try {
      await api.put(`/colors/${id}/favorite`);

      setPalettes((prev) =>
        prev.map((palette) =>
          palette._id === id
            ? {
                ...palette,
                favorite: !palette.favorite,
              }
            : palette,
        ),
      );

      toast.success("Favorite Updated ❤️");
    } catch (error) {
      console.error("Favorite Error:", error);

      toast.error(error.response?.data?.message || "Failed to Update Favorite");
    }
  };

  // =========================================
  // Rename Palette
  // =========================================

  const renamePalette = async (id, oldTitle) => {
    const newTitle = window.prompt(
      "Enter New Palette Name",
      oldTitle || "My Palette",
    );

    if (!newTitle || newTitle.trim() === "") {
      return;
    }

    try {
      const updatedTitle = newTitle.trim();

      await api.put(`/colors/${id}`, {
        title: updatedTitle,
      });

      setPalettes((prev) =>
        prev.map((palette) =>
          palette._id === id
            ? {
                ...palette,
                title: updatedTitle,
              }
            : palette,
        ),
      );

      toast.success("Palette Renamed ✏️");
    } catch (error) {
      console.error("Rename Error:", error);

      toast.error(error.response?.data?.message || "Rename Failed ❌");
    }
  };

  // =========================================
  // Search + Favorite Filter
  // =========================================

  const filteredPalettes = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return palettes.filter((palette) => {
      const title = String(palette.title || "").toLowerCase();

      const matchSearch = title.includes(searchText);

      const matchFavorite = showFavorites ? palette.favorite === true : true;

      return matchSearch && matchFavorite;
    });
  }, [palettes, search, showFavorites]);

  // =========================================
  // Load on Page Open
  // =========================================

  useEffect(() => {
    loadPalettes();
  }, []);

  // =========================================
  // Statistics
  // =========================================

  const favoriteCount = palettes.filter(
    (palette) => palette.favorite === true,
  ).length;

  // =========================================
  // UI
  // =========================================

  return (
    <main
      className="container py-5"
      style={{
        color: darkMode ? "#f8f9fa" : "#212529",
      }}
    >
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="text-center mb-5">
        <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">
          🎨 Your Collection
        </span>

        <h1 className="display-5 fw-bold mb-3">My Palettes</h1>

        <p
          className="mx-auto mb-4"
          style={{
            color: darkMode ? "#adb5bd" : "#6c757d",
            maxWidth: "650px",
          }}
        >
          Manage, copy, export, rename, and organize all your saved color
          palettes.
        </p>

        {/* ================================= */}
        {/* Stats */}
        {/* ================================= */}

        <div className="d-flex justify-content-center flex-wrap gap-3">
          {/* Total */}

          <div
            className="card border-0 shadow-sm rounded-4 px-4 py-3"
            style={{
              backgroundColor: darkMode ? "#212529" : "#ffffff",
              color: darkMode ? "#ffffff" : "#212529",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                🎨
              </span>

              <div className="text-start">
                <small
                  className="d-block"
                  style={{
                    color: darkMode ? "#adb5bd" : "#6c757d",
                  }}
                >
                  Total Palettes
                </small>

                <strong className="fs-5">{palettes.length}</strong>
              </div>
            </div>
          </div>

          {/* Favorites */}

          <div
            className="card border-0 shadow-sm rounded-4 px-4 py-3"
            style={{
              backgroundColor: darkMode ? "#212529" : "#ffffff",
              color: darkMode ? "#ffffff" : "#212529",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                ❤️
              </span>

              <div className="text-start">
                <small
                  className="d-block"
                  style={{
                    color: darkMode ? "#adb5bd" : "#6c757d",
                  }}
                >
                  Favorites
                </small>

                <strong className="fs-5">{favoriteCount}</strong>
              </div>
            </div>
          </div>

          {/* Showing */}

          <div
            className="card border-0 shadow-sm rounded-4 px-4 py-3"
            style={{
              backgroundColor: darkMode ? "#212529" : "#ffffff",
              color: darkMode ? "#ffffff" : "#212529",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                👁️
              </span>

              <div className="text-start">
                <small
                  className="d-block"
                  style={{
                    color: darkMode ? "#adb5bd" : "#6c757d",
                  }}
                >
                  Showing
                </small>

                <strong className="fs-5">{filteredPalettes.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* Search + Filter */}
      {/* ================================= */}

      <div
        className="card border-0 shadow-sm rounded-4 mb-5"
        style={{
          backgroundColor: darkMode ? "#212529" : "#ffffff",
        }}
      >
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            {/* Search */}

            <div className="col-lg-8">
              <div className="position-relative">
                <span
                  className="position-absolute top-50 translate-middle-y"
                  style={{
                    left: "16px",
                    fontSize: "20px",
                    zIndex: 2,
                  }}
                >
                  🔍
                </span>

                <input
                  type="text"
                  className="form-control form-control-lg rounded-3 ps-5"
                  placeholder="Search Palette..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  style={{
                    backgroundColor:
                      darkMode
                        ? "#2b3035"
                        : "#ffffff",
                    color: darkMode
                      ? "#ffffff"
                      : "#212529",
                    borderColor:
                      darkMode
                        ? "#495057"
                        : "#dee2e6",
                  }}
                />

                {search && (
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={() => setSearch("")}
                    title="Clear Search"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>

            {/* Favorite Filter */}

            <div className="col-lg-4">
              <button
                type="button"
                className={`btn btn-lg w-100 rounded-3 ${
                  showFavorites ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                {showFavorites ? "❤️ Showing Favorites" : "🤍 Show Favorites"}
              </button>
            </div>
          </div>

          {/* Active Filters */}

          {(search || showFavorites) && (
            <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
              <small
                style={{
                  color: darkMode ? "#adb5bd" : "#6c757d",
                }}
              >
                Active filters:
              </small>

              {search && (
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  🔍 {search}
                </span>
              )}

              {showFavorites && (
                <span className="badge bg-danger rounded-pill px-3 py-2">
                  ❤️ Favorites
                </span>
              )}

              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none"
                onClick={() => {
                  setSearch("");
                  setShowFavorites(false);
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================================= */}
      {/* Loading */}
      {/* ================================= */}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />

          <p
            className="mt-3"
            style={{
              color: darkMode ? "#adb5bd" : "#6c757d",
            }}
          >
            Loading your palettes...
          </p>
        </div>
      )}

      {/* ================================= */}
      {/* No Palettes */}
      {/* ================================= */}

      {!loading && palettes.length === 0 && (
        <div className="text-center py-5">
          <div
            style={{
              fontSize: "70px",
            }}
          >
            🎨
          </div>

          <h3 className="fw-bold mt-3">No Palettes Yet</h3>

          <p
            style={{
              color: darkMode ? "#adb5bd" : "#6c757d",
            }}
          >
            Upload an image and save your first color palette.
          </p>
        </div>
      )}

      {/* ================================= */}
      {/* No Search Results */}
      {/* ================================= */}

      {!loading && palettes.length > 0 && filteredPalettes.length === 0 && (
        <div className="text-center py-5">
          <div
            style={{
              fontSize: "60px",
            }}
          >
            🔍
          </div>

          <h3 className="fw-bold mt-3">No Palettes Found</h3>

          <p
            style={{
              color: darkMode ? "#adb5bd" : "#6c757d",
            }}
          >
            Try another search or change your favorite filter.
          </p>

          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setSearch("");
              setShowFavorites(false);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* Palette Grid */}
      {/* ================================= */}

      {!loading && filteredPalettes.length > 0 && (
        <div className="row g-4">
          {filteredPalettes.map((palette) => (
            <div key={palette._id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  backgroundColor: darkMode ? "#212529" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#212529",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* ================================= */}
                {/* Image */}
                {/* ================================= */}

                <div
                  className="position-relative"
                  style={{
                    height: "240px",
                    overflow: "hidden",
                  }}
                >
                  {palette.image ? (
                    <img
                      src={palette.image}
                      alt={palette.title || "Saved color palette"}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  ) : (
                    <div
                      className="w-100 h-100"
                      style={{
                        background: palette.dominantColor || "#6366f1",
                      }}
                    />
                  )}

                  {/* Image Overlay */}

                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.7))",
                    }}
                  >
                    <span className="badge bg-dark bg-opacity-75 rounded-pill">
                      🎨 {palette.colors?.length || 0} Colors
                    </span>
                  </div>

                  {/* Favorite */}

                  <button
                    type="button"
                    className="position-absolute top-0 end-0 m-3 btn rounded-circle shadow"
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      border: "none",
                      backgroundColor: darkMode ? "#343a40" : "#ffffff",
                    }}
                    onClick={() => toggleFavorite(palette._id)}
                  >
                    {palette.favorite ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* ================================= */}
                {/* Card Body */}
                {/* ================================= */}

                <div className="card-body p-4 d-flex flex-column">
                  {/* Title */}

                  <div className="mb-3">
                    <h5 className="fw-bold mb-1 text-truncate">
                      {palette.title || "My Palette"}
                    </h5>

                    <small
                      style={{
                        color: darkMode ? "#adb5bd" : "#6c757d",
                      }}
                    >
                      {palette.createdAt
                        ? new Date(palette.createdAt).toLocaleDateString()
                        : "Saved Palette"}
                    </small>
                  </div>

                  {/* Dominant Color */}

                  <div className="mb-4">
                    <small
                      className="d-block mb-2"
                      style={{
                        color: darkMode ? "#adb5bd" : "#6c757d",
                      }}
                    >
                      Dominant Color
                    </small>

                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          background: palette.dominantColor || "#6366f1",
                          border: "1px solid rgba(0,0,0,0.12)",
                        }}
                      />

                      <code className="fw-semibold">
                        {palette.dominantColor || "N/A"}
                      </code>
                    </div>
                  </div>

                  {/* Color Swatches */}

                  <div className="mb-4">
                    <small
                      className="d-block mb-2"
                      style={{
                        color: darkMode ? "#adb5bd" : "#6c757d",
                      }}
                    >
                      Color Palette
                    </small>

                    <div className="d-flex flex-wrap gap-2">
                      {palette.colors?.map((color, index) => (
                        <button
                          key={`${color}-${index}`}
                          type="button"
                          title={`Copy ${color}`}
                          onClick={() => copyColor(color)}
                          style={{
                            width: "42px",
                            height: "42px",
                            background: color,
                            borderRadius: "10px",
                            border: "2px solid rgba(0,0,0,0.08)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-4px) scale(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(0) scale(1)";
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* ================================= */}
                  {/* Buttons */}
                  {/* ================================= */}

                  <div className="mt-auto">
                    {/* Copy */}

                    <button
                      type="button"
                      className="btn btn-primary w-100 rounded-3 mb-2"
                      onClick={() => copyPalette(palette.colors)}
                    >
                      📋 Copy Palette
                    </button>

                    {/* Export */}

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-success w-100 rounded-3"
                          onClick={() => exportCSS(palette.colors)}
                        >
                          🎨 CSS
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          type="button"
                          className={`btn w-100 rounded-3 ${
                            darkMode ? "btn-outline-light" : "btn-outline-dark"
                          }`}
                          onClick={() => exportTailwind(palette.colors)}
                        >
                          🚀 Tailwind
                        </button>
                      </div>
                    </div>

                    {/* Rename Delete */}

                    <div className="row g-2">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-warning w-100 rounded-3"
                          onClick={() =>
                            renamePalette(palette._id, palette.title)
                          }
                        >
                          ✏️ Rename
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100 rounded-3"
                          onClick={() => deletePalette(palette._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyPalettes;
