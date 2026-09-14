// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { GoogleLogin } from "@react-oauth/google";
// import { toast } from "react-toastify";

// import api from "../api/api";

// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";

// function Login() {
//   const navigate = useNavigate();

//   const { login } = useAuth();
//   const { darkMode } = useTheme();

//   // =========================================
//   // STATE
//   // =========================================

//   const [email, setEmail] = useState("");

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const [step, setStep] = useState("email");

//   const [timer, setTimer] = useState(0);

//   const [loading, setLoading] = useState(false);

//   const [googleLoading, setGoogleLoading] = useState(false);

//   // =========================================
//   // OTP REFS
//   // =========================================

//   const otpRefs = useRef([]);

//   // =========================================
//   // TIMER
//   // =========================================

//   useEffect(() => {
//     if (timer <= 0) return;

//     const interval = setInterval(() => {
//       setTimer((previous) => {
//         if (previous <= 1) {
//           clearInterval(interval);
//           return 0;
//         }

//         return previous - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   // =========================================
//   // FORMAT TIME
//   // =========================================

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);

//     const remainingSeconds = seconds % 60;

//     return `${String(minutes).padStart(2, "0")}:${String(
//       remainingSeconds,
//     ).padStart(2, "0")}`;
//   };

//   // =========================================
//   // SEND OTP
//   // =========================================

//   const sendOTP = async (e) => {
//     e?.preventDefault();

//     const normalizedEmail = email.trim().toLowerCase();

//     if (!normalizedEmail) {
//       toast.error("Please enter your email address");
//       return;
//     }

//     if (!normalizedEmail.includes("@")) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/login/send-otp", {
//         email: normalizedEmail,
//       });

//       if (response.data?.success) {
//         setEmail(normalizedEmail);

//         setOtp(["", "", "", "", "", ""]);

//         setStep("otp");

//         setTimer(90);

//         toast.success(response.data.message || "Verification code sent");

//         setTimeout(() => {
//           otpRefs.current[0]?.focus();
//         }, 100);
//       } else {
//         toast.error(
//           response.data?.message || "Failed to send verification code",
//         );
//       }
//     } catch (error) {
//       console.error("SEND OTP ERROR:", error);

//       toast.error(
//         error.response?.data?.message || "Failed to send verification code",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // OTP CHANGE
//   // =========================================

//   const handleOtpChange = (index, value) => {
//     const digit = value.replace(/\D/g, "").slice(-1);

//     const newOtp = [...otp];

//     newOtp[index] = digit;

//     setOtp(newOtp);

//     if (digit && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   // =========================================
//   // OTP KEYBOARD
//   // =========================================

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace") {
//       if (otp[index]) {
//         const newOtp = [...otp];

//         newOtp[index] = "";

//         setOtp(newOtp);

//         return;
//       }

//       if (index > 0) {
//         otpRefs.current[index - 1]?.focus();
//       }
//     }

//     if (e.key === "ArrowLeft" && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }

//     if (e.key === "ArrowRight" && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   // =========================================
//   // OTP PASTE
//   // =========================================

//   const handleOtpPaste = (e) => {
//     e.preventDefault();

//     const pasted = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 6);

//     if (!pasted) return;

//     const newOtp = ["", "", "", "", "", ""];

//     pasted.split("").forEach((digit, index) => {
//       newOtp[index] = digit;
//     });

//     setOtp(newOtp);

//     const focusIndex = Math.min(pasted.length, 5);

//     setTimeout(() => {
//       otpRefs.current[focusIndex]?.focus();
//     }, 0);
//   };

//   // =========================================
//   // VERIFY OTP
//   // =========================================

//   const verifyOTP = async (e) => {
//     e?.preventDefault();

//     const finalOtp = otp.join("");

//     if (finalOtp.length !== 6) {
//       toast.error("Please enter the complete 6-digit code");
//       return;
//     }

