import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //17/08/2026 {time:  PM}
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     setLoading(true);

  //     const credential = credentialResponse?.credential;

  //     if (!credential) {
  //       toast.error("Google credential পাওয়া যায়নি");
  //       return;
  //     }

  //     const { data } = await api.post("/auth/google", {
  //       credential,
  //     });

  //     console.log("GOOGLE LOGIN RESPONSE:", data);

  //     if (!data.success) {
  //       toast.error(data.message || "Google login failed");
  //       return;
  //     }

  //     if (!data.token) {
  //       toast.error("Token could not be received");
  //       return;
  //     }

  //     if (!data.user) {
  //       toast.error("User data missing");
  //       return;
  //     }

  //     // Save user + JWT
  //     const loginSuccess = authLogin(data.user, data.token);

  //     if (!loginSuccess) {
  //       toast.error("Token could not be saved");
  //       return;
  //     }

  //     // Verify localStorage
  //     const savedToken = localStorage.getItem("token");
  //     const savedUser = localStorage.getItem("user");

  //     console.log("GOOGLE TOKEN SAVED:", savedToken);
  //     console.log("GOOGLE USER SAVED:", savedUser);

  //     if (!savedToken || savedToken === "undefined" || savedToken === "null") {
  //       toast.error("Token could not be saved");
  //       return;
  //     }

  //     toast.success("Google Login Successful 🎉");

  //     navigate("/");
  //   } catch (error) {
  //     console.error("GOOGLE LOGIN ERROR:", error);
  //     console.error("GOOGLE LOGIN RESPONSE:", error.response?.data);

  //     toast.error(error.response?.data?.message || "Google login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // =========================================
  // EMAIL + PASSWORD LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data);

      // =======================================
      // CHECK TOKEN
      // =======================================

      if (!data.token) {
        console.error("TOKEN MISSING:", data);

        toast.error("Token could not be received from server");

        return;
      }

      // =======================================
      // CHECK USER
      // =======================================

      if (!data.user) {
        console.error("USER DATA MISSING:", data);

        toast.error("User data missing");

        return;
      }

      // =======================================
      // SAVE USER + TOKEN
      // =======================================

      authLogin(data.user, data.token);

      // =======================================
      // VERIFY LOCAL STORAGE
      // =======================================

      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      console.log("TOKEN SAVED:", savedToken);
      console.log("USER SAVED:", savedUser);

      if (!savedToken || savedToken === "undefined" || savedToken === "null") {
        toast.error("Token could not be saved");

        return;
      }

      // =======================================
      // SUCCESS
      // =======================================

      toast.success("Login Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error("LOGIN ERROR RESPONSE:", error.response?.data);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     setLoading(true);

  //     console.log("GOOGLE RESPONSE:", credentialResponse);

  //     if (!credentialResponse?.credential) {
  //       toast.error("Google credential not received");

  //       return;
  //     }

  //     // =======================================
  //     // SEND GOOGLE CREDENTIAL TO BACKEND
  //     // =======================================

  //     const { data } = await api.post("/auth/google", {
  //       credential: credentialResponse.credential,
  //     });

  //     console.log("GOOGLE LOGIN RESPONSE:", data);

  //     // =======================================
  //     // CHECK TOKEN
  //     // =======================================

  //     if (!data.token) {
  //       console.error("GOOGLE TOKEN MISSING:", data);

  //       toast.error("Token could not be received from server");

  //       return;
  //     }

  //     // =======================================
  //     // CHECK USER
  //     // =======================================

  //     if (!data.user) {
  //       console.error("GOOGLE USER MISSING:", data);

  //       toast.error("User data missing");

  //       return;
  //     }

  //     // =======================================
  //     // SAVE USER + TOKEN
  //     // =======================================

  //     authLogin(data.user, data.token);

  //     // =======================================
  //     // VERIFY
  //     // =======================================

  //     const savedToken = localStorage.getItem("token");
  //     const savedUser = localStorage.getItem("user");

  //     console.log("GOOGLE TOKEN SAVED:", savedToken);
  //     console.log("GOOGLE USER SAVED:", savedUser);

  //     if (!savedToken || savedToken === "undefined" || savedToken === "null") {
  //       toast.error("Google token could not be saved");

  //       return;
  //     }

  //     // =======================================
  //     // SUCCESS
  //     // =======================================

  //     toast.success("Google Login Successful 🎉");

  //     navigate("/");
  //   } catch (error) {
  //     console.error("GOOGLE LOGIN ERROR:", error);

  //     console.error("GOOGLE ERROR RESPONSE:", error.response?.data);

  //     toast.error(error.response?.data?.message || "Google login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      console.log("GOOGLE RESPONSE:", credentialResponse);

      const credential = credentialResponse?.credential;

      if (!credential) {
        toast.error("Google credential পাওয়া যায়নি");
        return;
      }

      const { data } = await api.post("/auth/google", {
        credential,
      });

      console.log("GOOGLE BACKEND RESPONSE:", data);

      if (!data.success) {
        toast.error(data.message || "Google login failed");
        return;
      }

      const loginSuccess = authLogin(data.user, data.token);

      if (!loginSuccess) {
        toast.error("Token could not be saved");
        return;
      }

      toast.success("Google Login Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);
      console.error("GOOGLE BACKEND ERROR:", error.response?.data);

      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              {/* ================================= */}
              {/* EMAIL + PASSWORD */}
              {/* ================================= */}

              <form onSubmit={handleLogin}>
                {/* EMAIL */}

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* PASSWORD */}

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* REGISTER */}

                <p className="text-center mt-3">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </form>

              {/* ================================= */}
              {/* DIVIDER */}
              {/* ================================= */}

              <div className="text-center my-4">
                <span className="text-muted">──────── OR ────────</span>
              </div>

              {/* ================================= */}
              {/* GOOGLE LOGIN */}
              {/* ================================= */}

              <div className="d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    console.error("Google Login Failed");

                    toast.error("Google login failed");
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
