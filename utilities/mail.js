const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail({ type, name, otp, email }) {
  let isSignUp = type === "signup";
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSCODE,
    },
  });

  let info = await transporter.sendMail({
    from: "'🤖 GitCraft' <auto@gitcraft.com>",
    to: email,
    subject: `${isSignUp ? "Sign Up" : "Forgot Password"} Process`,
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>GitCraft OTP Verification</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f0f2f5;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 30px auto;
                        background-color: #ffffff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .header {
                        background: ${
                          isSignUp
                            ? "linear-gradient(135deg, #007bff, #0056b3)"
                            : "linear-gradient(135deg, #ff4b4b, #c70000)"
                        };
                        color: #ffffff;
                        text-align: center;
                        padding: 30px 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.8;
                        margin: 0 0 20px;
                    }
                    .otp {
                        display: block;
                        font-size: 30px;
                        font-weight: bold;
                        color: #007bff;
                        background-color: #eef2f7;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 20px 0;
                        letter-spacing: 2px;
                    }
                    .footer {
                        text-align: center;
                        ${
                          isSignUp
                            ? "background-color: #808080;color: #000000;"
                            : "background-color: #f7f7f7;color: #777;"
                        }
                        padding: 20px 0;
                        font-size: 14px;
                        border-top: 1px solid #eeeeee;
                    }
                    .footer p {
                        margin: 0;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #ff4b4b;
                        color: #ffffff;
                        padding: 5px 10px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    @media (max-width: 600px) {
                        .content {
                            padding: 20px 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${isSignUp ? "🙏" : "⚠️"} OTP Verification</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${name},</p>
                        <p>${
                          isSignUp
                            ? "Thank you for signing up with us! To complete your registration, "
                            : ""
                        }Please use the following One Time Password (OTP) to verify your email address: ${email}</p>
                        <div class="otp">${otp}</div>
                        <p>This OTP is valid for the next 10 minutes. ${
                          isSignUp
                            ? "If you did not request this, please ignore this email."
                            : "Your account will be temporarily on hold. To activate your account, authenticate first!"
                        }</p>
                        <p>${
                          isSignUp
                            ? ""
                            : "Can't login? Try clicking the forgot password button to activate your account."
                        }</p>
                        <p>If you have any questions, feel free to <a href="mailto:${
                          process.env.GMAIL_USERNAME
                        }" class="btn">Contact Support</a></p>
                        <p>This is an automatically generated email. Please do not reply to this email.</p>
                        <p>Best regards,<br>GitCraft Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 GitCraft. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = { sendEmail };