//     if (timer <= 0) {
//       toast.error("Verification code has expired");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/login/verify-otp", {
//         email,
//         otp: finalOtp,
//       });

//       if (response.data?.success) {
//         const userData = response.data.user;

//         const token = response.data.token;

//         const loginSuccess = login(userData, token);

//         if (!loginSuccess) {
//           toast.error("Login failed. Please try again.");
//           return;
//         }

//         toast.success("Welcome back! 🎉");

//         navigate("/");
//       } else {
//         toast.error(response.data?.message || "Invalid verification code");
//       }
//     } catch (error) {
//       console.error("VERIFY OTP ERROR:", error);

//       const message = error.response?.data?.message || "Verification failed";

//       toast.error(message);

//       if (
//         error.response?.status === 400 &&
//         message.toLowerCase().includes("expired")
//       ) {
//         setTimer(0);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // RESEND OTP
//   // =========================================

//   const resendOTP = async () => {
//     if (timer > 0 || loading) return;

//     await sendOTP();
//   };

//   // =========================================
//   // CHANGE EMAIL
//   // =========================================

//   const changeEmail = () => {
//     setStep("email");

//     setOtp(["", "", "", "", "", ""]);

//     setTimer(0);

//     setTimeout(() => {
//       document.getElementById("login-email")?.focus();
//     }, 100);
//   };

//   // =========================================
//   // GOOGLE LOGIN
//   // =========================================

//   const handleGoogleLogin = async (credentialResponse) => {
//     if (loading || googleLoading) return;

//     try {
//       setGoogleLoading(true);

//       if (!credentialResponse?.credential) {
//         toast.error("Google authorization failed");
//         return;
//       }

//       const response = await api.post("/auth/google", {
//         credential: credentialResponse.credential,
//       });

//       console.log("GOOGLE LOGIN RESPONSE:", response.data);

//       if (!response.data?.success) {
//         toast.error(response.data?.message || "Google login failed");
//         return;
//       }

//       const userData = response.data.user;
//       const token = response.data.token;

//       if (!userData || !token) {
//         toast.error("Login information is incomplete");
//         return;
//       }

//       const loginSuccess = login(userData, token);

//       if (!loginSuccess) {
//         toast.error("Unable to save login session");
//         return;
//       }

//       toast.success("Google login successful! 🎉");

//       navigate("/");
//     } catch (error) {
//       console.error("GOOGLE LOGIN ERROR:", error);

//       console.error("GOOGLE BACKEND ERROR:", error.response?.data);

//       console.error("GOOGLE STATUS:", error.response?.status);

//       toast.error(error.response?.data?.message || "Google login failed");
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // =========================================
//   // GOOGLE ERROR
//   // =========================================

//   const handleGoogleError = () => {
//     toast.error("Google login failed. Please try again.");
//   };

//   // =========================================
//   // STYLES
//   // =========================================

//   const pageStyle = {
//     minHeight: "calc(100vh - 70px)",

//     display: "flex",

//     alignItems: "center",

//     justifyContent: "center",

//     padding: "40px 20px",

//     background: darkMode
//       ? "radial-gradient(circle at top left, #172554 0%, #0f172a 40%, #020617 100%)"
//       : "radial-gradient(circle at top left, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)",

//     position: "relative",

//     overflow: "hidden",
//   };

//   const cardStyle = {
//     width: "100%",

//     maxWidth: "470px",

//     padding: "38px",

//     borderRadius: "28px",

//     background: darkMode ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.94)",

//     border: darkMode
//       ? "1px solid rgba(148,163,184,0.18)"
//       : "1px solid rgba(226,232,240,0.9)",

//     boxShadow: darkMode
//       ? "0 30px 80px rgba(0,0,0,0.45)"
//       : "0 30px 80px rgba(15,23,42,0.12)",

//     backdropFilter: "blur(18px)",
//   };

//   const inputStyle = {
//     width: "100%",

