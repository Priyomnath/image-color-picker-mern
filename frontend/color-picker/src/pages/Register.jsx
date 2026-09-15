// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import { toast } from "react-toastify";

// import api from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";

// function Register() {
//   const navigate = useNavigate();

//   const { login } = useAuth();
//   const { darkMode } = useTheme();

//   // =========================================
//   // EMAIL
//   // =========================================

//   const [email, setEmail] = useState("");

//   // =========================================
//   // OTP
//   // =========================================

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const otpRefs = useRef([]);

//   // =========================================
//   // STEP
//   // =========================================

//   const [step, setStep] = useState("register");

//   // =========================================
//   // LOADING
//   // =========================================

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   // =========================================
//   // TIMER
//   // =========================================

//   const [timer, setTimer] = useState(0);

//   // =========================================
//   // COUNTDOWN
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
//   // FORMAT TIMER
//   // =========================================

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);

//     const remainingSeconds = seconds % 60;

//     return `${String(minutes).padStart(2, "0")}:${String(
//       remainingSeconds,
//     ).padStart(2, "0")}`;
//   };

//   // =========================================
//   // SEND REGISTER OTP
//   // =========================================

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (loading || googleLoading) return;

//     const normalizedEmail = email.trim().toLowerCase();

//     // =========================================
//     // EMAIL VALIDATION
//     // =========================================

//     if (!normalizedEmail) {
//       toast.error("Please enter your email address");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(normalizedEmail)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/register", {
//         email: normalizedEmail,
//       });

//       if (response.data?.success) {
//         setEmail(normalizedEmail);

//         setOtp(["", "", "", "", "", ""]);

//         setStep("otp");

//         // =====================================
//         // 30 SECOND OTP
//         // =====================================

//         setTimer(30);

//         toast.success(
//           response.data.message || "Verification code sent to your email",
//         );

//         setTimeout(() => {
//           otpRefs.current[0]?.focus();
//         }, 150);
//       } else {
//         toast.error(response.data?.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("REGISTER ERROR:", error);

//       console.error("REGISTER BACKEND ERROR:", error.response?.data);

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
//   // VERIFY REGISTER OTP
//   // =========================================

//   const verifyRegisterOTP = async (e) => {
//     e.preventDefault();

//     if (loading || googleLoading) return;

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

//       const response = await api.post("/auth/register/verify-otp", {
//         email: email.trim().toLowerCase(),

//         otp: finalOtp,
//       });

//       if (response.data?.success) {
//         const userData = response.data.user;

//         const token = response.data.token;

//         const loginSuccess = login(userData, token);

//         if (!loginSuccess) {
//           toast.error("Account created, but automatic login failed.");
//           return;
//         }

//         toast.success("Account created successfully! 🎉");

//         navigate("/");
//       } else {
//         toast.error(response.data?.message || "Verification failed");
//       }
//     } catch (error) {
//       console.error("VERIFY REGISTER OTP ERROR:", error);

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
//     if (timer > 0 || loading || googleLoading) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/register/resend-otp", {
//         email: email.trim().toLowerCase(),
//       });

//       if (response.data?.success) {
//         setOtp(["", "", "", "", "", ""]);

//         // =====================================
//         // RESET TO 30 SECONDS
//         // =====================================

//         setTimer(30);

//         toast.success(response.data.message || "New verification code sent");

//         setTimeout(() => {
//           otpRefs.current[0]?.focus();
//         }, 100);
//       } else {
//         toast.error(response.data?.message || "Failed to resend code");
//       }
//     } catch (error) {
//       console.error("RESEND REGISTER OTP ERROR:", error);

//       toast.error(
//         error.response?.data?.message || "Failed to resend verification code",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // CHANGE EMAIL
//   // =========================================

//   const changeEmail = () => {
//     if (loading || googleLoading) return;

//     setStep("register");

//     setOtp(["", "", "", "", "", ""]);

//     setTimer(0);
//   };

//   // =========================================
//   // GOOGLE REGISTER
//   // =========================================

//   const handleGoogleRegister = async (credentialResponse) => {
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

//       if (!response.data?.success) {
//         toast.error(response.data?.message || "Google registration failed");
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

//       toast.success("Google registration successful! 🎉");

//       navigate("/");
//     } catch (error) {
//       console.error("GOOGLE REGISTER ERROR:", error);

//       console.error("GOOGLE BACKEND ERROR:", error.response?.data);

//       toast.error(
//         error.response?.data?.message || "Google registration failed",
//       );
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // =========================================
//   // GOOGLE ERROR
//   // =========================================

//   const handleGoogleRegisterError = () => {
//     setGoogleLoading(false);

//     toast.error("Google registration failed. Please try again.");
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

//     background: darkMode ? "#050505" : "#f7f8fa",
//   };

//   const cardStyle = {
//     width: "100%",
//     maxWidth: "600px",
//     padding: "20px 28px",
//     background: "transparent",
//     color: darkMode ? "#ffffff" : "#111827",
//   };

//   const inputStyle = {
//     width: "100%",

//     height: "64px",

//     padding: "0 26px",

//     borderRadius: "22px",

//     border: darkMode ? "2px solid #292929" : "2px solid #d9dce1",

//     background: darkMode ? "#080808" : "#ffffff",

//     color: darkMode ? "#ffffff" : "#111827",

//     fontSize: "17px",

//     outline: "none",

//     transition: "all .2s ease",
//   };

//   const primaryButtonStyle = {
//     width: "100%",

//     height: "64px",

//     border: "none",

//     borderRadius: "40px",

//     background: darkMode ? "#f8fafc" : "#111827",

//     color: darkMode ? "#080808" : "#ffffff",

//     fontSize: "19px",

//     fontWeight: "600",

//     cursor: loading || googleLoading ? "not-allowed" : "pointer",

//     opacity: loading ? 0.65 : 1,

//     transition: "all .2s ease",
//   };

//   // =========================================
//   // RENDER
//   // =========================================

//   return (
//     <div style={pageStyle}>
//       <div style={cardStyle}>
//         {/* ================================= */}
//         {/* HEADER */}
//         {/* ================================= */}

//         <div
//           style={{
//             textAlign: "center",

