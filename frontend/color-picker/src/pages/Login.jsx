import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const { login: authLogin } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("=================================");
      console.log("LOGIN RESPONSE:", data);
      console.log("TOKEN FROM BACKEND:", data?.token);
      console.log("=================================");

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!data?.token) {
        console.error("❌ LOGIN SUCCESS BUT TOKEN NOT FOUND");

        toast.error("Login failed: Token not received from server");

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem("token", data.token);

      // Verify immediately
      const savedToken = localStorage.getItem("token");

      console.log("TOKEN SAVED:", savedToken);

      if (!savedToken) {
        toast.error("Token could not be saved");

        return;
      }

      // ==========================================
      // UPDATE AUTH CONTEXT
      // ==========================================

      authLogin(data.token);

      toast.success("Login Successful");

      // ==========================================
      // GO HOME
      // ==========================================

      navigate("/");
    } catch (error) {
      console.error("=================================");
      console.error("LOGIN ERROR:", error);
      console.error("LOGIN ERROR RESPONSE:", error.response?.data);
      console.error("=================================");

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

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
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

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