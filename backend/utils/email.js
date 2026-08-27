import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Image Color Picker" <${process.env.EMAIL_USER}>`,
    to: email,

    subject: "Your Login Verification Code",

    html: `
      <div style="
        max-width:600px;
        margin:auto;
        font-family:Arial,sans-serif;
        padding:30px;
        border:1px solid #eee;
        border-radius:12px;
      ">

        <h2 style="margin-bottom:10px;">
          Image Color Picker
        </h2>

        <p>
          Your login verification code is:
        </p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          margin:25px 0;
        ">
          ${otp}
        </div>

        <p>
          This code will expire in
          <strong>1 minute 30 seconds</strong>.
        </p>

        <p style="color:#777;">
          If you did not request this code, you can safely ignore this email.
        </p>

      </div>
    `,
  });
};