//             marginBottom: "26px",
//           }}
//         >
//           <div
//             style={{
//               width: "56px",
//               height: "56px",
//               margin: "0 auto 14px",
//               borderRadius: "16px",
//               fontSize: "26px",

//               background: "linear-gradient(135deg,#6f42c1,#0d6efd)",

//               boxShadow: "0 12px 35px rgba(13,110,253,.20)",
//             }}
//           >
//             🎨
//           </div>

//           <h1
//             style={{
//               margin: 0,

//               fontSize: "30px",

//               fontWeight: "700",

//               color: darkMode ? "#ffffff" : "#111827",
//             }}
//           >
//             {step === "register" ? "Create your account" : "Verify your email"}
//           </h1>

//           <p
//             style={{
//               margin: "7px 0 0",

//               fontSize: "15px",

//               color: darkMode ? "#888888" : "#6b7280",
//             }}
//           >
//             {step === "register"
//               ? "Enter your email to get started"
//               : `We sent a 6-digit code to ${email}`}
//           </p>
//         </div>

//         {/* ================================= */}
//         {/* REGISTER */}
//         {/* ================================= */}

//         {step === "register" && (
//           <>
//             <form onSubmit={handleRegister}>
//               <label
//                 style={{
//                   display: "block",

//                   marginBottom: "10px",

//                   fontSize: "16px",

//                   fontWeight: "600",

//                   color: darkMode ? "#f1f5f9" : "#1f2937",
//                 }}
//               >
//                 Email
//               </label>

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 autoComplete="email"
//                 disabled={loading || googleLoading}
//                 style={inputStyle}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#0d6efd";

//                   e.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,.10)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = darkMode ? "#292929" : "#d9dce1";

//                   e.target.style.boxShadow = "none";
//                 }}
//               />

//               <button
//                 type="submit"
//                 disabled={loading || googleLoading}
//                 style={{
//                   ...primaryButtonStyle,

//                   marginTop: "20px",
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
//                   "Sign up"
//                 )}
//               </button>
//             </form>

//             {/* ================================= */}
//             {/* DIVIDER */}
//             {/* ================================= */}

//             <div
//               style={{
//                 display: "flex",

//                 alignItems: "center",

//                 gap: "15px",

//                 margin: "24px 0",
//               }}
//             >
//               <div
//                 style={{
//                   flex: 1,

//                   height: "1px",

//                   background: darkMode ? "#252525" : "#e5e7eb",
//                 }}
//               />

//               <span
//                 style={{
//                   fontSize: "12px",

//                   fontWeight: "600",

//                   color: darkMode ? "#777" : "#9ca3af",
//                 }}
//               >
//                 OR
//               </span>

//               <div
//                 style={{
//                   flex: 1,

//                   height: "1px",

//                   background: darkMode ? "#252525" : "#e5e7eb",
//                 }}
//               />
//             </div>

//             {/* ================================= */}
//             {/* GOOGLE */}
//             {/* ================================= */}

//             <div
//               style={{
//                 position: "relative",

//                 width: "100%",

//                 height: "64px",
//               }}
//             >
//               {/* REAL GOOGLE BUTTON */}

//               <div
//                 style={{
//                   position: "absolute",

//                   inset: 0,

//                   zIndex: 2,

//                   opacity: 0,

//                   overflow: "hidden",

//                   borderRadius: "20px",

//                   pointerEvents: loading || googleLoading ? "none" : "auto",
//                 }}
//               >
//                 <GoogleLogin
//                   onSuccess={handleGoogleRegister}
//                   onError={handleGoogleRegisterError}
//                   theme={darkMode ? "filled_black" : "outline"}
//                   size="large"
//                   shape="pill"
//                   text="continue_with"
//                   width="100%"
//                   useOneTap={false}
//                 />
//               </div>

//               {/* CUSTOM BUTTON */}

//               <button
//                 type="button"
//                 disabled={loading || googleLoading}
//                 style={{
//                   width: "100%",

//                   height: "64px",

//                   borderRadius: "22px",

//                   border: darkMode ? "2px solid #292929" : "2px solid #d9dce1",

//                   background: darkMode ? "#080808" : "#ffffff",

//                   color: darkMode ? "#f1f5f9" : "#1f2937",

//                   display: "flex",

//                   alignItems: "center",

//                   justifyContent: "center",

//                   gap: "12px",

//                   fontSize: "18px",

//                   fontWeight: "600",

//                   cursor: loading || googleLoading ? "not-allowed" : "pointer",

//                   opacity: googleLoading || loading ? 0.65 : 1,
//                 }}
//               >
//                 {googleLoading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm" />
//                     Signing up with Google...
//                   </>
//                 ) : (
//                   <>
//                     <svg width="21" height="21" viewBox="0 0 24 24">
//                       <path
//                         fill="#4285F4"
//                         d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
//                       />

//                       <path
//                         fill="#34A853"
//                         d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.6z"
//                       />

//                       <path
//                         fill="#FBBC05"
//                         d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.29A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.22l3.25-2.53z"
//                       />

//                       <path
//                         fill="#EA4335"
//                         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 7.99 9.46 6.27 12 6.27z"
//                       />
//                     </svg>
//                     Continue with Google
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* ================================= */}
//             {/* LOGIN */}
//             {/* ================================= */}

//             <p
//               style={{
//                 textAlign: "center",

//                 marginTop: "22px",

//                 fontSize: "15px",

