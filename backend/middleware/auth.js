import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  //Add
  console.log("Cookies:", req.cookies);
  console.log("Authorization:", req.headers.authorization);
  console.log("Path:", req.originalUrl);

  try {
    let token = req.cookies.token;

    // যদি cookie না থাকে তাহলে Authorization Header check করবে
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default auth;
