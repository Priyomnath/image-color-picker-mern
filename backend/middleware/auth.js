// import jwt from "jsonwebtoken";

// const auth = (req, res, next) => {
//   //Add
//   console.log("Cookies:", req.cookies);
//   console.log("Authorization:", req.headers.authorization);
//   console.log("Path:", req.originalUrl);

//   try {
//     let token = req.cookies.token;

//     // যদি cookie না থাকে তাহলে Authorization Header check করবে
//     if (!token && req.headers.authorization) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized. Please login.",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or Expired Token",
//     });
//   }
// };

//07/08/2026 {time:  PM}
// const auth = (req, res, next) => {
//   try {
//     //07/08/2026 {time:  PM}
//     console.log("JWT_SECRET AUTH:", process.env.JWT_SECRET);
//     // 📍 Console Debugging Logs
//     console.log("Cookies:", req.cookies);
//     console.log("Authorization Header:", req.headers.authorization);

//     let token = req.cookies?.token;

//     // Cookie-তে না থাকলে Authorization Header (Bearer token) থেকে নেবে
//     if (!token && req.headers.authorization?.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     console.log("Extracted Token:", token);

//     // টোকেন না থাকলে 401 Unauthorized দেবে
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No token provided",
//       });
//     }

//     // JWT Token ভ্যালিডেট করা
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = {
//       id: decoded.id,
//     };

//     console.log("Authenticated User ID:", req.user.id);

//     next(); // সফল হলে পরের রাউটে চলে যাবে
//   } catch (error) {
//     console.error("JWT ERROR:", error.name);
//     console.error("JWT MESSAGE:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import jwt from "jsonwebtoken";

// সেক্ষেত্রে auth.js-এ এই debug code যোগ করুন:
// 07/08/2026 {time:  PM}
try {
  // let token = req.cookies.token;

  // if (!token && req.headers.authorization?.startsWith("Bearer ")) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  // console.log("TOKEN:", token);

  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // console.log("DECODED:", decoded);

  // req.user = { id: decoded.id };

  // //07/08/2026 {time:  PM}
  // console.log("Decoded:", decoded);
  // console.log("req.user:", req.user);

  // next();

  //08/08/2026 {time:  PM}
  let token = null;

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    authHeader.startsWith("Bearer ") &&
    authHeader !== "Bearer undefined"
  ) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
} catch (error) {
  console.log("JWT ERROR:", error.name);
  console.log("JWT MESSAGE:", error.message);

  return res.status(401).json({
    success: false,
    message: error.message,
  });
}

export default auth;

// import jwt from "jsonwebtoken";

// const auth = (req, res, next) => {
//   try {
//     // 📍 Header priority given for strong cross-browser compatibility
//     const authHeader = req.headers.authorization;
//     let token = null;

//     if (authHeader?.startsWith("Bearer ")) {
//       token = authHeader.split(" ")[1];
//     } else if (req.cookies?.token) {
//       token = req.cookies.token;
//     }

//     // 📍 Console Debugging Logs
//     console.log("Authorization Header:", authHeader);
//     console.log("Cookies:", req.cookies);
//     console.log("Extracted TOKEN:", token);

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No token provided",
//       });
//     }

//     // Verify JWT Token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("DECODED TOKEN:", decoded);

//     // Attach User ID to request object
//     req.user = {
//       id: decoded.id || decoded._id,
//     };

//     console.log("req.user set to:", req.user);

//     next(); // Proceed to next middleware or route
//   } catch (error) {
//     console.error("JWT ERROR:", error.name);
//     console.error("JWT MESSAGE:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: error.message || "Invalid or Expired Token",
//     });
//   }
// };

// export default auth;
