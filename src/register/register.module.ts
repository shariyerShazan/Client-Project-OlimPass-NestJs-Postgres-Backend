// src/register/register.module.ts
import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipMailService } from 'src/mail/membership-mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService , MembershipMailService],
    imports: [MailModule],
})
export class RegisterModule {}
