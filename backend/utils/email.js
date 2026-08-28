// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },

//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendOTPEmail = async (email, otp) => {
  const { data, error } =
    await resend.emails.send({
      from: "Image Color Picker <onboarding@resend.dev>",

      to: [email],

      subject:
        "Your Image Color Picker Login Verification Code",

      html: `
        <div style="
          max-width:600px;
          margin:40px auto;
          padding:35px;
          font-family:Arial, sans-serif;
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:16px;
        ">

          <div style="
            text-align:center;
            margin-bottom:25px;
          ">
            <div style="
              display:inline-block;
              width:55px;
              height:55px;
              line-height:55px;
              border-radius:14px;
              background:linear-gradient(
                135deg,
                #6f42c1,
                #0d6efd
              );
              font-size:28px;
            ">
              🎨
            </div>

            <h2 style="
              margin:15px 0 5px;
              color:#222;
            ">
              Image Color Picker
            </h2>

            <p style="
              color:#777;
              margin:0;
            ">
              Login Verification
            </p>
          </div>

          <p style="
            font-size:16px;
            color:#333;
          ">
            Hello,
          </p>

          <p style="
            font-size:16px;
            color:#555;
            line-height:1.6;
          ">
            Use the verification code below to
            complete your login.
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

          <p style="
            text-align:center;
            color:#555;
          ">
            This verification code expires in
            <strong>1 minute 30 seconds</strong>.
          </p>

          <p style="
            margin-top:30px;
            font-size:13px;
            color:#999;
            text-align:center;
          ">
            If you did not request this code,
            you can safely ignore this email.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #eee;
            margin:30px 0;
          ">

          <p style="
            text-align:center;
            font-size:12px;
            color:#aaa;
          ">
            © Image Color Picker
          </p>

        </div>
      `,
    });

  if (error) {
    console.error(
      "RESEND EMAIL ERROR:",
      error
    );

    throw new Error(
      "Failed to send verification email"
    );
  }

  console.log(
    "OTP EMAIL SENT:",
    data
  );

  return data;
};