import type { Core } from '@strapi/strapi';

const PUBLIC_READ_UIDS = [
  'api::hero.hero',
  'api::about.about',
  'api::technology-section.technology-section',
  'api::contact.contact',
  'api::footer.footer',
  'api::global.global',
  'api::project.project',
  'api::technology.technology',
  'api::tech-category.tech-category',
] as const;

const PUBLIC_READ_ACTIONS = ['find', 'findOne'] as const;

/**
 * Actions that the Public role is allowed to perform on specific content types
 * beyond the read-only `find` / `findOne`. Each entry is a fully-qualified
 * permission action string of the form `<uid>.<action>`.
 */
const PUBLIC_WRITE_ACTIONS = [
  'api::contact-submission.contact-submission.create',
] as const;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      strapi.log.warn(
        '[bootstrap] Public role not found; skipping permission sync.',
      );
      return;
    }

    const ensurePermission = async (permissionAction: string) => {
      try {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({
            where: { action: permissionAction, role: publicRole.id },
          });

        if (existing) {
          if (!existing.enabled) {
            await strapi
              .query('plugin::users-permissions.permission')
              .update({
                where: { id: existing.id },
                data: { enabled: true },
              });
            strapi.log.info(
              `[bootstrap] Enabled public permission ${permissionAction}.`,
            );
          }
          return;
        }

        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permissionAction,
            role: publicRole.id,
            enabled: true,
          },
        });
        strapi.log.info(
          `[bootstrap] Granted public permission ${permissionAction}.`,
        );
      } catch (err) {
        strapi.log.error(
          `[bootstrap] Failed to set permission for ${permissionAction}: ${err}`,
        );
      }
    };

    for (const uid of PUBLIC_READ_UIDS) {
      for (const action of PUBLIC_READ_ACTIONS) {
        await ensurePermission(`${uid}.${action}`);
      }
    }

    for (const permissionAction of PUBLIC_WRITE_ACTIONS) {
      await ensurePermission(permissionAction);
    }
  },
};
