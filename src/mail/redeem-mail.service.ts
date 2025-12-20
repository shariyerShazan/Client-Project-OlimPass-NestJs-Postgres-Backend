


import { Injectable } from '@nestjs/common';
import { MailClient } from './mail.client';

@Injectable()
export class RedeemMailService {
  constructor(private readonly mailClient: MailClient) {}

  async semdRedeemData(to: string, name: string ,redeemData: any) {
        const { registration, partner, redeemedAt , remainRedeems} = redeemData;

    return this.mailClient.send({
      to,
      name,
      subject:  'Your Discount Has Been Redeemed!',
      html: `
      <div style="width:100%; background-color:#f4f4f4; padding:40px 0; font-family: Arial, sans-serif;">
        <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0px 4px 15px rgba(0,0,0,0.1);">
          
          <!-- Title -->
          <div style="background-color:#F80B58; padding:15px 0; border-radius:8px;">
            <h1 style="color:white; font-size:22px; margin:0; text-align:center;">OLIM PASS MEMBERSHIP</h1>
          </div>

          <!-- Member Info -->
          <div style="margin-top:20px; color:#333;">
            <h2 style="text-align:center; font-size:18px;">Discount Redeemed Successfully!</h2>
            <p style="text-align:center; color:#555;">Details of your redemption:</p>
            
            <div style="background:#f8f8f8; border-left:4px solid #F80B58; padding:15px; border-radius:8px; margin-top:15px;">

             <p><strong>Partner:</strong> ${partner.name}</p>
              <p><strong>Discount:</strong> ${partner.discount}</p>
              <p><strong>Redeemed At:</strong> ${new Date(redeemedAt).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute:'2-digit'
              })}</p>
              <p><strong>Remaining Redeems:</strong> ${remainRedeems}</p>

               <hr style="margin:10px 0; border:none; border-top:1px solid #ddd;">

              <p><strong>Membership ID:</strong> ${registration.membershipId}</p>
              <p><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Phone:</strong> ${registration.phone}</p>
              <p><strong>Teudat Zehut:</strong> ${registration.teudatZehut}</p>
              <p><strong>Aliyah Date:</strong> ${new Date(registration.aliyahDate).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</p>

             

             
            </div>
          </div>

          <!-- Footer -->
          <p style="color:#777; font-size:12px; text-align:center; margin-top:20px;">
            Thank you for using OLIM PASS! Redeem more discounts at your favorite partners.
          </p>
        </div>
      </div>
      `,
    });
  }
}
