import jwt from "jsonwebtoken";

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

//04/08/2026 {time:  PM}
const auth = (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Cookie না থাকলে Authorization header থেকে token নেবে
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default auth;
