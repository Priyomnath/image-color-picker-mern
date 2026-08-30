import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();
  const { darkMode } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      toast.error("Please enter your full name");
      return;
    }

    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // REGISTER
      // =========================================

      await api.post("/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
      });

      // =========================================
      // AUTO LOGIN
      // =========================================

      const { data } = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      if (data?.success) {
        authLogin(data.user, data.token);

        toast.success("Account created successfully 🎉");

        navigate("/");
      } else {
        toast.success("Account created successfully");

        navigate("/login");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STYLES
  // =========================================

  const pageStyle = {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",

    background: darkMode
      ? "radial-gradient(circle at top left, #172554 0%, #0f172a 40%, #020617 100%)"
      : "radial-gradient(circle at top left, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)",

    position: "relative",
    overflow: "hidden",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "470px",

    padding: "38px",

    borderRadius: "28px",

    background: darkMode
      ? "rgba(15, 23, 42, 0.88)"
      : "rgba(255, 255, 255, 0.92)",

    border: darkMode
      ? "1px solid rgba(148,163,184,0.18)"
      : "1px solid rgba(226,232,240,0.9)",

    boxShadow: darkMode
      ? "0 30px 80px rgba(0,0,0,0.45)"
      : "0 30px 80px rgba(15,23,42,0.12)",

    backdropFilter: "blur(18px)",
  };

  const inputWrapperStyle = {
    position: "relative",
    marginBottom: "18px",
  };

  const inputStyle = {
    width: "100%",
    height: "54px",

    borderRadius: "15px",

    border: darkMode
      ? "1px solid #334155"
      : "1px solid #dbe1ea",

    background: darkMode
      ? "rgba(2,6,23,0.7)"
      : "#ffffff",

    color: darkMode
      ? "#f8fafc"
      : "#111827",

    padding: "0 16px",

    fontSize: "15px",

    outline: "none",

    transition: "all 0.2s ease",

    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",

    marginBottom: "8px",

    fontSize: "13px",

    fontWeight: "700",

    color: darkMode
      ? "#cbd5e1"
      : "#374151",
  };

  return (
    <div style={pageStyle}>

      {/* Decorative circles */}

      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(99,102,241,0.10)",
          top: "-120px",
          left: "-100px",
          filter: "blur(10px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(14,165,233,0.08)",
          bottom: "-150px",
          right: "-100px",
          filter: "blur(10px)",
        }}
      />

      <div style={cardStyle}>

        {/* ========================================= */}
        {/* BRAND */}
        {/* ========================================= */}

        <div className="text-center">

          <div
            style={{
              width: "68px",
              height: "68px",

              margin: "0 auto 18px",

              borderRadius: "20px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "32px",

              background:
                "linear-gradient(135deg, #7c3aed, #2563eb)",

              boxShadow:
                "0 15px 35px rgba(37,99,235,0.28)",
            }}
          >
            🎨
          </div>

          <h2
            className="fw-bold mb-2"
            style={{
              color: darkMode ? "#f8fafc" : "#111827",
              fontSize: "28px",
            }}
          >
            Create your account
          </h2>

          <p
            style={{
              color: darkMode ? "#94a3b8" : "#6b7280",
              fontSize: "14px",
              marginBottom: "30px",
            }}
          >
            Start creating beautiful color palettes
          </p>
        </div>

        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <div style={inputWrapperStyle}>

            <label style={labelStyle}>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              style={inputStyle}
            />

          </div>

          {/* EMAIL */}

          <div style={inputWrapperStyle}>

            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              style={inputStyle}
            />

          </div>

          {/* PASSWORD */}

          <div style={inputWrapperStyle}>

            <label style={labelStyle}>
              Password
            </label>

            <div style={{ position: "relative" }}>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
                style={{
                  ...inputStyle,
                  paddingRight: "52px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  position: "absolute",

                  right: "10px",
                  top: "50%",

                  transform: "translateY(-50%)",

                  width: "38px",
                  height: "38px",

                  border: "none",

                  borderRadius: "10px",

                  background: "transparent",

                  color: darkMode
                    ? "#94a3b8"
                    : "#64748b",

                  fontSize: "18px",

                  cursor: "pointer",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: darkMode
                  ? "#64748b"
                  : "#94a3b8",
              }}
            >
              Use at least 6 characters.
            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="btn w-100"
            style={{
              height: "54px",

              border: "none",

              borderRadius: "15px",

              background:
                "linear-gradient(135deg, #7c3aed, #2563eb)",

              color: "#fff",

              fontSize: "15px",

              fontWeight: "700",

              boxShadow:
                "0 12px 25px rgba(37,99,235,0.22)",

              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />

                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        {/* ========================================= */}
        {/* LOGIN LINK */}
        {/* ========================================= */}

        <div
          className="text-center"
          style={{
            marginTop: "26px",

            paddingTop: "22px",

            borderTop: darkMode
              ? "1px solid #1e293b"
              : "1px solid #eef2f7",

            color: darkMode
              ? "#94a3b8"
              : "#6b7280",

            fontSize: "14px",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            className="fw-bold text-decoration-none"
            style={{
              color: "#2563eb",
            }}
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;