import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_USER,
    pass: process.env.Email_PASS,
  },
});

// ✅ transporter.verify सही तरीका
transporter.verify((error, success) => {
  if (error) {
    console.log(" Gmail service not ready to send email. Please check the email config:", error);
  } else {
    console.log(" Gmail service is ready to send emails");
  }
});

const sendEmail = async (to:string,subject:string,body:string)=>{
    await transporter.sendMail({
        from:`"your BookStore Lexora" <${process.env.Email_USER}>`,
        to,
        subject,
        html:body
    })
}

export const sendVerificationToEmail = async(to:string,token:string)=>{
       const verificarionUrl=`${process.env.FRONTEND_URL}/verify-email/${token}`
       const html=`
       <h1>Wellcome Lexora! Verify your email</h1>
       <p>Thank you for registring, please click link below to verify your email address </p>
       <a href='${verificarionUrl}'>Verify email here!</a>
       <p>If you didn't request this or already verified, please ignore this email <p/>
       `
      await sendEmail(to,"please verify your email to access your Lexora ",html)
}

export const sendResetPasswordLinkoEmail = async(to:string,token:string)=>{
       const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${token}`
       const html=`
       <h1>welcom to Lexora! Reset your password</h1>
       <p>You have requested to reset your password! click the link below to set a new password</p>
       <a href='${resetUrl}'>Reset Password!</a>
       <p>If you didn't request this , please ignore this email and your password will remain unchanged <p/>
       `
      await sendEmail(to,"please reset your password ",html)
}