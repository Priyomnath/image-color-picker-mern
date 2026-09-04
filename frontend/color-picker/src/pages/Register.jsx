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
  // REGISTER
  // =========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) return;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // NAME VALIDATION
    // =========================================

    if (!normalizedName) {
      toast.error("Please enter your full name");
      return;
    }

    if (normalizedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    // =========================================
    // EMAIL VALIDATION
    // =========================================

    if (!normalizedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // =========================================
    // PASSWORD VALIDATION
    // =========================================

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
          response.data.message ||
            "Verification code sent to your email",
        );

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(
          response.data?.message || "Registration failed",
        );
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.error(
        "REGISTER BACKEND ERROR:",
        error.response?.data,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to start registration",
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

    if (loading || googleLoading) return;

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

      const response = await api.post(
        "/auth/register/verify-otp",
        {
          email: email.trim().toLowerCase(),
          otp: finalOtp,
        },
      );

      if (response.data?.success) {
        const userData = response.data.user;
        const token = response.data.token;

        // =====================================
        // AUTO LOGIN
        // =====================================

        const loginSuccess = login(userData, token);

        if (!loginSuccess) {
          toast.error(
            "Account created, but automatic login failed.",
          );
          return;
        }

        toast.success(
          "Account created successfully! 🎉",
        );

        navigate("/");
      } else {
        toast.error(
          response.data?.message ||
            "Verification failed",
        );
      }
    } catch (error) {
      console.error(
        "VERIFY REGISTER OTP ERROR:",
        error,
      );

      const message =
        error.response?.data?.message ||
        "Verification failed";

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
    if (timer > 0 || loading || googleLoading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register/resend-otp",
        {
          email: email.trim().toLowerCase(),
        },
      );

      if (response.data?.success) {
        setOtp(["", "", "", "", "", ""]);

        setTimer(90);

        toast.success(
          response.data.message ||
            "New verification code sent",
        );

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to resend code",
        );
      }
    } catch (error) {
      console.error(
        "RESEND REGISTER OTP ERROR:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to resend verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CHANGE EMAIL
  // =========================================

  const changeEmail = () => {
    if (loading || googleLoading) return;

    setStep("register");

    setOtp(["", "", "", "", "", ""]);

    setTimer(0);
  };

  // =========================================
  // GOOGLE REGISTER
  // =========================================

  const handleGoogleRegister = async (
    credentialResponse,
  ) => {
    if (loading || googleLoading) return;

    try {
      setGoogleLoading(true);

      // =====================================
      // CHECK GOOGLE CREDENTIAL
      // =====================================

      if (!credentialResponse?.credential) {
        toast.error(
          "Google authorization failed",
        );
        return;
      }

      // =====================================
      // SEND GOOGLE ID TOKEN TO BACKEND
      // =====================================

      const response = await api.post(
        "/auth/google",
        {
          credential:
            credentialResponse.credential,
        },
      );

      console.log(
        "GOOGLE REGISTER RESPONSE:",
        response.data,
      );

      // =====================================
      // RESPONSE CHECK
      // =====================================

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Google registration failed",
        );
        return;
      }

      const userData = response.data.user;
      const token = response.data.token;

      if (!userData || !token) {
        toast.error(
          "Login information is incomplete",
        );
        return;
      }

      // =====================================
      // SAVE LOGIN SESSION
      // =====================================

      const loginSuccess = login(
        userData,
        token,
      );

      if (!loginSuccess) {
        toast.error(
          "Unable to save login session",
        );
        return;
      }

      // =====================================
      // SUCCESS
      // =====================================

      toast.success(
        "Google registration successful! 🎉",
      );

      navigate("/");
    } catch (error) {
      console.error(
        "GOOGLE REGISTER ERROR:",
        error,
      );

      console.error(
        "GOOGLE BACKEND ERROR:",
        error.response?.data,
      );

      console.error(
        "GOOGLE STATUS:",
        error.response?.status,
      );

      toast.error(
        error.response?.data?.message ||
          "Google registration failed",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================================
  // GOOGLE ERROR
  // =========================================

  const handleGoogleRegisterError = () => {
    setGoogleLoading(false);

    toast.error(
      "Google registration failed. Please try again.",
    );
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
      ? "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)"
      : "radial-gradient(circle at top, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)",
  };

  const cardStyle = {
    width: "100%",

    maxWidth: "470px",

    padding: "38px",

    borderRadius: "28px",

    background: darkMode
      ? "rgba(15, 23, 42, 0.96)"
      : "rgba(255, 255, 255, 0.97)",

    border: darkMode
      ? "1px solid rgba(148,163,184,0.18)"
      : "1px solid rgba(15,23,42,0.08)",

    boxShadow: darkMode
      ? "0 30px 80px rgba(0,0,0,0.45)"
      : "0 30px 80px rgba(15,23,42,0.12)",

    backdropFilter: "blur(20px)",
  };

  const inputStyle = {
    width: "100%",

    height: "54px",

    padding: "0 17px",

    borderRadius: "14px",

    border: darkMode
      ? "1px solid #475569"
      : "1px solid #d1d5db",

    background: darkMode ? "#111827" : "#fff",

    color: darkMode ? "#fff" : "#111827",

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

              background:
                "linear-gradient(135deg,#6f42c1,#0d6efd)",

              boxShadow:
                "0 10px 30px rgba(13,110,253,.25)",
            }}
          >
            🎨
          </div>

          <h2
            className="fw-bold mb-2"
            style={{
              color: darkMode
                ? "#fff"
                : "#111827",
            }}
          >
            {step === "register"
              ? "Create Your Account"
              : "Verify Your Email"}
          </h2>

          <p
            className="mb-0"
            style={{
              color: darkMode
                ? "#94a3b8"
                : "#6b7280",

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
                    color: darkMode
                      ? "#e5e7eb"
                      : "#374151",

                    fontSize: "14px",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={
                    loading || googleLoading
                  }
                  style={inputStyle}
                />
              </div>

              {/* EMAIL */}

              <div className="mb-3">
                <label
                  className="fw-semibold mb-2 d-block"
                  style={{
                    color: darkMode
                      ? "#e5e7eb"
                      : "#374151",

                    fontSize: "14px",
                  }}
                >
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={
                    loading || googleLoading
                  }
                  style={inputStyle}
                />
              </div>

              {/* PASSWORD */}

              <div className="mb-4">
                <label
                  className="fw-semibold mb-2 d-block"
                  style={{
                    color: darkMode
                      ? "#e5e7eb"
                      : "#374151",

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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={
                      loading ||
                      googleLoading
                    }
                    style={{
                      ...inputStyle,
                      paddingRight: "70px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword,
                      )
                    }
                    disabled={
                      loading ||
                      googleLoading
                    }
                    style={{
                      position: "absolute",

                      right: "14px",

                      top: "50%",

                      transform:
                        "translateY(-50%)",

                      border: "none",

                      background:
                        "transparent",

                      color: darkMode
                        ? "#94a3b8"
                        : "#6b7280",

                      fontSize: "13px",

                      fontWeight: "600",

                      cursor: "pointer",
                    }}
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                <small
                  style={{
                    color: darkMode
                      ? "#94a3b8"
                      : "#6b7280",

                    fontSize: "12px",
                  }}
                >
                  Use at least 8 characters
                </small>
              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                disabled={
                  loading || googleLoading
                }
                className="btn w-100 rounded-3 py-3 fw-semibold"
                style={{
                  background:
                    "linear-gradient(135deg,#6f42c1,#0d6efd)",

                  border: "none",

                  color: "#fff",

                  boxShadow:
                    "0 8px 20px rgba(13,110,253,.22)",

                  opacity:
                    loading ? 0.7 : 1,
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
            {/* OR DIVIDER */}
            {/* ================================= */}

            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "14px",

                margin: "26px 0",
              }}
            >
              <div
                style={{
                  flex: 1,

                  height: "1px",

                  background: darkMode
                    ? "#1e293b"
                    : "#e5e7eb",
                }}
              />

              <span
                style={{
                  fontSize: "12px",

                  fontWeight: "700",

                  color: darkMode
                    ? "#64748b"
                    : "#9ca3af",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,

                  height: "1px",

                  background: darkMode
                    ? "#1e293b"
                    : "#e5e7eb",
                }}
              />
            </div>

            {/* ================================= */}
            {/* CONTINUE WITH GOOGLE */}
            {/* ================================= */}

            <div
              style={{
                position: "relative",

                minHeight: "54px",

                width: "100%",
              }}
            >
              {/* REAL GOOGLE BUTTON */}

              <div
                style={{
                  position: "absolute",

                  inset: 0,

                  zIndex: 2,

                  opacity:
                    loading ||
                    googleLoading
                      ? 0
                      : 0,

                  overflow: "hidden",

                  borderRadius: "14px",

                  pointerEvents:
                    loading ||
                    googleLoading
                      ? "none"
                      : "auto",
                }}
              >
                <GoogleLogin
                  onSuccess={
                    handleGoogleRegister
                  }
                  onError={
                    handleGoogleRegisterError
                  }
                  theme={
                    darkMode
                      ? "filled_black"
                      : "outline"
                  }
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width="100%"
                  useOneTap={false}
                />
              </div>

              {/* CUSTOM GOOGLE UI */}

              <button
                type="button"
                disabled={
                  googleLoading ||
                  loading
                }
                style={{
                  width: "100%",

                  height: "54px",

                  borderRadius: "14px",

                  border: darkMode
                    ? "1px solid #475569"
                    : "1px solid #d1d5db",

                  background: darkMode
                    ? "#111827"
                    : "#ffffff",

                  color: darkMode
                    ? "#ffffff"
                    : "#1f2937",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  gap: "12px",

                  fontSize: "15px",

                  fontWeight: "600",

                  cursor:
                    googleLoading ||
                    loading
                      ? "not-allowed"
                      : "pointer",

                  opacity:
                    googleLoading ||
                    loading
                      ? 0.65
                      : 1,

                  transition:
                    "all 0.2s ease",

                  boxShadow: darkMode
                    ? "0 6px 18px rgba(0,0,0,0.20)"
                    : "0 6px 18px rgba(0,0,0,0.07)",
                }}
              >
                {googleLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />

                    <span>
                      Signing up with Google...
                    </span>
                  </>
                ) : (
                  <>
                    {/* GOOGLE LOGO */}

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.6z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.29A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.22l3.25-2.53z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 7.99 9.46 6.27 12 6.27z"
                      />
                    </svg>

                    <span>
                      Continue with Google
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* ================================= */}
            {/* LOGIN */}
            {/* ================================= */}

            <p
              className="text-center mt-4 mb-0"
              style={{
                color: darkMode
                  ? "#94a3b8"
                  : "#6b7280",

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

                background: darkMode
                  ? "rgba(59,130,246,.10)"
                  : "#eff6ff",

                color: darkMode
                  ? "#93c5fd"
                  : "#2563eb",

                fontSize: "14px",
              }}
            >
              📧 <strong>{email}</strong>
            </div>

            {/* OTP FORM */}

            <form onSubmit={verifyRegisterOTP}>
              <div
                className="d-flex justify-content-center gap-2 mb-4"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] =
                        element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(
                        index,
                        e,
                      )
                    }
                    disabled={
                      loading ||
                      googleLoading ||
                      timer <= 0
                    }
                    aria-label={`OTP digit ${
                      index + 1
                    }`}
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

                      background: darkMode
                        ? "#111827"
                        : "#fff",

                      color: darkMode
                        ? "#fff"
                        : "#111827",

                      outline: "none",
                    }}
                  />
                ))}
              </div>

              {/* TIMER */}

              <div className="text-center mb-4">
                {timer > 0 ? (
                  <>
                    <div
                      style={{
                        color: darkMode
                          ? "#cbd5e1"
                          : "#6b7280",

                        fontSize: "13px",
                      }}
                    >
                      Code expires in
                    </div>

                    <div
                      className="fw-bold mt-1"
                      style={{
                        fontSize: "20px",

                        color:
                          timer <= 20
                            ? "#dc3545"
                            : "#0d6efd",
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
                disabled={
                  loading ||
                  googleLoading ||
                  otp.join("").length !== 6 ||
                  timer <= 0
                }
                className="btn w-100 rounded-3 py-3 fw-semibold"
                style={{
                  background:
                    "linear-gradient(135deg,#6f42c1,#0d6efd)",

                  border: "none",

                  color: "#fff",

                  opacity:
                    loading ||
                    otp.join("").length !== 6 ||
                    timer <= 0
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
                  color: darkMode
                    ? "#94a3b8"
                    : "#6b7280",

                  fontSize: "14px",
                }}
              >
                Didn't receive the code?{" "}
              </span>

              <button
                type="button"
                onClick={resendOTP}
                disabled={
                  timer > 0 ||
                  loading ||
                  googleLoading
                }
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                style={{
                  color:
                    timer > 0
                      ? darkMode
                        ? "#64748b"
                        : "#9ca3af"
                      : "#0d6efd",

                  fontSize: "14px",
                }}
              >
                {timer > 0
                  ? `Resend in ${formatTime(
                      timer,
                    )}`
                  : "Resend Code"}
              </button>
            </div>

            {/* CHANGE EMAIL */}

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={changeEmail}
                disabled={
                  loading || googleLoading
                }
                className="btn btn-link p-0 text-decoration-none"
                style={{
                  color: darkMode
                    ? "#94a3b8"
                    : "#6b7280",

                  fontSize: "14px",
                }}
              >
                ← Change Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;