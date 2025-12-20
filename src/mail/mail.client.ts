import { Injectable, Logger } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class MailClient {
  private readonly logger = new Logger(MailClient.name);
  private readonly apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY!;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async send(options: {
    to: string;
    subject: string;
    html: string;
    name?: string;
  }) {
    try {
      await this.apiInstance.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL!,
          name: process.env.BREVO_SENDER_NAME!,
        },
        to: [{ email: options.to, name: options.name }],
        subject: options.subject,
        htmlContent: options.html,
      });
    } catch (error) {
      this.logger.error('Mail send failed', error);
      throw error;
    }
  }
}
