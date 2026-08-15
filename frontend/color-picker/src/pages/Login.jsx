import { Link, useNavigate } from "react-router-dom";
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

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // =======================================
      // BACKEND LOGIN
      // =======================================

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data);

      // =======================================
      // CHECK BACKEND RESPONSE
      // =======================================

      if (!data.success) {
        toast.error(data.message || "Login failed");

        return;
      }

      if (!data.token) {
        console.error("TOKEN MISSING FROM BACKEND:", data);

        toast.error("Token could not be received from server");

        return;
      }

      if (!data.user) {
        console.error("USER DATA MISSING:", data);

        toast.error("User data missing");

        return;
      }

      // =======================================
      // SAVE USER + TOKEN
      // =======================================

      const loginSuccess = authLogin(
        data.user,
        data.token,
      );

      if (!loginSuccess) {
        toast.error("Token could not be saved");

        return;
      }

      // =======================================
      // VERIFY LOCAL STORAGE
      // =======================================

      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      console.log(
        "TOKEN SAVED:",
        savedToken,
      );

      console.log(
        "USER SAVED:",
        savedUser,
      );

      // =======================================
      // FINAL CHECK
      // =======================================

      if (
        !savedToken ||
        savedToken === "undefined" ||
        savedToken === "null"
      ) {
        toast.error("Token could not be saved");

        return;
      }

      // =======================================
      // SUCCESS
      // =======================================

      toast.success("Login Successful");

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.error(
        "LOGIN ERROR RESPONSE:",
        error.response?.data,
      );

      toast.error(
        error.response?.data?.message ||
          "Login failed",
      );
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

              <h2 className="text-center mb-4">
                Login
              </h2>

              <form onSubmit={handleLogin}>

                {/* EMAIL */}

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                {/* PASSWORD */}

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

                {/* REGISTER */}

                <p className="text-center mt-3">
                  Don't have an account?{" "}
                  <Link to="/register">
                    Register
                  </Link>
                </p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;