//     height: "54px",

//     borderRadius: "15px",

//     border: darkMode ? "1px solid #334155" : "1px solid #dbe1ea",

//     background: darkMode ? "rgba(2,6,23,0.7)" : "#ffffff",

//     color: darkMode ? "#f8fafc" : "#111827",

//     padding: "0 16px",

//     fontSize: "15px",

//     outline: "none",

//     boxSizing: "border-box",
//   };

//   // =========================================
//   // RENDER
//   // =========================================

//   return (
//     <div style={pageStyle}>
//       {/* Decorative circles */}

//       <div
//         style={{
//           position: "absolute",

//           width: "280px",
//           height: "280px",

//           borderRadius: "50%",

//           background: "rgba(99,102,241,0.10)",

//           top: "-120px",
//           left: "-100px",

//           filter: "blur(10px)",
//         }}
//       />

//       <div
//         style={{
//           position: "absolute",

//           width: "320px",
//           height: "320px",

//           borderRadius: "50%",

//           background: "rgba(14,165,233,0.08)",

//           bottom: "-150px",
//           right: "-100px",

//           filter: "blur(10px)",
//         }}
//       />

//       <div style={cardStyle}>
//         {/* ========================================= */}
//         {/* HEADER */}
//         {/* ========================================= */}

//         <div className="text-center">
//           <div
//             style={{
//               width: "68px",
//               height: "68px",

//               margin: "0 auto 18px",

//               borderRadius: "20px",

//               display: "flex",

//               alignItems: "center",

//               justifyContent: "center",

//               fontSize: "32px",

//               background: "linear-gradient(135deg, #7c3aed, #2563eb)",

//               boxShadow: "0 15px 35px rgba(37,99,235,0.28)",
//             }}
//           >
//             🎨
//           </div>

//           <h2
//             className="fw-bold mb-2"
//             style={{
//               color: darkMode ? "#f8fafc" : "#111827",

//               fontSize: "28px",
//             }}
//           >
//             {step === "email" ? "Welcome back" : "Check your email"}
//           </h2>

//           <p
//             style={{
//               color: darkMode ? "#94a3b8" : "#6b7280",

//               fontSize: "14px",

//               marginBottom: "30px",
//             }}
//           >
//             {step === "email"
//               ? "Sign in to your Image Color Picker account"
//               : `We sent a 6-digit code to ${email}`}
//           </p>
//         </div>

//         {/* ========================================= */}
//         {/* EMAIL STEP */}
//         {/* ========================================= */}

//         {step === "email" && (
//           <>
//             <form onSubmit={sendOTP}>
//               <label
//                 style={{
//                   display: "block",

//                   marginBottom: "8px",

//                   fontSize: "13px",

//                   fontWeight: "700",

//                   color: darkMode ? "#cbd5e1" : "#374151",
//                 }}
//               >
//                 Email Address
//               </label>

//               <input
//                 id="login-email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 disabled={loading}
//                 style={inputStyle}
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn w-100"
//                 style={{
//                   height: "54px",

//                   marginTop: "18px",

//                   border: "none",

//                   borderRadius: "15px",

//                   background: "linear-gradient(135deg, #7c3aed, #2563eb)",

//                   color: "#fff",

//                   fontSize: "15px",

//                   fontWeight: "700",

//                   boxShadow: "0 12px 25px rgba(37,99,235,0.22)",

//                   opacity: loading ? 0.7 : 1,
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Sending code...
//                   </>
//                 ) : (
//                   "Log in"
//                 )}
//               </button>
//             </form>

//             {/* ========================================= */}
//             {/* DIVIDER */}
//             {/* ========================================= */}

//             <div
//               style={{
//                 display: "flex",

//                 alignItems: "center",

//                 gap: "14px",

//                 margin: "26px 0",
//               }}
//             >
//               <div
//                 style={{
//                   flex: 1,
//                   height: "1px",

