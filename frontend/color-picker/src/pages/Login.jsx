import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  // =========================================
  // AUTH
  // =========================================

  const { login: authLogin } = useAuth();

  const navigate = useNavigate();

  // =========================================
  // STATES
  // =========================================

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  // =========================================
  // OTP TIMER
  // =========================================

  useEffect(() => {
    if (!otpSent || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  // =========================================
  // SEND OTP
  // =========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login/send-otp",
        {
          email,
        }
      );

      console.log("SEND OTP RESPONSE:", response.data);

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Failed to send verification code"
        );

        return;
      }

      setOtpSent(true);

      // 1 minute 30 seconds
      setTimeLeft(90);

      setOtp("");

      toast.success(
        "Verification code sent to your email 📧"
      );
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // VERIFY OTP
  // =========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("Verification code has expired");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login/verify-otp",
        {
          email,
          otp,
        }
      );

      console.log(
        "VERIFY OTP RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Invalid verification code"
        );

        return;
      }

      // =========================================
      // SAVE USER + TOKEN
      // =========================================

      const loginSuccess = authLogin(
        response.data.user,
        response.data.token
      );

      if (!loginSuccess) {
        toast.error("Login information could not be saved");
        return;
      }

      toast.success("Login Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid or expired verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RESEND OTP
  // =========================================

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login/send-otp",
        {
          email,
        }
      );

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Failed to resend code"
        );

        return;
      }

      setOtp("");

      setTimeLeft(90);

      setOtpSent(true);

      toast.success("New verification code sent 📧");
    } catch (error) {
      console.error("RESEND OTP ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to resend verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      setLoading(true);

      console.log(
        "GOOGLE RESPONSE:",
        credentialResponse
      );

      const credential =
        credentialResponse?.credential;

      if (!credential) {
        toast.error(
          "Google credential পাওয়া যায়নি"
        );

        return;
      }

      const { data } = await api.post(
        "/auth/google",
        {
          credential,
        }
      );

      console.log(
        "GOOGLE BACKEND RESPONSE:",
        data
      );

      if (!data.success) {
        toast.error(
          data.message ||
            "Google login failed"
        );

        return;
      }

      if (!data.token) {
        toast.error(
          "Google token could not be received"
        );

        return;
      }

      if (!data.user) {
        toast.error(
          "Google user information missing"
        );

        return;
      }

      // =========================================
      // SAVE GOOGLE USER + TOKEN
      // =========================================

      const loginSuccess = authLogin(
        data.user,
        data.token
      );

      if (!loginSuccess) {
        toast.error(
          "Token could not be saved"
        );

        return;
      }

      toast.success(
        "Google Login Successful 🎉"
      );

      navigate("/");
    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      console.error(
        "GOOGLE BACKEND ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Google login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // TIMER FORMAT
  // =========================================

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = timeLeft % 60;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow">
            <div className="card-body p-4">

              {/* ================================= */}
              {/* TITLE */}
              {/* ================================= */}

              <h2 className="text-center mb-4">
                Login
              </h2>

              {/* ================================= */}
              {/* EMAIL */}
              {/* ================================= */}

              {!otpSent ? (
                <form onSubmit={handleSendOTP}>

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Sending..."
                      : "Send Verification Code"}
                  </button>

                </form>
              ) : (
                <>
                  {/* ================================= */}
                  {/* OTP */}
                  {/* ================================= */}

                  <div className="text-center">

                    <p className="text-muted mb-3">
                      Verification code sent to
                    </p>

                    <strong>
                      {email}
                    </strong>

                  </div>

                  <form
                    onSubmit={handleVerifyOTP}
                    className="mt-4"
                  >

                    <label className="form-label">
                      Verification Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      className="form-control text-center fs-4 mb-3"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, "")
                        )
                      }
                      required
                    />

                    {/* TIMER */}

                    <div className="text-center mb-3">

                      {timeLeft > 0 ? (
                        <p className="text-muted mb-0">
                          Code expires in{" "}
                          <strong>
                            {String(minutes).padStart(
                              2,
                              "0"
                            )}
                            :
                            {String(seconds).padStart(
                              2,
                              "0"
                            )}
                          </strong>
                        </p>
                      ) : (
                        <p className="text-danger mb-0">
                          Verification code expired
                        </p>
                      )}

                    </div>

                    {/* VERIFY */}

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={
                        loading ||
                        timeLeft <= 0
                      }
                    >
                      {loading
                        ? "Verifying..."
                        : "Verify & Login"}
                    </button>

                  </form>

                  {/* RESEND */}

                  <div className="text-center mt-3">

                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={handleResendOTP}
                      disabled={
                        loading ||
                        timeLeft > 0
                      }
                    >
                      Resend Code
                    </button>

                  </div>

                  {/* CHANGE EMAIL */}

                  <div className="text-center">

                    <button
                      type="button"
                      className="btn btn-link text-secondary"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setTimeLeft(0);
                      }}
                    >
                      Change Email
                    </button>

                  </div>
                </>
              )}

              {/* ================================= */}
              {/* REGISTER */}
              {/* ================================= */}

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <Link to="/register">
                  Register
                </Link>
              </p>

              {/* ================================= */}
              {/* DIVIDER */}
              {/* ================================= */}

              <div className="text-center my-4">
                <span className="text-muted">
                  ───────── OR ─────────
                </span>
              </div>

              {/* ================================= */}
              {/* GOOGLE LOGIN */}
              {/* ================================= */}

              <div className="d-flex justify-content-center">

                <GoogleLogin
                  onSuccess={
                    handleGoogleSuccess
                  }
                  onError={() => {
                    console.error(
                      "Google Login Failed"
                    );

                    toast.error(
                      "Google login failed"
                    );
                  }}
                />

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;