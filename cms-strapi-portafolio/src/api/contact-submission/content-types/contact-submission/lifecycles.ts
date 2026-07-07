/**
 * Lifecycle hooks for the contact-submission content type.
 *
 * After every successful create, send a notification email to SMTP_TO using
 * the configured email plugin provider (see config/plugins.ts). The email
 * body is a React Email template rendered to HTML/plain text.
 *
 * Failures are logged but never thrown: the API response to the public
 * client must succeed regardless of mail-delivery problems.
 */

import { render } from '@react-email/render';
import { ContactNotificationEmail } from '../../../../emails/ContactNotificationEmail';

type LifecycleEvent = {
  result: {
    id: number;
    name: string;
    email: string;
    message: string;
  };
};

export default {
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;

    const to = process.env.SMTP_TO;
    if (!to) {
      strapi.log.warn(
        '[contact-submission] SMTP_TO is not set; skipping notification email.',
      );
      return;
    }

    const emailElement = ContactNotificationEmail({
      name: result.name,
      email: result.email,
      message: result.message,
      submissionId: result.id,
    });

    try {
      const [html, text] = await Promise.all([
        render(emailElement),
        render(emailElement, { plainText: true }),
      ]);

      await strapi.plugins.email.services.email.send({
        to,
        replyTo: result.email,
        subject: `Nuevo mensaje de contacto de ${result.name}`,
        text,
        html,
      });
    } catch (err) {
      strapi.log.error(
        `[contact-submission] Failed to send notification email for submission #${result.id}: ${err}`,
      );
    }
  },
};
