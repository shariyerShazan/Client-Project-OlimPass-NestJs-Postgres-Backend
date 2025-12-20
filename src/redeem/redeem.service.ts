import { RedeemMailService } from '../mail/redeem-mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addMinutes, addDays, isAfter, isBefore } from 'date-fns';
import { OtpMailService } from 'src/mail/otp-mail.service';

@Injectable()
export class RedeemService {
  constructor(private prisma: PrismaService , private otpMailService : OtpMailService , private redeemMailService: RedeemMailService) {}

  private generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendOtp(membershipId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { membershipId },
    });

    if (!registration) {
      throw new BadRequestException('Membership not found');
    }

    if (!registration.isActive) {
      throw new BadRequestException('Membership inactive');
    }

    const now = new Date();
    if (registration.validTo < now) {
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: false , membershipId: "" },
      });

      throw new BadRequestException('Membership expired');
    }

    let otpWindowStart = registration.otpWindowStart || now;
    let attemptCount = registration.otpAttemptCount;

    const windowEnd = addDays(otpWindowStart, 7);

    if (isBefore(now, windowEnd)) {
      if (attemptCount >= 5) {
        throw new BadRequestException(
          'OTP attempt limit reached. Try again after 7 days.',
        );
      }
    } else {
      otpWindowStart = now;
      attemptCount = 0;
    }

    const otp = this.generateOtp();


    await this.prisma.registration.update({
      where: { id: registration.id },
      data: {
        otp,
        otpExpiresAt: addMinutes(now, 5),
        otpAttemptCount: attemptCount + 1,
        otpWindowStart,
      },
    });

    await this.otpMailService.sendOtp(
        registration.email,
        registration.firstName+' '+registration.lastName,
        otp
      );


    return { success: true, message: 'OTP sent' };
  }





async redeem(membershipId: string, otp: string, partnerId: string) {
  const registration = await this.prisma.registration.findUnique({
    where: { membershipId },
  });

  if (!registration) {
    throw new BadRequestException('Membership not found');
  }

  // OTP Validation
  if (!registration.otp || registration.otp !== otp) {
    await this.prisma.registration.update({
      where: { id: registration.id },
      data: {
        otpAttemptCount: { increment: 1 },
      },
    });
    throw new BadRequestException('Invalid OTP');
  }

  if (!registration.otpExpiresAt || isAfter(new Date(), registration.otpExpiresAt)) {
    await this.prisma.registration.update({
      where: { id: registration.id },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpAttemptCount: 0,
        otpWindowStart: null,
      },
    });
    throw new BadRequestException('OTP expired');
  }

  // Partner fetch
  const partner = await this.prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new BadRequestException('Partner not found');
  }

  // Check existing redeem for this registration + partner
  let redeem = await this.prisma.redeem.findFirst({
    where: {
      registrationId: registration.id,
      partnerId,
    },
    include: {
      registration: true,
      partner: { include: { category: true } },
    },
  });

  if(!redeem && partner.maxRedeems < 1){
    throw new BadRequestException(
      'This partner has no redeems available',
    );
  }
  
  if (redeem) {
    if (redeem.redeemCount >= partner.maxRedeems) {
      throw new BadRequestException(
        'You have reached the maximum redeem limit for this partner',
      );
    }
    redeem = await this.prisma.redeem.update({
      where: { id: redeem.id },
      data: { redeemCount: { increment: 1 } },
      include: {
        registration: true,
        partner: { include: { category: true } },
      },
    });
  } else {
    redeem = await this.prisma.redeem.create({
      data: {
        registrationId: registration.id,
        partnerId,
        redeemCount: 1,
      },
      include: {
        registration: true,
        partner: { include: { category: true } },
      },
    });
  }
  await this.prisma.registration.update({
    where: { id: registration.id },
    data: {
      otp: null,
      otpExpiresAt: null,
      otpAttemptCount: 0,
      otpWindowStart: null,
    },
  });

  let remainRedeems =  partner.maxRedeems - redeem.redeemCount
  // Send Redeem Email
  await this.redeemMailService.semdRedeemData(
    redeem.registration.email,
    `${redeem.registration.firstName} ${redeem.registration.lastName}`,
    {
      registration: redeem.registration,
      partner: redeem.partner,
      redeemedAt: redeem.redeemedAt,
      remainRedeems,
    }
  );

  return {
    success: true,
    message: 'Redeemed successfully! Check your email for details.',
    redeem: {
      id: redeem.id,
      remainRedeems,
      redeemedAt: redeem.redeemedAt,
      registration: {
        firstName: redeem.registration.firstName,
        lastName: redeem.registration.lastName,
        email: redeem.registration.email,
        phone: redeem.registration.phone,
        teudatZehut: redeem.registration.teudatZehut,
        aliyahDate: redeem.registration.aliyahDate,
        membershipId: redeem.registration.membershipId,
      },
      partner: {
        name: redeem.partner.name,
        discount: redeem.partner.discount,
        // category: redeem.partner.category.name,
      },
    },
  };
}





async findAll(page = "1", limit = "10") {
  const pageNum = Number.parseInt(page, 10);
  const limitNum = Number.parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  return Promise.all([
    this.prisma.redeem.findMany({
      skip,
      take: limitNum,
      include: {
        registration: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            membershipId: true,
          },
        },
        partner: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { redeemedAt: "desc" },
    }),
    this.prisma.redeem.count(),
  ]).then(([data, total]) => ({
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  }));
}

}