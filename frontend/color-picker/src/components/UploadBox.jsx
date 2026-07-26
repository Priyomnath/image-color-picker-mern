//25/07/2026 {time: 11:33 AM}
import { useCallback, useRef, useState } from "react";

import { useDropzone } from "react-dropzone";

import api from "../api/api";
import ColorPalette from "./ColorPalette";
import { Vibrant } from "node-vibrant/browser";

import { toast } from "react-toastify";

function UploadBox() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [dominantColor, setDominantColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  //25/07/2026 {time: 11:46 AM}
  const fileInputRef = useRef(null);

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // Upload Image + Extract Colors
  // ==========================================

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    try {
      setLoading(true);

      // Reset previous result
      setColors([]);
      setDominantColor("");
      setImageUrl("");

      // Local Preview
      const preview = URL.createObjectURL(file);
      setImage(preview);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await api.post("/upload", formData);

      const cloudImage = uploadRes.data.imageUrl;

      setImageUrl(cloudImage);

      // Extract Colors
      const palette = await Vibrant.from(cloudImage).getPalette();

      const extracted = Object.values(palette)
        .filter(Boolean)
        .map((item) => item.hex);

      setColors(extracted);

      // Dominant Color
      if (palette.Vibrant) {
        setDominantColor(palette.Vibrant.hex);
      }

      toast.success("Colors extracted successfully 🎨");
    } catch (error) {
      console.error("Image Upload Error:", error);

      toast.error(error.response?.data?.message || "Image Upload Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Dropzone
  // ==========================================

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: false,
  });

  // ==========================================
  // Download JSON
  // ==========================================

  const downloadJSON = () => {
    if (colors.length === 0) return;

    const data = JSON.stringify(
      {
        dominantColor,
        colors,
      },
      null,
      2,
    );

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "color-palette.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    toast.success("Palette JSON downloaded 📥");
  };

  // ==========================================
  // Save Palette
  // ==========================================

  const savePalette = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        toast.error("Please Login First");
        return;
      }

      if (!imageUrl || colors.length === 0) {
        toast.error("Please upload an image first");
        return;
      }

      await api.post("/colors", {
        title: "My Palette",
        dominantColor,
        colors,
        image: imageUrl,
      });

      toast.success("Palette Saved Successfully 🎨");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Save Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* //25/07/2026 {time:  PM} */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onDrop([file]);
          }

          e.target.value = "";
        }}
      />

      {/* ========================================= */}
      {/* PREMIUM UPLOAD AREA */}
      {/* ========================================= */}

      {!image && (
        <div
          {...getRootProps()}
          //25/07/2026 {time:  PM}
          className="upload-area rounded-4 p-4 p-md-5 text-center shadow-sm"
          style={{
            cursor: "pointer",
            minHeight: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isDragActive ? "3px dashed #0d6efd" : "2px dashed #6c757d",
            background: isDragActive
              ? "rgba(13, 110, 253, 0.08)"
              : "linear-gradient(135deg, #f8f9fa, #ffffff)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            if (!isDragActive) {
              e.currentTarget.style.borderColor = "#0d6efd";

              e.currentTarget.style.transform = "translateY(-3px)";

              e.currentTarget.style.boxShadow =
                "0 15px 35px rgba(13, 110, 253, 0.12)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragActive) {
              e.currentTarget.style.borderColor = "#6c757d";

              e.currentTarget.style.transform = "translateY(0)";

              e.currentTarget.style.boxShadow = "";
            }
          }}
        >
          <input {...getInputProps()} />

          <div className="w-100">
            {/* Upload Icon */}

            <div
              className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "85px",
                height: "85px",
                fontSize: "42px",
                background: "linear-gradient(135deg, #e7f1ff, #f0e7ff)",
              }}
            >
              {isDragActive ? "📥" : "🖼️"}
            </div>

            {/* Title */}

            <h2 className="fw-bold mb-2 text-body">
              {isDragActive ? "Drop Your Image Here" : "Upload Your Image"}
            </h2>

            {/* Description */}

            <p className="text-muted mb-4">
              {isDragActive
                ? "Release your mouse to upload the image"
                : "Drag & drop your image here, or click the button below"}
            </p>

            {/* Browse Button */}

            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
              onClick={handleChangeImage}
            >
              📁 Choose Image
            </button>

            {/* Supported Formats */}

            <div className="mt-4">
              <small className="text-muted">
                Supported formats: JPG, JPEG, PNG, WEBP
              </small>

              <br />

              <small className="text-muted">
                Maximum recommended size: 10MB
              </small>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MAIN RESULT SECTION */}
      {/* ========================================= */}

      {image && (
        <>
          <div className="row g-4 align-items-stretch">
            {/* ================================= */}
            {/* IMAGE PREVIEW */}
            {/* ================================= */}

            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                {/* Header */}

                <div className="card-header bg-white border-0 p-4">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                      <h4 className="fw-bold mb-1">Your Image</h4>

                      <p className="text-muted mb-0">Uploaded image preview</p>
                    </div>

                    {/* Change Image */}

                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-3"
                      onClick={handleChangeImage}
                    >
                      🔄 Change Image
                    </button>
                  </div>
                </div>

                {/* Image */}

                {/* //25/07/2026 {time:  PM} */}
                <div
                  className="image-preview-container p-3"
                  style={{
                    background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                  }}
                >
                  <img
                    src={image}
                    alt="Uploaded"
                    className="img-fluid rounded-3 w-100"
                    style={{
                      maxHeight: "500px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* DOMINANT COLOR */}
            {/* ================================= */}

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-1">Dominant Color</h4>

                  <p className="text-muted mb-4">
                    The most prominent color in your image
                  </p>

                  {dominantColor && (
                    <div>
                      {/* Color Preview */}

                      <div
                        className="rounded-4 mb-4 shadow-sm"
                        style={{
                          height: "220px",
                          backgroundColor: dominantColor,
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />

                      {/* HEX */}

                      <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">HEX</small>

                          <h5 className="fw-bold mb-0">{dominantColor}</h5>
                        </div>

                        <button
                          className="btn btn-outline-secondary rounded-pill copy-color-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(dominantColor);

                            toast.success("HEX copied to clipboard 📋");
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Loading */}

                  {!dominantColor && loading && (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      />

                      <p className="text-muted mt-3 mb-0">
                        Extracting colors...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* ACTION BUTTONS */}
          {/* ================================= */}

          {colors.length > 0 && (
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h4 className="fw-bold mb-1">Your Color Palette</h4>

                    <p className="text-muted mb-0">
                      {colors.length} colors extracted from your image
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {/* Download */}

                    {/* //25/07/2026 {time: PM} */}
                    <button
                      className="btn btn-outline-success rounded-pill px-3 premium-btn download-json-btn"
                      onClick={downloadJSON}
                    >
                      ⬇️ Download JSON
                    </button>

                    {/* Save */}

                    {/* //25/07/2026 {time:  PM} */}
                    <button
                      className="btn btn-primary rounded-pill px-3 premium-btn save-palette-btn"
                      onClick={savePalette}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "💾 Save Palette"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* COLOR PALETTE */}
          {/* ================================= */}

          <ColorPalette colors={colors} />

          {/* ================================= */}
          {/* UPLOAD ANOTHER IMAGE */}
          {/* ================================= */}

          <div className="text-center mt-5">
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-4 py-2"
              onClick={handleChangeImage}
            >
              🖼️ Upload Another Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadBox;
