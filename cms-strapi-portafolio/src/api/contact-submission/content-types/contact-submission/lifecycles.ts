/**
 * Lifecycle hooks for the contact-submission content type.
 *
 * After every successful create, send a notification email to SMTP_TO using
 * the configured email plugin provider (see config/plugins.ts).
 *
 * Failures are logged but never thrown: the API response to the public
 * client must succeed regardless of mail-delivery problems.
 */

type LifecycleEvent = {
  result: {
    id: number;
    name: string;
    email: string;
    message: string;
  };
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

    const safeName = escapeHtml(result.name);
    const safeEmail = escapeHtml(result.email);
    const safeMessage = escapeHtml(result.message).replace(/\n/g, '<br/>');

    try {
      await strapi.plugins.email.services.email.send({
        to,
        replyTo: result.email,
        subject: `Nuevo mensaje de contacto de ${result.name}`,
        text:
          `Nombre: ${result.name}\n` +
          `Email: ${result.email}\n\n` +
          `Mensaje:\n${result.message}`,
        html:
          `<h2>Nuevo mensaje de contacto</h2>` +
          `<p><strong>Nombre:</strong> ${safeName}</p>` +
          `<p><strong>Email:</strong> ${safeEmail}</p>` +
          `<p><strong>Mensaje:</strong></p>` +
          `<p>${safeMessage}</p>`,
      });
    } catch (err) {
      strapi.log.error(
        `[contact-submission] Failed to send notification email for submission #${result.id}: ${err}`,
      );
    }
  },
};
