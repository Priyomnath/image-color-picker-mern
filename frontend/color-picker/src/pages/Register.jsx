import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { darkMode } = useTheme();

  // =========================================
  // REGISTER FORM
  // =========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================================
  // OTP
  // =========================================

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const otpRefs = useRef([]);

  // =========================================
  // STEP
  // =========================================

  const [step, setStep] = useState("register");

  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  // =========================================
  // TIMER
  // =========================================

  const [timer, setTimer] = useState(0);

  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  const [showPassword, setShowPassword] = useState(false);

  // =========================================
  // COUNTDOWN
  // =========================================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          clearInterval(interval);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =========================================
  // FORMAT TIMER
  // =========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // =========================================
  // SEND REGISTER OTP
  // =========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // FRONTEND VALIDATION
    // =========================================

    if (!normalizedName) {
      toast.error("Please enter your full name");
      return;
    }

    if (normalizedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!normalizedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // =========================================
    // API
    // =========================================

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: normalizedName,
        email: normalizedEmail,
        password,
      });

      if (response.data?.success) {
        setName(normalizedName);
        setEmail(normalizedEmail);

        setOtp(["", "", "", "", "", ""]);

        setStep("otp");

        setTimer(90);

        toast.success(
          response.data.message || "Verification code sent to your email",
        );

        // Focus first OTP input
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to start registration",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // OTP CHANGE
  // =========================================

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];

    newOtp[index] = digit;

    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // =========================================
  // OTP KEYBOARD
  // =========================================

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];

        newOtp[index] = "";

        setOtp(newOtp);

        return;
      }

      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // =========================================
  // OTP PASTE
  // =========================================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, 5);

    setTimeout(() => {
      otpRefs.current[focusIndex]?.focus();
    }, 0);
  };

  // =========================================
  // VERIFY REGISTER OTP
  // =========================================

  const verifyRegisterOTP = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (timer <= 0) {
      toast.error("Verification code has expired");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/verify-otp", {
        email,
        otp: finalOtp,
      });

      if (response.data?.success) {
        const userData = response.data.user;

        const token = response.data.token;

        // =====================================
        // AUTO LOGIN
        // =====================================

        const loginSuccess = login(userData, token);

        if (!loginSuccess) {
          toast.error("Account created, but automatic login failed.");
          return;
        }

        toast.success("Account created successfully! 🎉");

        navigate("/");
      } else {
        toast.error(response.data?.message || "Verification failed");
      }
    } catch (error) {
      console.error("VERIFY REGISTER OTP ERROR:", error);

      const message = error.response?.data?.message || "Verification failed";

      toast.error(message);

      if (
        error.response?.status === 400 &&
        message.toLowerCase().includes("expired")
      ) {
        setTimer(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RESEND REGISTER OTP
  // =========================================

  const resendOTP = async () => {
    if (timer > 0 || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/resend-otp", {
        email,
      });

      if (response.data?.success) {
        setOtp(["", "", "", "", "", ""]);

        setTimer(90);

        toast.success(response.data.message || "New verification code sent");

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(response.data?.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("RESEND REGISTER OTP ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to resend verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CHANGE EMAIL
  // =========================================

  const changeEmail = () => {
    setStep("register");

    setOtp(["", "", "", "", "", ""]);

    setTimer(0);
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setGoogleLoading(true);

      if (!credentialResponse?.credential) {
        toast.error("Google login failed");
        return;
      }

      const response = await api.post("/auth/google", {
        access_token: credentialResponse.credential,
      });

      if (response.data?.success) {
        const userData = response.data.user;

        const token = response.data.token;

        const loginSuccess = login(userData, token);

        if (!loginSuccess) {
          toast.error("Google login failed");
          return;
        }

        toast.success("Google login successful!");

        navigate("/");
      } else {
        toast.error(response.data?.message || "Google login failed");
      }
    } catch (error) {
      console.error("GOOGLE REGISTER ERROR:", error);

      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================================
  // GOOGLE ERROR
  // =========================================

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
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
      ? "linear-gradient(135deg,#0f172a,#111827)"
      : "linear-gradient(135deg,#f8fafc,#eef2ff)",
  };

  const cardStyle = {
    width: "100%",

    maxWidth: "460px",

    borderRadius: "24px",

    padding: "36px",

    background: darkMode ? "rgba(30,41,59,.96)" : "rgba(255,255,255,.98)",

    border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",

    boxShadow: darkMode
      ? "0 25px 60px rgba(0,0,0,.35)"
      : "0 25px 60px rgba(15,23,42,.10)",
  };

  const inputStyle = {
    width: "100%",

    height: "52px",

    borderRadius: "14px",

    border: darkMode ? "1px solid #475569" : "1px solid #d1d5db",

    background: darkMode ? "#111827" : "#fff",

    color: darkMode ? "#fff" : "#111827",

    padding: "0 16px",

    fontSize: "15px",

    outline: "none",
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="text-center mb-4">
          <div
            style={{
              width: "64px",
              height: "64px",

              margin: "0 auto 18px",

              borderRadius: "18px",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: "30px",

              background: "linear-gradient(135deg,#6f42c1,#0d6efd)",

              boxShadow: "0 10px 30px rgba(13,110,253,.25)",
            }}
          >
            🎨
          </div>

          <h2
            className="fw-bold mb-2"
            style={{
              color: darkMode ? "#fff" : "#111827",
            }}
          >
            {step === "register" ? "Create Your Account" : "Verify Your Email"}
          </h2>

          <p
            className="mb-0"
            style={{
              color: darkMode ? "#94a3b8" : "#6b7280",

              fontSize: "14px",
            }}
          >
            {step === "register"
              ? "Create your Image Color Picker account"
              : `We sent a 6-digit verification code to ${email}`}
          </p>
        </div>

        {/* ================================= */}
        {/* REGISTER STEP */}
        {/* ================================= */}

        {step === "register" && (
          <>
            <form onSubmit={handleRegister}>
              {/* NAME */}

              <div className="mb-3">
                <label
                  className="fw-semibold mb-2 d-block"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#374151",

                    fontSize: "14px",
                  }}
                >
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

              <div className="mb-3">
                <label
                  className="fw-semibold mb-2 d-block"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#374151",

                    fontSize: "14px",
                  }}
                >
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  style={inputStyle}
                />
              </div>

              {/* PASSWORD */}

              <div className="mb-4">
                <label
                  className="fw-semibold mb-2 d-block"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#374151",

                    fontSize: "14px",
                  }}
                >
                  Password
                </label>

                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      position: "absolute",

                      right: "14px",

                      top: "50%",

                      transform: "translateY(-50%)",

                      border: "none",

                      background: "transparent",

                      color: darkMode ? "#94a3b8" : "#6b7280",

                      fontSize: "18px",

                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <small
                  style={{
                    color: darkMode ? "#94a3b8" : "#6b7280",

                    fontSize: "12px",
                  }}
                >
                  Use at least 8 characters
                </small>
              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 rounded-3 py-3 fw-semibold"
                style={{
                  background: "linear-gradient(135deg,#6f42c1,#0d6efd)",

                  border: "none",

                  color: "#fff",

                  boxShadow: "0 8px 20px rgba(13,110,253,.22)",
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Sending Verification Code...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* ================================= */}
            {/* DIVIDER */}
            {/* ================================= */}

            <div className="d-flex align-items-center my-4">
              <div
                style={{
                  flex: 1,
                  height: "1px",

                  background: darkMode ? "#374151" : "#e5e7eb",
                }}
              />

              <span
                className="px-3"
                style={{
                  color: darkMode ? "#94a3b8" : "#9ca3af",

                  fontSize: "13px",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,
                  height: "1px",

                  background: darkMode ? "#374151" : "#e5e7eb",
                }}
              />
            </div>

            {/* ================================= */}
            {/* GOOGLE */}
            {/* ================================= */}

            <div
              style={{
                position: "relative",

                minHeight: "44px",

                display: "flex",

                justifyContent: "center",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                theme={darkMode ? "filled_black" : "outline"}
                size="large"
                shape="pill"
                text="continue_with"
                width="100%"
              />

              {googleLoading && (
                <div
                  style={{
                    position: "absolute",

                    inset: 0,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    background: darkMode ? "#1e293b" : "#fff",

                    borderRadius: "24px",
                  }}
                >
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </div>
              )}
            </div>

            {/* ================================= */}
            {/* LOGIN */}
            {/* ================================= */}

            <p
              className="text-center mt-4 mb-0"
              style={{
                color: darkMode ? "#94a3b8" : "#6b7280",

                fontSize: "14px",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="fw-semibold text-decoration-none"
                style={{
                  color: "#0d6efd",
                }}
              >
                Login
              </Link>
            </p>
          </>
        )}

        {/* ================================= */}
        {/* OTP STEP */}
        {/* ================================= */}

        {step === "otp" && (
          <>
            {/* EMAIL */}

            <div
              className="text-center mb-4"
              style={{
                padding: "12px 16px",

                borderRadius: "12px",

                background: darkMode ? "rgba(59,130,246,.10)" : "#eff6ff",

                color: darkMode ? "#93c5fd" : "#2563eb",

                fontSize: "14px",
              }}
            >
              📧 <strong>{email}</strong>
            </div>

            {/* OTP FORM */}

            <form onSubmit={verifyRegisterOTP}>
              {/* OTP BOXES */}

              <div
                className="d-flex justify-content-center gap-2 mb-4"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    style={{
                      width: "48px",

                      height: "58px",

                      textAlign: "center",

                      fontSize: "22px",

                      fontWeight: "700",

                      borderRadius: "13px",

                      border: digit
                        ? "2px solid #0d6efd"
                        : darkMode
                          ? "1px solid #475569"
                          : "1px solid #d1d5db",

                      background: darkMode ? "#111827" : "#fff",

                      color: darkMode ? "#fff" : "#111827",

                      outline: "none",
                    }}
                    disabled={loading || timer <= 0}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* TIMER */}

              <div className="text-center mb-4">
                {timer > 0 ? (
                  <>
                    <div
                      style={{
                        color: darkMode ? "#cbd5e1" : "#6b7280",

                        fontSize: "13px",
                      }}
                    >
                      Code expires in
                    </div>

                    <div
                      className="fw-bold mt-1"
                      style={{
                        fontSize: "20px",

                        color: timer <= 20 ? "#dc3545" : "#0d6efd",
                      }}
                    >
                      {formatTime(timer)}
                    </div>
                  </>
                ) : (
                  <div
                    className="fw-semibold"
                    style={{
                      color: "#dc3545",

                      fontSize: "14px",
                    }}
                  >
                    Verification code expired
                  </div>
                )}
              </div>

              {/* VERIFY */}

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6 || timer <= 0}
                className="btn w-100 rounded-3 py-3 fw-semibold"
                style={{
                  background: "linear-gradient(135deg,#6f42c1,#0d6efd)",

                  border: "none",

                  color: "#fff",

                  opacity:
                    loading || otp.join("").length !== 6 || timer <= 0
                      ? 0.55
                      : 1,
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating Account...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </form>

            {/* RESEND */}

            <div className="text-center mt-4">
              <span
                style={{
                  color: darkMode ? "#94a3b8" : "#6b7280",

                  fontSize: "14px",
                }}
              >
                Didn't receive the code?{" "}
              </span>

              <button
                type="button"
                onClick={resendOTP}
                disabled={timer > 0 || loading}
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                style={{
                  color:
                    timer > 0 ? (darkMode ? "#64748b" : "#9ca3af") : "#0d6efd",

                  fontSize: "14px",
                }}
              >
                {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend Code"}
              </button>
            </div>

            {/* CHANGE EMAIL */}

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={changeEmail}
                disabled={loading}
                className="btn btn-link p-0 text-decoration-none"
                style={{
                  color: darkMode ? "#94a3b8" : "#6b7280",

                  fontSize: "13px",
                }}
              >
                ← Back to Registration
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