//                   background: darkMode ? "#1e293b" : "#e5e7eb",
//                 }}
//               />

//               <span
//                 style={{
//                   fontSize: "12px",

//                   fontWeight: "700",

//                   color: darkMode ? "#64748b" : "#9ca3af",
//                 }}
//               >
//                 OR
//               </span>

//               <div
//                 style={{
//                   flex: 1,
//                   height: "1px",

//                   background: darkMode ? "#1e293b" : "#e5e7eb",
//                 }}
//               />
//             </div>

//             {/* ========================================= */}
// {/* GOOGLE */}
// {/* ========================================= */}

// <div
//   style={{
//     position: "relative",
//     minHeight: "54px",
//     width: "100%",
//   }}
// >
//   {/* REAL GOOGLE LOGIN */}
//   <div
//     style={{
//       position: "absolute",
//       inset: 0,
//       zIndex: 2,
//       opacity: 0,
//       overflow: "hidden",
//       borderRadius: "14px",
//       pointerEvents: loading || googleLoading ? "none" : "auto",
//     }}
//   >
//     <GoogleLogin
//       onSuccess={handleGoogleLogin}
//       onError={handleGoogleError}
//       theme={darkMode ? "filled_black" : "outline"}
//       size="large"
//       shape="pill"
//       text="continue_with"
//       width="100%"
//       useOneTap={false}
//     />
//   </div>

//   {/* CUSTOM GOOGLE BUTTON */}
//   <button
//     type="button"
//     disabled={loading || googleLoading}
//     style={{
//       width: "100%",
//       height: "54px",
//       borderRadius: "14px",

//       border: darkMode
//         ? "1px solid #475569"
//         : "1px solid #d1d5db",

//       background: darkMode
//         ? "#111827"
//         : "#ffffff",

//       color: darkMode
//         ? "#ffffff"
//         : "#1f2937",

//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "12px",

//       fontSize: "15px",
//       fontWeight: "600",

//       cursor:
//         loading || googleLoading
//           ? "not-allowed"
//           : "pointer",

//       opacity:
//         loading || googleLoading
//           ? 0.65
//           : 1,

//       transition: "all 0.2s ease",

//       boxShadow: darkMode
//         ? "0 6px 18px rgba(0,0,0,0.20)"
//         : "0 6px 18px rgba(0,0,0,0.07)",
//     }}
//   >
//     {googleLoading ? (
//       <>
//         <span
//           className="spinner-border spinner-border-sm"
//           role="status"
//           aria-hidden="true"
//         />

//         <span>Signing in with Google...</span>
//       </>
//     ) : (
//       <>
//         {/* GOOGLE LOGO */}
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//         >
//           <path
//             fill="#4285F4"
//             d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
//           />

//           <path
//             fill="#34A853"
//             d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.6z"
//           />

//           <path
//             fill="#FBBC05"
//             d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.29A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.22l3.25-2.53z"
//           />

//           <path
//             fill="#EA4335"
//             d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 7.99 9.46 6.27 12 6.27z"
//           />
//         </svg>

//         <span>Continue with Google</span>
//       </>
//     )}
//   </button>
// </div>

//             {/* ========================================= */}
//             {/* REGISTER */}
//             {/* ========================================= */}

//             <div
//               className="text-center"
//               style={{
//                 marginTop: "26px",

//                 paddingTop: "22px",

//                 borderTop: darkMode ? "1px solid #1e293b" : "1px solid #eef2f7",

//                 color: darkMode ? "#94a3b8" : "#6b7280",

//                 fontSize: "14px",
//               }}
//             >
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="fw-bold text-decoration-none"
//                 style={{
//                   color: "#2563eb",
//                 }}
//               >
//                 Create account
//               </Link>
//             </div>
//           </>
//         )}

//         {/* ========================================= */}
//         {/* OTP STEP */}
//         {/* ========================================= */}

