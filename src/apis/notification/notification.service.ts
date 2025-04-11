import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface NotificationContent {
  type: string;
  template: string;
  recipient: string;
  content: Record<string, any>;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendNotification(notificationData: NotificationContent): Promise<void> {
    try {
      const notificationServiceUrl = this.configService.get<string>(
        'NOTIFICATION_SERVICE_URL',
        'http://localhost:3000/notifications/send',
      );

      await firstValueFrom(
        this.httpService.post(notificationServiceUrl, notificationData),
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Failed to send ${notificationData.type} notification`);
    }
  }

  async sendOtpEmail(email: string, name: string, otp: string): Promise<void> {
    await this.sendNotification({
      type: 'email',
      template: 'otp-verification',
      recipient: email,
      content: {
        name: name || 'User',
        otpCode: otp,
      },
    });
  }

  async sendEmailVerificationSuccess(
    email: string,
    name: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'email',
      template: 'USER_CREATION',
      recipient: email,
      content: {
        name: name || 'User',
      },
    });
  }
  async sendUserDetailsUpdateEmail(email: string, name: string): Promise<void> {
    await this.sendNotification({
      type: 'email',
      template: 'user-details-updated',
      recipient: email,
      content: {
        name: name || 'User',
      },
    });
  }
}
