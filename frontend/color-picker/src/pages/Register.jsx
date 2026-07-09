import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">

              <h2 className="text-center mb-4">Register</h2>

              <form onSubmit={register}>

                <input
                  className="form-control mb-3"
                  placeholder="Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />

                <button className="btn btn-success w-100">
                  Register
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;