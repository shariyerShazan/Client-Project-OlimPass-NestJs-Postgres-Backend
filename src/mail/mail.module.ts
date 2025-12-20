
import { Module } from '@nestjs/common';
import { MailClient } from './mail.client';
import { OtpMailService } from './otp-mail.service';
import { MembershipMailService } from './membership-mail.service';
import { RedeemMailService } from './redeem-mail.service';

@Module({
    providers: [MailClient ,OtpMailService , MembershipMailService , RedeemMailService ],
    exports: [ MailClient, OtpMailService , MembershipMailService , RedeemMailService , ],

})
export class MailModule {}