//                 color: darkMode ? "#888" : "#6b7280",
//               }}
//             >
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 style={{
//                   color: darkMode ? "#ffffff" : "#111827",

//                   fontWeight: "700",

//                   textDecoration: "none",
//                 }}
//               >
//                 Log in
//               </Link>
//             </p>
//           </>
//         )}

//         {/* ================================= */}
//         {/* OTP */}
//         {/* ================================= */}

//         {step === "otp" && (
//           <>
//             <div
//               style={{
//                 textAlign: "center",

//                 marginBottom: "28px",

//                 padding: "15px 18px",

//                 borderRadius: "17px",

//                 background: darkMode ? "#0d0d0d" : "#f3f6fa",

//                 border: darkMode ? "1px solid #242424" : "1px solid #e5e7eb",

//                 fontSize: "14px",

//                 color: darkMode ? "#cbd5e1" : "#374151",

//                 wordBreak: "break-word",
//               }}
//             >
//               📧 <strong>{email}</strong>
//             </div>

//             <form onSubmit={verifyRegisterOTP}>
//               {/* OTP INPUTS */}

//               <div
//                 style={{
//                   display: "flex",

//                   justifyContent: "center",

//                   gap: "10px",

//                   marginBottom: "28px",
//                 }}
//                 onPaste={handleOtpPaste}
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
//                       width: "54px",

//                       height: "64px",

//                       textAlign: "center",

//                       fontSize: "23px",

//                       fontWeight: "700",

//                       borderRadius: "17px",

//                       border: digit
//                         ? "2px solid #0d6efd"
//                         : darkMode
//                           ? "2px solid #292929"
//                           : "2px solid #d9dce1",

//                       background: darkMode ? "#080808" : "#ffffff",

//                       color: darkMode ? "#ffffff" : "#111827",

//                       outline: "none",
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* TIMER */}

//               <div
//                 style={{
//                   textAlign: "center",

//                   marginBottom: "28px",
//                 }}
//               >
//                 {timer > 0 ? (
//                   <>
//                     <div
//                       style={{
//                         fontSize: "13px",

//                         color: darkMode ? "#777" : "#6b7280",
//                       }}
//                     >
//                       Code expires in
//                     </div>

//                     <div
//                       style={{
//                         marginTop: "6px",

//                         fontSize: "22px",

//                         fontWeight: "700",

//                         color: timer <= 10 ? "#ef4444" : "#0d6efd",
//                       }}
//                     >
//                       {formatTime(timer)}
//                     </div>
//                   </>
//                 ) : (
//                   <div
//                     style={{
//                       color: "#ef4444",

//                       fontSize: "14px",

//                       fontWeight: "600",
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
//                 style={{
//                   ...primaryButtonStyle,

//                   opacity:
//                     loading || otp.join("").length !== 6 || timer <= 0
//                       ? 0.5
//                       : 1,
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Creating account...
//                   </>
//                 ) : (
//                   "Verify & Create Account"
//                 )}
//               </button>
//             </form>

//             {/* RESEND */}

//             <div
//               style={{
//                 textAlign: "center",

//                 marginTop: "28px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "14px",

//                   color: darkMode ? "#777" : "#6b7280",
//                 }}
//               >
//                 Didn't receive the code?{" "}
//               </span>

//               <button
//                 type="button"
//                 onClick={resendOTP}
//                 disabled={timer > 0 || loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   padding: 0,

//                   color:
//                     timer > 0 ? (darkMode ? "#555" : "#9ca3af") : "#0d6efd",

//                   fontSize: "14px",

//                   fontWeight: "600",

//                   cursor: timer > 0 ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend Code"}
//               </button>
//             </div>

//             {/* CHANGE EMAIL */}

//             <div
//               style={{
//                 textAlign: "center",

//                 marginTop: "15px",
//               }}
//             >
//               <button
//                 type="button"
//                 onClick={changeEmail}
//                 disabled={loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   color: darkMode ? "#888" : "#6b7280",

//                   fontSize: "14px",

//                   cursor: "pointer",
//                 }}
//               >
//                 ← Change Email
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Register;









// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import { toast } from "react-toastify";

// import api from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";

// function Register() {
//   const navigate = useNavigate();

//   const { login } = useAuth();
//   const { darkMode } = useTheme();

//   // =========================================
//   // EMAIL
//   // =========================================

//   const [email, setEmail] = useState("");

//   // =========================================
//   // OTP
//   // =========================================

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const otpRefs = useRef([]);

//   // =========================================
//   // STEP
//   // =========================================

//   const [step, setStep] = useState("register");

//   // =========================================
//   // LOADING
//   // =========================================

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   // =========================================
//   // TIMER
//   // =========================================

//   const [timer, setTimer] = useState(0);

//   // =========================================
//   // COUNTDOWN
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
//   // FORMAT TIMER
//   // =========================================

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);

//     const remainingSeconds = seconds % 60;

//     return `${String(minutes).padStart(2, "0")}:${String(
//       remainingSeconds,
//     ).padStart(2, "0")}`;
//   };

//   // =========================================
//   // SEND REGISTER OTP
//   // =========================================

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (loading || googleLoading) return;

//     const normalizedEmail = email.trim().toLowerCase();

//     // =========================================
//     // EMAIL VALIDATION
//     // =========================================

//     if (!normalizedEmail) {
//       toast.error("Please enter your email address");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(normalizedEmail)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/register", {
//         email: normalizedEmail,
//       });

//       if (response.data?.success) {
//         setEmail(normalizedEmail);

//         setOtp(["", "", "", "", "", ""]);

//         setStep("otp");

//         // =====================================
//         // 30 SECOND OTP
//         // =====================================

//         setTimer(30);

//         toast.success(
//           response.data.message || "Verification code sent to your email",
//         );

//         setTimeout(() => {
//           otpRefs.current[0]?.focus();
//         }, 150);
//       } else {
//         toast.error(response.data?.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("REGISTER ERROR:", error);

//       console.error("REGISTER BACKEND ERROR:", error.response?.data);

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
//   // VERIFY REGISTER OTP
//   // =========================================

//   const verifyRegisterOTP = async (e) => {
//     e.preventDefault();

//     if (loading || googleLoading) return;

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

//       const response = await api.post("/auth/register/verify-otp", {
//         email: email.trim().toLowerCase(),

//         otp: finalOtp,
//       });

//       if (response.data?.success) {
//         const userData = response.data.user;

//         const token = response.data.token;

//         const loginSuccess = login(userData, token);

//         if (!loginSuccess) {
//           toast.error("Account created, but automatic login failed.");
//           return;
//         }

//         toast.success("Account created successfully! 🎉");

//         navigate("/");
//       } else {
//         toast.error(response.data?.message || "Verification failed");
//       }
//     } catch (error) {
//       console.error("VERIFY REGISTER OTP ERROR:", error);

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
//     if (timer > 0 || loading || googleLoading) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/register/resend-otp", {
//         email: email.trim().toLowerCase(),
//       });

