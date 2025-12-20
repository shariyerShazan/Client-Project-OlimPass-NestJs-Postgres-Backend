import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterService } from './register/register.service';
import { RegisterModule } from './register/register.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook/webhook.controller';
import { RedeemModule } from './redeem/redeem.module';
// import { MailService } from './mail/membership-mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ExpireRegisterService } from './expire-register/expire-register.service';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { PartnerService } from './partner/partner.service';
import { PartnerModule } from './partner/partner.module';
import { AuthModule } from './auth/auth.module';
import { MembershipMailService } from './mail/membership-mail.service';
import { MailModule } from './mail/mail.module';




@Module({
  imports: [PrismaModule, RegisterModule ,
    ConfigModule.forRoot({
        isGlobal: true
     }),
    RedeemModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    PartnerModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, PrismaService, RegisterService, MembershipMailService, ExpireRegisterService, CategoryService, PartnerService],
})
export class AppModule {}
