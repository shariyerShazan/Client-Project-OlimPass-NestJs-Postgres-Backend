import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemController } from './redeem.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OtpMailService } from 'src/mail/otp-mail.service';
import { RedeemMailService } from 'src/mail/redeem-mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [MailModule],
  controllers: [RedeemController],
  providers: [RedeemService, PrismaService  , RedeemMailService],

})
export class RedeemModule {}