//       if (response.data?.success) {
//         setOtp(["", "", "", "", "", ""]);

//         // =====================================
//         // RESET TO 30 SECONDS
//         // =====================================

//         setTimer(30);

//         toast.success(response.data.message || "New verification code sent");

//         setTimeout(() => {
//           otpRefs.current[0]?.focus();
//         }, 100);
//       } else {
//         toast.error(response.data?.message || "Failed to resend code");
//       }
//     } catch (error) {
//       console.error("RESEND REGISTER OTP ERROR:", error);

//       toast.error(
//         error.response?.data?.message || "Failed to resend verification code",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // CHANGE EMAIL
//   // =========================================

//   const changeEmail = () => {
//     if (loading || googleLoading) return;

//     setStep("register");

//     setOtp(["", "", "", "", "", ""]);

//     setTimer(0);
//   };

//   // =========================================
//   // GOOGLE REGISTER
//   // =========================================

//   const handleGoogleRegister = async (credentialResponse) => {
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

//       if (!response.data?.success) {
//         toast.error(response.data?.message || "Google registration failed");
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

//       toast.success("Google registration successful! 🎉");

//       navigate("/");
//     } catch (error) {
//       console.error("GOOGLE REGISTER ERROR:", error);

//       console.error("GOOGLE BACKEND ERROR:", error.response?.data);

//       toast.error(
//         error.response?.data?.message || "Google registration failed",
//       );
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // =========================================
//   // GOOGLE ERROR
//   // =========================================

//   const handleGoogleRegisterError = () => {
//     setGoogleLoading(false);

//     toast.error("Google registration failed. Please try again.");
//   };

//   // =========================================
//   // STYLES
//   // =========================================

//   const pageStyle = {
//     minHeight: "calc(100vh - 70px)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "24px 16px",
//     position: "relative",
//     overflow: "hidden",
//     background: darkMode
//       ? "radial-gradient(circle at 10% 10%, rgba(111,66,193,.32), transparent 28%), radial-gradient(circle at 90% 85%, rgba(13,110,253,.28), transparent 30%), radial-gradient(circle at 55% 45%, #111827 0%, #080b12 55%, #020617 100%)"
//       : "radial-gradient(circle at 8% 8%, rgba(111,66,193,.20), transparent 25%), radial-gradient(circle at 92% 88%, rgba(13,110,253,.18), transparent 28%), radial-gradient(circle at 55% 45%, #ffffff 0%, #f7f9fc 55%, #eef2ff 100%)",
//   };

//   const cardStyle = {
//     width: "100%",
//     maxWidth: "520px",
//     padding: "22px 26px",
//     borderRadius: "24px",
//     position: "relative",
//     zIndex: 1,
//     background: darkMode
//       ? "rgba(15, 23, 42, 0.96)"
//       : "rgba(255, 255, 255, 0.97)",
//     border: darkMode
//       ? "1px solid rgba(148,163,184,0.18)"
//       : "1px solid rgba(15,23,42,0.08)",
//     boxShadow: darkMode
//       ? "0 30px 80px rgba(0,0,0,0.45)"
//       : "0 30px 80px rgba(15,23,42,0.12)",
//     backdropFilter: "blur(20px)",
//   };

//   const inputStyle = {
//     width: "100%",
//     height: "58px",
//     padding: "0 17px",
//     borderRadius: "18px",
//     border: darkMode ? "1px solid #334155" : "1px solid #dbe1ea",
//     background: darkMode ? "#111827" : "#ffffff",
//     color: darkMode ? "#f8fafc" : "#111827",
//     fontSize: "15px",
//     outline: "none",
//     transition: "all 0.2s ease",
//   };

//   // Button colors are kept exactly as before
//   const primaryButtonStyle = {
//     width: "100%",
//     height: "58px",
//     border: "none",
//     borderRadius: "18px",
//     background: darkMode ? "#f8fafc" : "#111827",
//     color: darkMode ? "#080808" : "#ffffff",
//     fontSize: "16px",
//     fontWeight: "700",
//     cursor: loading || googleLoading ? "not-allowed" : "pointer",
//     opacity: loading ? 0.65 : 1,
//     transition: "all .2s ease",
//   };
//   // =========================================
//   // RENDER
//   // =========================================

//   return (
//     <div style={pageStyle}>
//       <div
//         style={{
//           position: "absolute",
//           width: "220px",
//           height: "220px",
//           borderRadius: "50%",
//           top: "-90px",
//           left: "-70px",
//           background:
//             "radial-gradient(circle, rgba(111,66,193,.28), transparent 68%)",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           width: "260px",
//           height: "260px",
//           borderRadius: "50%",
//           right: "-100px",
//           bottom: "-110px",
//           background:
//             "radial-gradient(circle, rgba(13,110,253,.24), transparent 68%)",
//           pointerEvents: "none",
//         }}
//       />
//       <div style={cardStyle}>
//         {/* ================================= */}
//         {/* HEADER */}
//         {/* ================================= */}

//         <div
//           style={{
//             textAlign: "center",

//             marginBottom: "18px",
//           }}
//         >
//           {/* <div
//             style={{
//               width: "52px",
//               height: "52px",
//               margin: "0 auto 10px",
//               borderRadius: "16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "26px",

//               background: "linear-gradient(135deg,#6f42c1,#0d6efd)",

//               boxShadow: "0 12px 35px rgba(13,110,253,.20)",
//             }}
//           >
//             🎨
//           </div> */}

//           <img
//             src="/image-color-picker-logo.png"
//             alt="Image Color Picker"
//             style={{
//               width: "52px",
//               height: "52px",
//               objectFit: "contain",
//               display: "block",
//               margin: "0 auto 12px",
//             }}
//           />

//           <h1
//             style={{
//               margin: 0,

//               fontSize: "27px",

//               fontWeight: "700",

//               color: darkMode ? "#ffffff" : "#111827",
//             }}
//           >
//             {step === "register" ? "Create your account" : "Verify your email"}
//           </h1>

//           <p
//             style={{
//               margin: "5px 0 0",

//               fontSize: "15px",

//               color: darkMode ? "#888888" : "#6b7280",
//             }}
//           >
//             {step === "register"
//               ? "Enter your email to get started"
//               : `We sent a 6-digit code to ${email}`}
//           </p>
//         </div>

