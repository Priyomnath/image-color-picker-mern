// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendOTPEmail = async (email, otp, purpose = "login") => {
//   try {
//     if (!process.env.RESEND_API_KEY) {
//       throw new Error("RESEND_API_KEY is missing");
//     }

//     if (!email || !otp) {
//       throw new Error("Email and OTP are required");
//     }

//     const isRegister = purpose === "register";

//     const { data, error } = await resend.emails.send({
//       from: "Image Color Picker <onboarding@resend.dev>",

//       to: [email],

//       subject: isRegister
//         ? "Verify your Image Color Picker account"
//         : "Your Image Color Picker Login Verification Code",

//       html: `
//         <div style="
//           max-width:600px;
//           margin:40px auto;
//           padding:35px;
//           font-family:Arial,sans-serif;
//           background:#ffffff;
//           border:1px solid #e5e7eb;
//           border-radius:16px;
//         ">

//           <div style="
//             text-align:center;
//             margin-bottom:25px;
//           ">

//             <div style="
//               display:inline-block;
//               width:55px;
//               height:55px;
//               line-height:55px;
//               border-radius:14px;
//               background:linear-gradient(
//                 135deg,
//                 #6f42c1,
//                 #0d6efd
//               );
//               font-size:28px;
//             ">
//               🎨
//             </div>

//             <h2 style="
//               margin:15px 0 5px;
//               color:#222;
//             ">
//               Image Color Picker
//             </h2>

//             <p style="
//               color:#777;
//               margin:0;
//             ">
//               ${isRegister ? "Account Verification" : "Login Verification"}
//             </p>

//           </div>

//           <p style="
//             font-size:16px;
//             color:#333;
//           ">
//             Hello,
//           </p>

//           <p style="
//             font-size:16px;
//             color:#555;
//             line-height:1.6;
//           ">
//             ${
//               isRegister
//                 ? "Use the verification code below to complete your account registration."
//                 : "Use the verification code below to complete your login."
//             }
//           </p>

//           <div style="
//             margin:30px 0;
//             padding:22px;
//             text-align:center;
//             background:#f8f9fa;
//             border-radius:12px;
//           ">

//             <div style="
//               font-size:34px;
//               font-weight:bold;
//               letter-spacing:10px;
//               color:#0d6efd;
//             ">
//               ${otp}
//             </div>

//           </div>

//           <p style="
//             text-align:center;
//             color:#555;
//           ">
//             This verification code expires in
//             <strong>30 seconds</strong>.
//           </p>

//           <p style="
//             margin-top:30px;
//             font-size:13px;
//             color:#999;
//             text-align:center;
//           ">
//             If you did not request this code,
//             you can safely ignore this email.
//           </p>

//           <hr style="
//             border:none;
//             border-top:1px solid #eee;
//             margin:30px 0;
//           ">

//           <p style="
//             text-align:center;
//             font-size:12px;
//             color:#aaa;
//           ">
//             © Image Color Picker
//           </p>

//         </div>
//       `,
//     });

//     if (error) {
//       console.error("RESEND EMAIL ERROR:", error);

//       throw new Error(
//         error.message || "Failed to send verification email"
//       );
//     }

//     console.log("OTP EMAIL SENT:", data);

//     return data;

//   } catch (error) {

//     console.error(
//       "SEND OTP EMAIL FAILED:",
//       error
//     );

//     throw error;
//   }
// };















import nodemailer from "nodemailer";

// Nodemailer Transporter সেটআপ
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // আপনার Gmail ID
    pass: process.env.GMAIL_APP_PASSWORD, // Google-এর App Password
  },
});

export const sendOTPEmail = async (email, otp, purpose = "login") => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is missing in .env");
    }

    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }

    const isRegister = purpose === "register";

    const mailOptions = {
      from: `"Image Color Picker" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: isRegister
        ? "Verify your Image Color Picker account"
        : "Your Image Color Picker Login Verification Code",
      html: `
        <div style="
          max-width:600px;
          margin:40px auto;
          padding:35px;
          font-family:Arial,sans-serif;
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:16px;
        ">

          <div style="text-align:center; margin-bottom:25px;">
            <div style="
              display:inline-block;
              width:55px;
              height:55px;
              line-height:55px;
              border-radius:14px;
              background:linear-gradient(135deg, #6f42c1, #0d6efd);
              font-size:28px;
            ">
              🎨
            </div>
            <h2 style="margin:15px 0 5px; color:#222;">
              Image Color Picker
            </h2>
            <p style="color:#777; margin:0;">
              ${isRegister ? "Account Verification" : "Login Verification"}
            </p>
          </div>

          <p style="font-size:16px; color:#333;">Hello,</p>

          <p style="font-size:16px; color:#555; line-height:1.6;">
            ${
              isRegister
                ? "Use the verification code below to complete your account registration."
                : "Use the verification code below to complete your login."
            }
          </p>

          <div style="
            margin:30px 0;
            padding:22px;
            text-align:center;
            background:#f8f9fa;
            border-radius:12px;
          ">
            <div style="
              font-size:34px;
              font-weight:bold;
              letter-spacing:10px;
              color:#0d6efd;
            ">
              ${otp}
            </div>
          </div>

          <p style="text-align:center; color:#555;">
            This verification code expires in <strong>30 seconds</strong>.
          </p>

          <p style="margin-top:30px; font-size:13px; color:#999; text-align:center;">
            If you did not request this code, you can safely ignore this email.
          </p>

          <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

          <p style="text-align:center; font-size:12px; color:#aaa;">
            © Image Color Picker
          </p>

        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP EMAIL SENT:", info.messageId);
    return info;

  } catch (error) {
    console.error("SEND OTP EMAIL FAILED:", error);
    throw error;
  }
};