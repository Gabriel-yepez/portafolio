'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const CV_PATH = '/Users/gabrielyepez/Documents/Datos personales/Currículum Gabriel .pdf';
const CV_FILENAME = 'curriculum-gabriel-yepez.pdf';

async function main() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    // Upload the PDF to Strapi media library
    const existing = await strapi.query('plugin::upload.file').findOne({
      where: { name: CV_FILENAME },
    });

    let fileRecord;
    if (existing) {
      await strapi.plugin('upload').service('upload').remove(existing);
      strapi.log.info('[set-cv] removed old CV file, reuploading');
    }

    {
      const stats = fs.statSync(CV_PATH);
      const [uploaded] = await strapi.plugin('upload').service('upload').upload({
        data: {},
        files: {
          filepath: CV_PATH,
          originalFilename: CV_FILENAME,
          mimetype: 'application/pdf',
          size: stats.size,
          newFilename: CV_FILENAME,
        },
      });
      fileRecord = uploaded;
      strapi.log.info(`[set-cv] uploaded CV: ${fileRecord.url}`);
    }

    const cvUrl = `http://localhost:1337${fileRecord.url}`;

    // Update About record with the cvUrl
    const aboutRecords = await strapi.entityService.findMany('api::about.about');
    const about = Array.isArray(aboutRecords) ? aboutRecords[0] : aboutRecords;

    if (about) {
      await strapi.entityService.update('api::about.about', about.id, {
        data: { cvUrl },
      });
      strapi.log.info(`[set-cv] About.cvUrl set to: ${cvUrl}`);
    } else {
      strapi.log.warn('[set-cv] no About record found');
    }
  } finally {
    await strapi.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