//         {/* ================================= */}
//         {/* REGISTER */}
//         {/* ================================= */}

//         {step === "register" && (
//           <>
//             <form onSubmit={handleRegister}>
//               <label
//                 style={{
//                   display: "block",

//                   marginBottom: "8px",

//                   fontSize: "14px",

//                   fontWeight: "600",

//                   color: darkMode ? "#ffffff" : "#1f2937",
//                 }}
//               >
//                 Email
//               </label>

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 autoComplete="email"
//                 disabled={loading || googleLoading}
//                 style={inputStyle}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#0d6efd";

//                   e.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,.10)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = darkMode ? "#292929" : "#d9dce1";

//                   e.target.style.boxShadow = "none";
//                 }}
//               />

//               <button
//                 type="submit"
//                 disabled={loading || googleLoading}
//                 style={{
//                   width: "100%",
//                   height: "58px",
//                   border: "none",
//                   borderRadius: "18px",

//                   marginTop: "14px",
//                   background:
//                     "linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)",

//                   color: "#ffffff",

//                   fontSize: "15px",
//                   fontWeight: "700",

//                   boxShadow: "0 12px 28px rgba(13,110,253,0.25)",

//                   transition: "all 0.2s ease",

//                   opacity: loading || googleLoading ? 0.7 : 1,

//                   cursor: loading || googleLoading ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Sending Code...
//                   </>
//                 ) : (
//                   "Sign up"
//                 )}
//               </button>
//             </form>

//             {/* ================================= */}
//             {/* DIVIDER */}
//             {/* ================================= */}

//             <div
//               style={{
//                 display: "flex",

//                 alignItems: "center",

//                 gap: "15px",

//                 margin: "16px 0",
//               }}
//             >
//               <div
//                 style={{
//                   flex: 1,

//                   height: "1px",

//                   background: darkMode ? "#252525" : "#e5e7eb",
//                 }}
//               />

//               <span
//                 style={{
//                   fontSize: "12px",

//                   fontWeight: "600",

//                   color: darkMode ? "#777" : "#9ca3af",
//                 }}
//               >
//                 OR
//               </span>

//               <div
//                 style={{
//                   flex: 1,

//                   height: "1px",

//                   background: darkMode ? "#252525" : "#e5e7eb",
//                 }}
//               />
//             </div>

//             {/* ================================= */}
//             {/* GOOGLE */}
//             {/* ================================= */}

//             <div
//               style={{
//                 position: "relative",

//                 width: "100%",

//                 height: "58px",
//               }}
//             >
//               {/* REAL GOOGLE BUTTON */}

//               <div
//                 style={{
//                   position: "absolute",

//                   inset: 0,

//                   zIndex: 2,

//                   opacity: 0,

//                   overflow: "hidden",

//                   borderRadius: "20px",

//                   pointerEvents: loading || googleLoading ? "none" : "auto",
//                 }}
//               >
//                 <GoogleLogin
//                   onSuccess={handleGoogleRegister}
//                   onError={handleGoogleRegisterError}
//                   theme={darkMode ? "filled_black" : "outline"}
//                   size="large"
//                   shape="pill"
//                   text="continue_with"
//                   width="100%"
//                   useOneTap={false}
//                 />
//               </div>

//               {/* CUSTOM BUTTON */}

//               <button
//                 type="button"
//                 disabled={loading || googleLoading}
//                 style={{
//                   width: "100%",

//                   height: "58px",

//                   borderRadius: "18px",

//                   border: darkMode ? "1px solid #475569" : "1px solid #d1d5db",

//                   background: darkMode ? "#080808" : "#ffffff",

//                   color: darkMode ? "#ffffff" : "#1f2937",

//                   display: "flex",

//                   alignItems: "center",

//                   justifyContent: "center",

//                   gap: "12px",

//                   fontSize: "15px",

//                   fontWeight: "600",

//                   cursor: loading || googleLoading ? "not-allowed" : "pointer",

//                   opacity: googleLoading || loading ? 0.65 : 1,
//                 }}
//               >
//                 {googleLoading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm" />
//                     Signing up with Google...
//                   </>
//                 ) : (
//                   <>
//                     <svg width="20" height="20" viewBox="0 0 24 24">
//                       <path
//                         fill="#4285F4"
//                         d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
//                       />

//                       <path
//                         fill="#34A853"
//                         d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.6z"
//                       />

//                       <path
//                         fill="#FBBC05"
//                         d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.29A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.22l3.25-2.53z"
//                       />

//                       <path
//                         fill="#EA4335"
//                         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 7.99 9.46 6.27 12 6.27z"
//                       />
//                     </svg>
//                     Continue with Google
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* ================================= */}
//             {/* LOGIN */}
//             {/* ================================= */}

//             <p
//               style={{
//                 textAlign: "center",

//                 marginTop: "16px",

//                 fontSize: "15px",

//                 color: darkMode ? "#888" : "#6b7280",
//               }}
//             >
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="fw-semibold text-decoration-none"
//                 style={{
//                   color: "#0d6efd",
//                 }}
//               >
//                 Log in
//               </Link>
//             </p>
//           </>
//         )}

//         {/* ================================= */}
//         {/* OTP */}
//         {/* ================================= */}

//         {step === "otp" && (
//           <>
//             <div
//               style={{
//                 textAlign: "center",

//                 marginBottom: "28px",

//                 padding: "15px 18px",

//                 borderRadius: "17px",

//                 background: darkMode ? "#0d0d0d" : "#f3f6fa",

//                 border: darkMode ? "1px solid #242424" : "1px solid #e5e7eb",

//                 fontSize: "14px",

//                 color: darkMode ? "#cbd5e1" : "#374151",

//                 wordBreak: "break-word",
//               }}
//             >
//               📧 <strong>{email}</strong>
//             </div>

//             <form onSubmit={verifyRegisterOTP}>
//               {/* OTP INPUTS */}

//               <div
//                 style={{
//                   display: "flex",

//                   justifyContent: "center",

//                   gap: "10px",

//                   marginBottom: "28px",
//                 }}
//                 onPaste={handleOtpPaste}
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
//                       width: "54px",

