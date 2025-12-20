import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhook')
export class WebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });

  constructor(private prisma: PrismaService) {}

  // private async generateUniqueMembershipId(): Promise<string> {
  //   let id: string;
  //   let exists: boolean;

  //   do {
  //     id = Math.floor(100000 + Math.random() * 900000).toString();
  //     const user = await this.prisma.registration.findUnique({
  //       where: { membershipId: id },
  //     });
  //     exists = !!user;
  //   } while (exists);

  //   return id;
  // }

  @Post()
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      console.error(' Webhook signature verification failed', err.message);
      return res.status(400).send('Invalid signature');
    }

    res.status(200).json({ received: true });

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event);
          break;

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
          await this.handlePaymentFailed(event);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error(' Webhook background job failed', err);
    }
  }
  

private async handlePaymentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const registrationId = paymentIntent.metadata?.registrationId;

  if (!registrationId) {
    console.warn('registrationId missing in metadata');
    return;
  }

  const registration = await this.prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) {
    console.warn('Registration not found for ID:', registrationId);
    return;
  }

  const finalMembershipId = registration.membershipId.replace(/^InActive/, '');

  await this.prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { stripeSessionId: paymentIntent.id },
      data: { status: 'succeeded' },
    });

    await tx.registration.update({
      where: { id: registrationId },
      data: {
        isActive: true,
        membershipId: finalMembershipId,
      },
    });
  });

  console.log(`Payment succeeded for registration ${registrationId} with membershipId ${finalMembershipId}`);
}



  private async handlePaymentFailed(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const registrationId = paymentIntent.metadata?.registrationId;

    if (!registrationId) {
      console.warn(' registrationId missing in metadata');
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { stripeSessionId: paymentIntent.id },
        data: { status: 'failed' },
      });

      await tx.registration.update({
        where: { id: registrationId },
        data: {
          isActive: false,
          membershipId: "InActive"+registrationId,
        },
      });
    });

    console.log(` Payment failed for registration ${registrationId}`);
  }
}
