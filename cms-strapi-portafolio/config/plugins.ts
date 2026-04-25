export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10 * 1024 * 1024,
      },
      breakpoints: {},
    },
  },

  /**
   * Email plugin
   * --------------------------------------------------------------------------
   * Uses the nodemailer provider over SMTP. Required env vars:
   *   - SMTP_HOST   (default: smtp.gmail.com)
   *   - SMTP_PORT   (default: 587)
   *   - SMTP_USER   (SMTP auth user)
   *   - SMTP_PASS   (SMTP auth password / app password)
   *   - SMTP_FROM   (envelope From + Reply-To default)
   *   - SMTP_TO     (used by the contact-submission lifecycle hook)
   */
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM'),
        defaultReplyTo: env('SMTP_FROM'),
      },
    },
  },
});
