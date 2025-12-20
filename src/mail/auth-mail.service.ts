// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class AuthMailService {
// private transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false,   // true if port 465
//   auth: {
//     user: process.env.EMAIL_USER!,
//     pass: process.env.EMAIL_PASS!, // App Password
//   },
// });




//   async sendOtpEmail(to: string, name: string, otp: string) {
//     await this.transporter.sendMail({
//       from: `"Olim Pass" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: 'Your OTP for Redeeming Discount',
//       html: this.otpTemplate(name, otp),
//     });

//     console.log(`OTP email sent to ${to}`);
//   }


//   async sendResetPasswordEmail(
//     to: string,
//     name: string,
//     resetLink: string,
//   ) {
//     await this.transporter.sendMail({
//       from: `"Olim Pass" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: 'Reset Your Password',
//       html: this.resetPasswordTemplate(name, resetLink),
//     });

//     console.log(`Reset password email sent to ${to}`);
//   }



//   private otpTemplate(name: string, otp: string) {
//     return `
//       <div style="width:100%;background:#f4f4f4;padding:40px 0;font-family:Arial">
//         <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;padding:30px;text-align:center">
//           <h2>Hello, ${name}! 👋</h2>
//           <p>Use the following OTP to redeem your discount. It expires in 5 minutes.</p>
//           <div style="background:#f8f8f8;border-radius:8px;padding:15px;border-left:4px solid #F80B58">
//             <p style="font-size:22px;color:#F80B58;font-weight:bold">${otp}</p>
//           </div>
//           <p style="margin-top:20px;font-size:14px;color:#777">
//             If you didn’t request this, ignore this email.
//           </p>
//         </div>
//       </div>
//     `;
//   }

//   private resetPasswordTemplate(name: string, resetLink: string) {
//     return `
//       <div style="width:100%;background:#f4f4f4;padding:40px 0;font-family:Arial">
//         <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;padding:30px;text-align:center">
//           <h2>Hello, ${name}! 👋</h2>

//           <p style="color:#555;font-size:15px;line-height:22px">
//             You requested to reset your password. Click the button below.
//             This link will expire in <b>15 minutes</b>.
//           </p>

//           <a href="${resetLink}"
//              style="
//               display:inline-block;
//               margin-top:20px;
//               padding:12px 24px;
//               background:#F80B58;
//               color:#ffffff;
//               text-decoration:none;
//               border-radius:6px;
//               font-weight:bold;
//              ">
//             Reset Password
//           </a>

//           <p style="margin-top:25px;font-size:14px;color:#777">
//             If you did not request this password reset, please ignore this email.
//           </p>
//         </div>
//       </div>
//     `;
//   }
// }
