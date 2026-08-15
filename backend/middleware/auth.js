import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // =========================================
    // GET AUTHORIZATION HEADER
    // =========================================

    const authHeader = req.headers.authorization;

    // =========================================
    // GET TOKEN
    // =========================================

    let token = null;

    // Header থেকে token
    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      const headerToken = authHeader.split(" ")[1];

      if (
        headerToken &&
        headerToken !== "undefined" &&
        headerToken !== "null"
      ) {
        token = headerToken;
      }
    }

    // Cookie fallback
    if (
      !token &&
      req.cookies?.token
    ) {
      token = req.cookies.token;
    }

    // =========================================
    // DEBUG
    // =========================================

    console.log(
      "Authorization Header:",
      authHeader,
    );

    console.log(
      "Cookies:",
      req.cookies,
    );

    console.log(
      "Extracted TOKEN:",
      token,
    );

    // =========================================
    // TOKEN CHECK
    // =========================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // =========================================
    // VERIFY JWT
    // =========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    console.log(
      "DECODED TOKEN:",
      decoded,
    );

    // =========================================
    // USER
    // =========================================

    req.user = {
      id: decoded.id || decoded._id,
    };

    console.log(
      "Authenticated User:",
      req.user,
    );

    // =========================================
    // NEXT
    // =========================================

    next();

  } catch (error) {
    console.error(
      "JWT ERROR:",
      error.name,
    );

    console.error(
      "JWT MESSAGE:",
      error.message,
    );

    return res.status(401).json({
      success: false,
      message:
        error.message ||
        "Invalid or Expired Token",
    });
  }
};

export default auth;