//                       height: "58px",

//                       textAlign: "center",

//                       fontSize: "23px",

//                       fontWeight: "700",

//                       borderRadius: "17px",

//                       border: digit
//                         ? "2px solid #0d6efd"
//                         : darkMode
//                           ? "2px solid #292929"
//                           : "2px solid #d9dce1",

//                       background: darkMode ? "#080808" : "#ffffff",

//                       color: darkMode ? "#ffffff" : "#111827",

//                       outline: "none",
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* TIMER */}

//               <div
//                 style={{
//                   textAlign: "center",

//                   marginBottom: "28px",
//                 }}
//               >
//                 {timer > 0 ? (
//                   <>
//                     <div
//                       style={{
//                         fontSize: "13px",

//                         color: darkMode ? "#777" : "#6b7280",
//                       }}
//                     >
//                       Code expires in
//                     </div>

//                     <div
//                       style={{
//                         marginTop: "6px",

//                         fontSize: "22px",

//                         fontWeight: "700",

//                         color: timer <= 10 ? "#ef4444" : "#0d6efd",
//                       }}
//                     >
//                       {formatTime(timer)}
//                     </div>
//                   </>
//                 ) : (
//                   <div
//                     style={{
//                       color: "#ef4444",

//                       fontSize: "14px",

//                       fontWeight: "600",
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
//                 style={{
//                   ...primaryButtonStyle,

//                   opacity:
//                     loading || otp.join("").length !== 6 || timer <= 0
//                       ? 0.5
//                       : 1,
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Creating account...
//                   </>
//                 ) : (
//                   "Verify & Create Account"
//                 )}
//               </button>
//             </form>

//             {/* RESEND */}

//             <div
//               style={{
//                 textAlign: "center",

//                 marginTop: "28px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "14px",

//                   color: darkMode ? "#777" : "#6b7280",
//                 }}
//               >
//                 Didn't receive the code?{" "}
//               </span>

//               <button
//                 type="button"
//                 onClick={resendOTP}
//                 disabled={timer > 0 || loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   padding: 0,

//                   color:
//                     timer > 0 ? (darkMode ? "#555" : "#9ca3af") : "#0d6efd",

//                   fontSize: "14px",

//                   fontWeight: "600",

//                   cursor: timer > 0 ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend Code"}
//               </button>
//             </div>

//             {/* CHANGE EMAIL */}

//             <div
//               style={{
//                 textAlign: "center",

//                 marginTop: "15px",
//               }}
//             >
//               <button
//                 type="button"
//                 onClick={changeEmail}
//                 disabled={loading}
//                 style={{
//                   border: "none",

//                   background: "transparent",

//                   color: darkMode ? "#888" : "#6b7280",

//                   fontSize: "14px",

