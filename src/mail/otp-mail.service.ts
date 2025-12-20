


import { Injectable } from '@nestjs/common';
import { MailClient } from './mail.client';

@Injectable()
export class OtpMailService {
  constructor(private readonly mailClient: MailClient) {}

  async sendOtp(to: string, name: string, otp: string) {
    return this.mailClient.send({
      to,
      name,
      subject: 'Your OTP for Redeeming Discount',
       html: `
        <div style="
            width: 100%;
            background-color: #f4f4f4;
            padding: 40px 0;
            font-family: Arial, sans-serif;
        ">
          <div style="
              max-width: 500px;
              margin: auto;
              background: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0px 4px 15px rgba(0,0,0,0.1);
              text-align: center;
          ">
            <h2 style="
                color: #333333;
                margin-bottom: 10px;
                font-size: 24px;
            ">
              Hello, ${name}! 👋
            </h2>

            <p style="
                color: #555555;
                font-size: 15px;
                line-height: 22px;
                margin-bottom: 20px;
            ">
              Use the following OTP to redeem your discount at a partner location. It will expire in 5 minutes.
            </p>

            <div style="
                background: #f8f8f8;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
                border-left: 4px solid #F80B58;
            ">
              <p style="
                  font-size: 22px;
                  color: #F80B58;
                  font-weight: bold;
                  margin: 0;
              ">
                ${otp}
              </p>
            </div>

            <p style="
                color: #777777;
                font-size: 14px;
                margin-top: 25px;
                line-height: 20px;
            ">
              If you did not request this OTP, please ignore this email.<br/>
              OTP is valid for 5 minutes only.
            </p>
          </div>
        </div>
      `,
    });
  }
}
