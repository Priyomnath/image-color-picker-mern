// //06/08/2026 {time:  PM}
// import { Link } from "react-router-dom";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";

// function Register() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const register = async (e) => {
//     e.preventDefault();

//     try {
//       await api.post("/auth/register", {
//         name,
//         email,
//         password,
//       });

//       alert("Registration Successful");

//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration Failed");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5">
//           <div className="card shadow">
//             <div className="card-body">
//               <h2 className="text-center mb-4">Register</h2>

//               <form onSubmit={register}>
//                 <input
//                   className="form-control mb-3"
//                   placeholder="Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />

//                 <input
//                   className="form-control mb-3"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <input
//                   type="password"
//                   className="form-control mb-3"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <button className="btn btn-success w-100">Register</button>

//                 {/* //06/08/2026 {time:  PM} */}
//                 <p className="text-center mt-3">
//                   Already have an account? <Link to="/login">Login</Link>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;





























import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // ==========================
      // Register User
      // ==========================
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // ==========================
      // Auto Login
      // ==========================
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // Save user + token in AuthContext
      authLogin(data.user, data.token);

      toast.success("Registration Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow-lg border-0 rounded-4">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Create Account
              </h2>

              <form onSubmit={handleRegister}>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  className="form-control mb-4"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Create Account
                </button>

              </form>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  Login
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;