//         {step === "otp" && (
//           <>
//             {/* EMAIL */}

//             <div
//               style={{
//                 padding: "14px 16px",

//                 marginBottom: "24px",

//                 borderRadius: "14px",

//                 background: darkMode ? "rgba(37,99,235,0.10)" : "#eff6ff",

//                 color: darkMode ? "#93c5fd" : "#2563eb",

//                 fontSize: "13px",

//                 textAlign: "center",
//               }}
//             >
//               📧 <strong>{email}</strong>
//             </div>

//             <form onSubmit={verifyOTP}>
//               {/* OTP */}

//               <div
//                 onPaste={handleOtpPaste}
//                 style={{
//                   display: "flex",

//                   justifyContent: "center",

//                   gap: "9px",

//                   marginBottom: "24px",
//                 }}
//               >
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={(element) => {
//                       otpRefs.current[index] = element;
//                     }}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                     onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                     disabled={loading || timer <= 0}
//                     aria-label={`OTP digit ${index + 1}`}
//                     style={{
//                       width: "48px",

//                       height: "58px",

//                       textAlign: "center",

//                       fontSize: "22px",

//                       fontWeight: "800",

//                       borderRadius: "14px",

//                       border: digit
//                         ? "2px solid #2563eb"
//                         : darkMode
//                           ? "1px solid #334155"
//                           : "1px solid #dbe1ea",

//                       background: darkMode ? "#020617" : "#ffffff",

//                       color: darkMode ? "#ffffff" : "#111827",

//                       outline: "none",
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* TIMER */}

//               <div
//                 className="text-center"
//                 style={{
//                   marginBottom: "22px",
//                 }}
//               >
//                 {timer > 0 ? (
//                   <>
//                     <div
//                       style={{
//                         color: darkMode ? "#94a3b8" : "#6b7280",

//                         fontSize: "12px",
//                       }}
//                     >
//                       Code expires in
//                     </div>

//                     <div
//                       style={{
//                         marginTop: "4px",

//                         fontSize: "20px",

//                         fontWeight: "800",

//                         color: timer <= 20 ? "#ef4444" : "#2563eb",
//                       }}
//                     >
//                       {formatTime(timer)}
//                     </div>
//                   </>
//                 ) : (
//                   <div
//                     style={{
//                       color: "#ef4444",

//                       fontSize: "13px",

//                       fontWeight: "700",
//                     }}
//                   >
//                     Verification code expired
//                   </div>
//                 )}
//               </div>

//               {/* VERIFY */}

//               <button
//                 type="submit"
//                 disabled={loading || otp.join("").length !== 6 || timer <= 0}
//                 className="btn w-100"
//                 style={{
//                   height: "54px",

//                   border: "none",

//                   borderRadius: "15px",

//                   background: "linear-gradient(135deg, #7c3aed, #2563eb)",

//                   color: "#fff",

//                   fontSize: "15px",

//                   fontWeight: "700",

//                   opacity:
//                     loading || otp.join("").length !== 6 || timer <= 0
//                       ? 0.55
//                       : 1,
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Verifying...
//                   </>
//                 ) : (
//                   "Verify & Sign In"
//                 )}
//               </button>
//             </form>

//             {/* RESEND */}

//             <div
//               className="text-center"
//               style={{
//                 marginTop: "22px",

//                 fontSize: "13px",

//                 color: darkMode ? "#94a3b8" : "#6b7280",
//               }}
//             >
//               Didn't receive the code?{" "}
//               <button
//                 type="button"
//                 onClick={resendOTP}
//                 disabled={timer > 0 || loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   padding: 0,

//                   fontWeight: "700",

//                   color: timer > 0 ? "#94a3b8" : "#2563eb",

//                   cursor: timer > 0 || loading ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend code"}
//               </button>
//             </div>

//             {/* CHANGE EMAIL */}

//             <div
//               className="text-center"
//               style={{
//                 marginTop: "14px",
//               }}
//             >
//               <button
//                 type="button"
//                 onClick={changeEmail}
//                 disabled={loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   color: darkMode ? "#94a3b8" : "#6b7280",

//                   fontSize: "13px",

//                   cursor: "pointer",
//                 }}
//               >
//                 ← Use another email
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { darkMode } = useTheme();

  // =========================================
  // STATE
  // =========================================

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [step, setStep] = useState("email");

  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const otpRefs = useRef([]);

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
  // TIMER FORMAT
  // =========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // =========================================
  // SEND OTP
  // =========================================

  const sendOTP = async (e) => {
    e?.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login/send-otp", {
        email: normalizedEmail,
      });

      if (response.data?.success) {
        setEmail(normalizedEmail);

        setOtp(["", "", "", "", "", ""]);

        setStep("otp");

        setTimer(90);

        toast.success(response.data.message || "Verification code sent");

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(
          response.data?.message || "Failed to send verification code",
        );
      }
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to send verification code",
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
  // VERIFY OTP
  // =========================================

  const verifyOTP = async (e) => {
    e?.preventDefault();

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

      const response = await api.post("/auth/login/verify-otp", {
        email,
        otp: finalOtp,
      });

      if (response.data?.success) {
        const userData = response.data.user;

        const token = response.data.token;

        const loginSuccess = login(userData, token);

        if (!loginSuccess) {
          toast.error("Login failed. Please try again.");
          return;
        }

        toast.success("Login successful! 🎉");

        navigate("/");
      } else {
        toast.error(response.data?.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

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
  // RESEND OTP
  // =========================================

  const resendOTP = async () => {
    if (timer > 0 || loading) {
      return;
    }

    await sendOTP();
  };

  // =========================================
  // CHANGE EMAIL
  // =========================================

  const changeEmail = () => {
    setStep("email");

    setOtp(["", "", "", "", "", ""]);

    setTimer(0);

    setTimeout(() => {
      document.getElementById("login-email")?.focus();
    }, 100);
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setGoogleLoading(true);

      const credential = credentialResponse?.credential;

      if (!credential) {
        toast.error("Google login failed");
        return;
      }

      const response = await api.post("/auth/google", {
        credential,
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
      console.error("GOOGLE LOGIN ERROR:", error);
      console.error("GOOGLE BACKEND ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleLoading(false);
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

    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
    background: darkMode
      ? "radial-gradient(circle at 10% 10%, rgba(111,66,193,.32), transparent 28%), radial-gradient(circle at 90% 85%, rgba(13,110,253,.28), transparent 30%), radial-gradient(circle at 55% 45%, #111827 0%, #080b12 55%, #020617 100%)"
      : "radial-gradient(circle at 8% 8%, rgba(111,66,193,.20), transparent 25%), radial-gradient(circle at 92% 88%, rgba(13,110,253,.18), transparent 28%), radial-gradient(circle at 55% 45%, #ffffff 0%, #f7f9fc 55%, #eef2ff 100%)",
  };

  const cardStyle = {
    width: "100%",

    maxWidth: "520px",
    padding: "22px 26px",
    borderRadius: "24px",

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

    height: "58px",
    padding: "0 17px",
    borderRadius: "18px",

    border: darkMode ? "1px solid #334155" : "1px solid #dbe1ea",

    background: darkMode ? "#111827" : "#ffffff",

    color: darkMode ? "#f8fafc" : "#111827",

    fontSize: "15px",

    outline: "none",

    transition: "all 0.2s ease",
  };

  const labelStyle = {
    display: "block",

    marginBottom: "8px",

    color: darkMode ? "#e2e8f0" : "#374151",

    fontSize: "14px",

    fontWeight: "600",
  };

  const primaryButtonStyle = {
    width: "100%",

    height: "58px",
    border: "none",
    borderRadius: "18px",

    background: "linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)",

    color: "#ffffff",

    fontSize: "15px",

    fontWeight: "700",

    boxShadow: "0 12px 28px rgba(13,110,253,0.25)",

    transition: "all 0.2s ease",
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div style={pageStyle}>
      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          top: "-90px",
          left: "-70px",
          background:
            "radial-gradient(circle, rgba(111,66,193,.28), transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          bottom: "-120px",
          right: "-90px",
          background:
            "radial-gradient(circle, rgba(13,110,253,.24), transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ ...cardStyle, position: "relative", zIndex: 1 }}>
        {/* ================================= */}
        {/* BRAND */}
        {/* ================================= */}

        <div className="text-center mb-3">
          {/* <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 10px",
              borderRadius: "16px",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: "26px",

              background: "linear-gradient(135deg, #6f42c1, #0d6efd)",

              boxShadow: "0 14px 35px rgba(13,110,253,0.28)",
            }}
          >
            {step === "email" ? "🎨" : "✉️"}
          </div> */}

          <img
            src="/image-color-picker-logo.png"
            alt="Image Color Picker"
            style={{
              width: "52px",
              height: "52px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 12px",
            }}
          />

          <h2
            className="fw-bold mb-2"
            style={{
              color: darkMode ? "#ffffff" : "#111827",
              letterSpacing: "-0.5px",
              fontSize: "27px",
            }}
          >
            {step === "email" ? "Welcome Back" : "Check Your Email"}
          </h2>

          <p
            className="mb-0"
            style={{
              color: darkMode ? "#94a3b8" : "#6b7280",

              fontSize: "14px",

              lineHeight: "1.6",
            }}
          >
            {step === "email"
              ? "Login to your Image Color Picker account."
              : "We sent a 6-digit verification code to your email."}
          </p>
        </div>

        {/* ================================= */}
        {/* EMAIL STEP */}
        {/* ================================= */}

        {step === "email" && (
          <>
            <form onSubmit={sendOTP}>
              <div className="mb-3">
                <label style={labelStyle}>Email Address</label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...primaryButtonStyle,

                  opacity: loading ? 0.7 : 1,

                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Sending Code...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            {/* ================================= */}
            {/* DIVIDER */}
            {/* ================================= */}

            <div className="d-flex align-items-center my-3">
              <div
                style={{
                  flex: 1,

                  height: "1px",

                  background: darkMode ? "#334155" : "#e5e7eb",
                }}
              />

              <span
                className="px-3"
                style={{
                  color: darkMode ? "#64748b" : "#9ca3af",

                  fontSize: "12px",

                  fontWeight: "600",
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,

                  height: "1px",

                  background: darkMode ? "#334155" : "#e5e7eb",
                }}
              />
            </div>

            {/* ================================= */}
            {/* GOOGLE LOGIN*/}
            {/* ================================= */}

            {/* <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                theme={darkMode ? "filled_black" : "outline"}
                size="large"
                shape="rectangular"
                text="continue_with"
                logo_alignment="left"
                locale="en"
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
                    gap: "8px",

                    background: darkMode ? "#1e293b" : "#ffffff",

                    borderRadius: "8px",

                    color: darkMode ? "#ffffff" : "#374151",

                    fontSize: "14px",
                    fontWeight: "600",

                    zIndex: 2,
                  }}
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  />
                  Signing in with Google...
                </div>
              )}
            </div> */}

            {/* ========================================= */}
            {/* PROFESSIONAL GOOGLE LOGIN BUTTON */}
            {/* ========================================= */}

            <div style={{ position: "relative", width: "100%" }}>
              <button
                type="button"
                disabled={googleLoading || loading}
                style={{
                  width: "100%",
                  height: "58px",
                  borderRadius: "18px",

                  border: darkMode ? "1px solid #475569" : "1px solid #d1d5db",

                  background: darkMode ? "#111827" : "#ffffff",

                  color: darkMode ? "#ffffff" : "#1f2937",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",

                  fontSize: "15px",
                  fontWeight: "600",

                  cursor: googleLoading || loading ? "not-allowed" : "pointer",

                  opacity: googleLoading || loading ? 0.65 : 1,

                  transition: "all 0.2s ease",

                  boxShadow: darkMode
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "0 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                {googleLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />

                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    {/* Google G Logo */}
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

                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* //14/09/2026 {time:  PM} */}
              {/* <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme={darkMode ? "filled_black" : "outline"}
                  size="large"
                  shape="rectangular"
                  text="continue_with"
                  logo_alignment="left"
                  width="100%"
                  locale="en"
                />
              </div> */}
            </div>

            {/* ================================= */}
            {/* REGISTER */}
            {/* ================================= */}

            <div
              className="text-center mt-3"
              style={{
                fontSize: "14px",

                color: darkMode ? "#94a3b8" : "#6b7280",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="fw-semibold text-decoration-none"
                style={{
                  color: "#0d6efd",
                }}
              >
                Create Account
              </Link>
            </div>
          </>
        )}

        {/* ================================= */}
        {/* OTP STEP */}
        {/* ================================= */}

        {step === "otp" && (
          <>
            {/* EMAIL DISPLAY */}

            <div
              className="text-center mb-4"
              style={{
                padding: "13px 16px",

                borderRadius: "14px",

                background: darkMode ? "rgba(59,130,246,0.10)" : "#eff6ff",

                border: darkMode
                  ? "1px solid rgba(59,130,246,0.18)"
                  : "1px solid #dbeafe",

                color: darkMode ? "#93c5fd" : "#2563eb",

                fontSize: "13px",

                wordBreak: "break-word",
              }}
            >
              📧 <strong>{email}</strong>
            </div>

            <form onSubmit={verifyOTP}>
              {/* OTP BOXES */}

              <div
                className="d-flex justify-content-center gap-2 mb-3"
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
                      width: "44px",
                      height: "54px",

                      textAlign: "center",

                      fontSize: "21px",

                      fontWeight: "700",

                      borderRadius: "14px",

                      border: digit
                        ? "2px solid #0d6efd"
                        : darkMode
                          ? "1px solid #334155"
                          : "1px solid #dbe1ea",

                      background: darkMode ? "#111827" : "#ffffff",

                      color: darkMode ? "#ffffff" : "#111827",

                      outline: "none",

                      transition: "all 0.2s ease",

                      boxShadow: digit
                        ? "0 6px 18px rgba(13,110,253,0.12)"
                        : "none",
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
                        color: darkMode ? "#94a3b8" : "#6b7280",

                        fontSize: "13px",
                      }}
                    >
                      Code expires in
                    </div>

                    <div
                      className="fw-bold mt-1"
                      style={{
                        fontSize: "22px",

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
                style={{
                  ...primaryButtonStyle,

                  opacity:
                    loading || otp.join("").length !== 6 || timer <= 0
                      ? 0.55
                      : 1,

                  cursor:
                    loading || otp.join("").length !== 6 || timer <= 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </button>
            </form>

            {/* RESEND */}

            <div
              className="text-center mt-4"
              style={{
                fontSize: "14px",

                color: darkMode ? "#94a3b8" : "#6b7280",
              }}
            >
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={resendOTP}
                disabled={timer > 0 || loading}
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                style={{
                  color:
                    timer > 0 ? (darkMode ? "#475569" : "#9ca3af") : "#0d6efd",

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
                ← Change Email
              </button>
            </div>
          </>
        )}

        {/* SECURITY */}

        <div
          className="text-center mt-4"
          style={{
            color: darkMode ? "#475569" : "#9ca3af",

            fontSize: "11px",
          }}
        >
          🔒 Your account information is securely protected.
        </div>
      </div>
    </div>
  );
}

export default Login;