//                   cursor: "pointer",
//                 }}
//               >
//                 ← Change Email
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Register;



































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

  // =========================================================
  // STATE
  // =========================================================

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const otpRefs = useRef([]);

  const [step, setStep] = useState("register");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [timer, setTimer] = useState(0);

  // =========================================================
  // OTP COUNTDOWN
  // =========================================================

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

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

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // =========================================================
  // REGISTER - SEND OTP
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Email validation
    if (!normalizedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        email: normalizedEmail,
      });

      if (response.data?.success) {
        setEmail(normalizedEmail);

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setStep("otp");

        // 30 second OTP timer
        setTimer(30);

        toast.success(
          response.data.message ||
            "Verification code sent to your email",
        );

        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(
          response.data?.message ||
            "Registration failed",
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
          "Failed to send verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OTP CHANGE
  // =========================================================

  const handleOtpChange = (index, value) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const newOtp = [...otp];

    newOtp[index] = digit;

    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP KEYBOARD
  // =========================================================

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

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP PASTE
  // =========================================================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) {
      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pasted.split("").forEach(
      (digit, index) => {
        newOtp[index] = digit;
      },
    );

    setOtp(newOtp);

    const focusIndex = Math.min(
      pasted.length,
      5,
    );

    setTimeout(() => {
      otpRefs.current[focusIndex]?.focus();
    }, 0);
  };

  // =========================================================
  // VERIFY REGISTER OTP
  // =========================================================

  const verifyRegisterOTP = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) {
      return;
    }

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error(
        "Please enter the complete 6-digit code",
      );

      return;
    }

    if (timer <= 0) {
      toast.error(
        "Verification code has expired",
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register/verify-otp",
        {
          email: email
            .trim()
            .toLowerCase(),

          otp: finalOtp,
        },
      );

      if (response.data?.success) {
        const userData =
          response.data.user;

        const token =
          response.data.token;

        const loginSuccess = login(
          userData,
          token,
        );

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
        message
          .toLowerCase()
          .includes("expired")
      ) {
        setTimer(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const resendOTP = async () => {
    if (
      timer > 0 ||
      loading ||
      googleLoading
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register/resend-otp",
        {
          email: email
            .trim()
            .toLowerCase(),
        },
      );

      if (response.data?.success) {
        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setTimer(30);

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

  // =========================================================
  // CHANGE EMAIL
  // =========================================================

  const changeEmail = () => {
    if (
      loading ||
      googleLoading
    ) {
      return;
    }

    setStep("register");

    setOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setTimer(0);
  };

  // =========================================================
  // GOOGLE REGISTER
  // =========================================================

  const handleGoogleRegister = async (
    credentialResponse,
  ) => {
    if (
      loading ||
      googleLoading
    ) {
      return;
    }

    try {
      setGoogleLoading(true);

      const credential =
        credentialResponse?.credential;

      if (!credential) {
        toast.error(
          "Google authorization failed",
        );

        return;
      }

      const response = await api.post(
        "/auth/google",
        {
          credential,
        },
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Google registration failed",
        );

        return;
      }

      const userData =
        response.data.user;

      const token =
        response.data.token;

      if (!userData || !token) {
        toast.error(
          "Login information is incomplete",
        );

        return;
      }

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

      toast.error(
        error.response?.data?.message ||
          "Google registration failed",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================================================
  // GOOGLE ERROR
  // =========================================================

  const handleGoogleRegisterError = () => {
    setGoogleLoading(false);

    toast.error(
      "Google registration failed. Please try again.",
    );
  };

  // =========================================================
  // STYLES
  // =========================================================

  const pageStyle = {
    minHeight: "calc(100vh - 70px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "32px 16px",

    position: "relative",

    overflow: "hidden",

    background: darkMode
      ? `
        radial-gradient(
          circle at 8% 10%,
          rgba(111,66,193,0.30),
          transparent 27%
        ),
        radial-gradient(
          circle at 92% 85%,
          rgba(13,110,253,0.26),
          transparent 30%
        ),
        linear-gradient(
          135deg,
          #020617 0%,
          #080b12 50%,
          #111827 100%
        )
      `
      : `
        radial-gradient(
          circle at 8% 10%,
          rgba(111,66,193,0.17),
          transparent 26%
        ),
        radial-gradient(
          circle at 92% 85%,
          rgba(13,110,253,0.16),
          transparent 30%
        ),
        linear-gradient(
          135deg,
          #ffffff 0%,
          #f8fafc 55%,
          #eef2ff 100%
        )
      `,
  };

  /*
    Card content width is intentionally controlled
    so the Google button can use a valid fixed width
    without leaving a dead clickable area.
  */
  const cardStyle = {
    width: "100%",
    maxWidth: "438px",

    boxSizing: "border-box",

    padding: "24px",

    borderRadius: "26px",

    position: "relative",
    zIndex: 2,

    background: darkMode
      ? "rgba(15,23,42,0.96)"
      : "rgba(255,255,255,0.97)",

    border: darkMode
      ? "1px solid rgba(148,163,184,0.18)"
      : "1px solid rgba(15,23,42,0.08)",

    boxShadow: darkMode
      ? "0 30px 80px rgba(0,0,0,0.45)"
      : "0 30px 80px rgba(15,23,42,0.12)",

    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  const inputStyle = {
    width: "100%",
    height: "58px",

    boxSizing: "border-box",

    padding: "0 17px",

    borderRadius: "18px",

    border: darkMode
      ? "1px solid #334155"
      : "1px solid #dbe1ea",

    background: darkMode
      ? "#111827"
      : "#ffffff",

    color: darkMode
      ? "#f8fafc"
      : "#111827",

    fontSize: "15px",

    outline: "none",

    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  /*
    Existing Sign up button color preserved.
  */
  const primaryButtonStyle = {
    width: "100%",
    height: "58px",

    border: "none",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)",

    color: "#ffffff",

    fontSize: "15px",

    fontWeight: "700",

    boxShadow:
      "0 12px 28px rgba(13,110,253,0.25)",

    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",

    cursor:
      loading || googleLoading
        ? "not-allowed"
        : "pointer",

    opacity:
      loading || googleLoading
        ? 0.7
        : 1,
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={pageStyle}>

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        style={{
          position: "absolute",

          width: "240px",
          height: "240px",

          borderRadius: "50%",

          top: "-100px",
          left: "-80px",

          background:
            "radial-gradient(circle, rgba(111,66,193,0.30), transparent 68%)",

          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "280px",
          height: "280px",

          borderRadius: "50%",

          right: "-110px",
          bottom: "-120px",

          background:
            "radial-gradient(circle, rgba(13,110,253,0.26), transparent 68%)",

          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          CARD
      ===================================================== */}

      <div style={cardStyle}>

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src="/image-color-picker-logo.png"
            alt="Image Color Picker"
            style={{
              width: "58px",
              height: "58px",

              objectFit: "contain",

              display: "block",

              margin:
                "0 auto 12px",
            }}
          />

          <h1
            style={{
              margin: 0,

              fontSize: "26px",

              lineHeight: "1.25",

              fontWeight: "700",

              letterSpacing: "-0.3px",

              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            {step === "register"
              ? "Create your account"
              : "Verify your email"}
          </h1>

          <p
            style={{
              margin:
                "6px 0 0",

              fontSize: "14px",

              lineHeight: "1.5",

              color: darkMode
                ? "#94a3b8"
                : "#6b7280",
            }}
          >
            {step === "register"
              ? "Enter your email to get started"
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* ===================================================
            REGISTER STEP
        =================================================== */}

        {step === "register" && (
          <>
            <form
              onSubmit={handleRegister}
            >

              {/* EMAIL LABEL */}

              <label
                style={{
                  display: "block",

                  marginBottom: "8px",

                  fontSize: "14px",

                  fontWeight: "600",

                  color: darkMode
                    ? "#f8fafc"
                    : "#1f2937",
                }}
              >
                Email
              </label>

              {/* EMAIL INPUT */}

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                disabled={
                  loading ||
                  googleLoading
                }
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    "#0d6efd";

                  e.target.style.boxShadow =
                    "0 0 0 4px rgba(13,110,253,0.10)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    darkMode
                      ? "#334155"
                      : "#dbe1ea";

                  e.target.style.boxShadow =
                    "none";
                }}
              />

              {/* SIGN UP BUTTON */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading
                }
                style={{
                  ...primaryButtonStyle,

                  marginTop: "14px",
                }}
                onMouseEnter={(e) => {
                  if (
                    !loading &&
                    !googleLoading
                  ) {
                    e.currentTarget.style.transform =
                      "translateY(-1px)";

                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(13,110,253,0.28)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";

                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(13,110,253,0.25)";
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />

                    Sending Code...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "14px",

                margin: "18px 0",
              }}
            >
              <div
                style={{
                  flex: 1,

                  height: "1px",

                  background: darkMode
                    ? "#263244"
                    : "#e5e7eb",
                }}
              />

              <span
                style={{
                  fontSize: "12px",

                  fontWeight: "600",

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
                    ? "#263244"
                    : "#e5e7eb",
                }}
              />
            </div>

            {/* =================================================
                GOOGLE BUTTON

                Card content width = 390px on desktop.

                Google width = 390.
                Therefore there is no right-side dead area.
            ================================================= */}

            <div
              style={{
                position: "relative",

                width: "100%",

                height: "58px",

                overflow: "hidden",

                borderRadius: "18px",
              }}
            >

              {/* REAL GOOGLE LOGIN */}

              <div
                style={{
                  position: "absolute",

                  top: 0,
                  left: "50%",

                  transform:
                    "translateX(-50%)",

                  width: "390px",

                  height: "58px",

                  maxWidth: "100%",

                  zIndex: 3,

                  opacity: 0,

                  overflow: "hidden",

                  borderRadius: "18px",

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
                  width="390"
                  useOneTap={false}
                  locale="en-US"
                />
              </div>

              {/* CUSTOM VISUAL BUTTON */}

              <button
                type="button"
                disabled={
                  loading ||
                  googleLoading
                }
                style={{
                  width: "100%",

                  height: "58px",

                  borderRadius: "18px",

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
                    loading ||
                    googleLoading
                      ? "not-allowed"
                      : "pointer",

                  opacity:
                    loading ||
                    googleLoading
                      ? 0.65
                      : 1,

                  boxShadow: darkMode
                    ? "0 8px 20px rgba(0,0,0,0.20)"
                    : "0 8px 20px rgba(15,23,42,0.06)",

                  transition:
                    "all 0.2s ease",

                  position: "relative",

                  zIndex: 1,
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

            {/* =================================================
                LOGIN LINK
            ================================================= */}

            <p
              style={{
                textAlign: "center",

                margin:
                  "18px 0 0",

                fontSize: "14px",

                color: darkMode
                  ? "#94a3b8"
                  : "#6b7280",
              }}
            >
              Already have an account?{" "}

              <Link
                to="/login"
                style={{
                  color: "#0d6efd",

                  fontWeight: "700",

                  textDecoration: "none",
                }}
              >
                Log in
              </Link>
            </p>
          </>
        )}

        {/* =====================================================
            OTP STEP
        ===================================================== */}

        {step === "otp" && (
          <>
            {/* EMAIL INFORMATION */}

            <div
              style={{
                textAlign: "center",

                marginBottom: "22px",

                padding:
                  "14px 16px",

                borderRadius: "16px",

                background: darkMode
                  ? "rgba(30,41,59,0.65)"
                  : "#f8fafc",

                border: darkMode
                  ? "1px solid #263244"
                  : "1px solid #e5e7eb",

                fontSize: "13px",

                lineHeight: "1.5",

                color: darkMode
                  ? "#cbd5e1"
                  : "#374151",

                wordBreak:
                  "break-word",
              }}
            >
              <span
                style={{
                  marginRight: "6px",
                }}
              >
                📧
              </span>

              <strong>
                {email}
              </strong>
            </div>

            {/* OTP FORM */}

            <form
              onSubmit={
                verifyRegisterOTP
              }
            >

              {/* OTP INPUTS */}

              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "center",

                  gap: "7px",

                  marginBottom: "22px",

                  width: "100%",
                }}
                onPaste={
                  handleOtpPaste
                }
              >
                {otp.map(
                  (digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[
                          index
                        ] = element;
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
                        timer <= 0
                      }
                      aria-label={`OTP digit ${
                        index + 1
                      }`}
                      style={{
                        width: "50px",

                        height: "56px",

                        flex: "0 1 50px",

                        minWidth: 0,

                        boxSizing:
                          "border-box",

                        textAlign: "center",

                        fontSize: "22px",

                        fontWeight: "700",

                        borderRadius:
                          "16px",

                        border: digit
                          ? "2px solid #0d6efd"
                          : darkMode
                            ? "1px solid #334155"
                            : "1px solid #dbe1ea",

                        background:
                          darkMode
                            ? "#111827"
                            : "#ffffff",

                        color: darkMode
                          ? "#ffffff"
                          : "#111827",

                        outline: "none",

                        transition:
                          "all 0.2s ease",
                      }}
                    />
                  ),
                )}
              </div>

              {/* TIMER */}

              <div
                style={{
                  textAlign: "center",

                  marginBottom: "22px",
                }}
              >
                {timer > 0 ? (
                  <>
                    <div
                      style={{
                        fontSize:
                          "13px",

                        color: darkMode
                          ? "#94a3b8"
                          : "#6b7280",
                      }}
                    >
                      Code expires in
                    </div>

                    <div
                      style={{
                        marginTop: "5px",

                        fontSize:
                          "21px",

                        fontWeight: "700",

                        color:
                          timer <= 10
                            ? "#ef4444"
                            : "#0d6efd",
                      }}
                    >
                      {formatTime(
                        timer,
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      color:
                        "#ef4444",

                      fontSize:
                        "14px",

                      fontWeight:
                        "600",
                    }}
                  >
                    Verification code expired
                  </div>
                )}
              </div>

              {/* VERIFY BUTTON */}

              <button
                type="submit"
                disabled={
                  loading ||
                  otp.join("").length !==
                    6 ||
                  timer <= 0
                }
                style={{
                  ...primaryButtonStyle,

                  opacity:
                    loading ||
                    otp.join("").length !==
                      6 ||
                    timer <= 0
                      ? 0.5
                      : 1,
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />

                    Creating account...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </form>

            {/* RESEND */}

            <div
              style={{
                textAlign: "center",

                marginTop: "22px",
              }}
            >
              <span
                style={{
                  fontSize:
                    "13px",

                  color: darkMode
                    ? "#94a3b8"
                    : "#6b7280",
                }}
              >
                Didn't receive the code?{" "}
              </span>

              <button
                type="button"
                onClick={resendOTP}
                disabled={
                  timer > 0 ||
                  loading
                }
                style={{
                  border: "none",

                  background:
                    "transparent",

                  padding: 0,

                  color:
                    timer > 0
                      ? darkMode
                        ? "#475569"
                        : "#9ca3af"
                      : "#0d6efd",

                  fontSize:
                    "13px",

                  fontWeight: "700",

                  cursor:
                    timer > 0
                      ? "not-allowed"
                      : "pointer",
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

            <div
              style={{
                textAlign: "center",

                marginTop: "12px",
              }}
            >
              <button
                type="button"
                onClick={
                  changeEmail
                }
                disabled={loading}
                style={{
                  border: "none",

                  background:
                    "transparent",

                  padding:
                    "4px 8px",

                  color: darkMode
                    ? "#94a3b8"
                    : "#6b7280",

                  fontSize:
                    "13px",

                  fontWeight: "500",

                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer",
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