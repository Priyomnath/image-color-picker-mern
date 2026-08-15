import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    console.log("====================================");
    console.log("AUTH MIDDLEWARE");
    console.log("Path:", req.originalUrl);
    console.log("Method:", req.method);

    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    let token = null;

    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.startsWith("Bearer ")
    ) {
      const bearerToken = authHeader.split(" ")[1];

      if (
        bearerToken &&
        bearerToken !== "undefined" &&
        bearerToken !== "null"
      ) {
        token = bearerToken;
      }
    }

    // ==========================================
    // IF HEADER TOKEN NOT FOUND
    // CHECK COOKIE TOKEN
    // ==========================================

    if (!token && req.cookies?.token) {
      token = req.cookies.token;

      console.log("Token found from Cookie");
    }

    // ==========================================
    // DEBUG
    // ==========================================

    console.log("Cookies:", req.cookies);
    console.log("Extracted Token:", token ? "TOKEN FOUND" : "NO TOKEN");

    // ==========================================
    // NO TOKEN
    // ==========================================

    if (!token) {
      console.log("❌ NO TOKEN PROVIDED");

      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ JWT VERIFIED");
    console.log("Decoded Token:", decoded);

    // ==========================================
    // SET USER
    // ==========================================

    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
    };

    console.log("Authenticated User:", req.user);

    // ==========================================
    // CHECK USER ID
    // ==========================================

    if (!req.user.id) {
      console.log("❌ USER ID NOT FOUND IN TOKEN");

      return res.status(401).json({
        success: false,
        message: "Invalid token: User ID not found",
      });
    }

    console.log("✅ AUTH SUCCESS");
    console.log("====================================");

    // ==========================================
    // NEXT ROUTE
    // ==========================================

    next();
  } catch (error) {
    console.error("====================================");
    console.error("❌ JWT ERROR:", error.name);
    console.error("❌ JWT MESSAGE:", error.message);
    console.error("====================================");

    return res.status(401).json({
      success: false,
      message: error.message || "Invalid or Expired Token",
    });
  }
};

export default auth;