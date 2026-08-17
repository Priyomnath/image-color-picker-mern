import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";

import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    //07/08/2026 {time:  PM}
    console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET);
    //SOME UPDATE
    console.log("NODE_ENV:", process.env.NODE_ENV);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = generateToken(user._id);

    //07/18/2026
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    //04/08/2026
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


// ===============================
// GOOGLE LOGIN
// ===============================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const {
      sub: googleId,
      email,
      name,
    } = payload;

    // Find existing user
    let user = await User.findOne({ email });

    // Create user if doesn't exist
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
      });
    } else {
      // Existing account
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Create our JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};




// ===============================
// GOOGLE LOGIN
// ===============================
// export const googleLogin = async (req, res) => {
//   try {
//     const { credential } = req.body;

//     if (!credential) {
//       return res.status(400).json({
//         message: "Google credential is required",
//       });
//     }

//     const ticket = await googleClient.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     const {
//       sub: googleId,
//       email,
//       name,
//       picture,
//     } = payload;

//     if (!email) {
//       return res.status(400).json({
//         message: "Google account email not found",
//       });
//     }

//     let user = await User.findOne({ email });

//     // Existing user
//     if (!user) {
//       user = await User.create({
//         name: name || "Google User",
//         email,
//         password: await bcrypt.hash(
//           googleId + process.env.JWT_SECRET,
//           10
//         ),
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Google login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         picture: picture || "",
//       },
//     });
//   } catch (error) {
//     console.error("Google Login Error:", error);

//     res.status(401).json({
//       message: "Google authentication failed",
//     });
//   }
// };

// // Logout
// export const logoutUser = (req, res) => {
//   //04/08/2026 {time:  PM}
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//   });

//   res.json({
//     success: true,
//     message: "Logout Successful",
//   });
// };

// // Current User
// export const getMe = async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");

//   res.json({
//     success: true,
//     user,
//   });
// };
