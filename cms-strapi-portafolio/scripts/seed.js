'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const ASSETS_DIR = path.resolve(__dirname, '..', 'data', 'assets');

async function uploadAsset(strapi, filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`[seed] asset missing: ${filename}`);
    return null;
  }
  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).slice(1).toLowerCase();
  const mimeMap = {
    svg: 'image/svg+xml',
    webp: 'image/webp',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  };
  const mime = mimeMap[ext] || 'application/octet-stream';

  const existing = await strapi.query('plugin::upload.file').findOne({
    where: { name: filename },
  });
  if (existing) return { id: existing.id, name: existing.name };

  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: {
      filepath: filePath,
      originalFilename: filename,
      mimetype: mime,
      size: stats.size,
      newFilename: filename,
    },
  });
  return { id: uploaded.id, name: uploaded.name };
}

const TECH_CATEGORIES = [
  { title: 'Frontend', slug: 'frontend', order: 1 },
  { title: 'Backend', slug: 'backend', order: 2 },
  { title: 'Bases de Datos', slug: 'bases-de-datos', order: 3 },
  { title: 'Herramientas', slug: 'herramientas', order: 4 },
];

const TECHNOLOGIES = [
  { name: 'React', slug: 'react', icon: 'react.svg', category: 'frontend', order: 1 },
  { name: 'TypeScript', slug: 'typescript', icon: 'typescript.svg', category: 'frontend', order: 2 },
  { name: 'Next.js', slug: 'nextjs', icon: 'nextjs.svg', category: 'frontend', order: 3 },
  { name: 'Tailwind CSS', slug: 'tailwind-css', icon: 'tailwind.svg', category: 'frontend', order: 4 },
  { name: 'HTML5', slug: 'html5', icon: 'html5.svg', category: 'frontend', order: 5 },
  { name: 'CSS3', slug: 'css3', icon: 'css3.svg', category: 'frontend', order: 6 },
  { name: 'JavaScript', slug: 'javascript', icon: 'javascript.svg', category: 'frontend', order: 7 },
  { name: 'Node.js', slug: 'nodejs', icon: 'nodejs.svg', category: 'backend', order: 1 },
  { name: 'Express', slug: 'express', icon: 'express.svg', category: 'backend', order: 2 },
  { name: 'Python', slug: 'python', icon: 'python.svg', category: 'backend', order: 3 },
  { name: 'FastAPI', slug: 'fastapi', icon: 'fastapi.svg', category: 'backend', order: 4 },
  { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql.svg', category: 'bases-de-datos', order: 1 },
  { name: 'MongoDB', slug: 'mongodb', icon: 'mongodb.svg', category: 'bases-de-datos', order: 2 },
  { name: 'SQLServer', slug: 'sqlserver', icon: 'sqlserver.svg', category: 'bases-de-datos', order: 3 },
  { name: 'Redis', slug: 'redis', icon: 'redis.svg', category: 'bases-de-datos', order: 4 },
  { name: 'Firebase', slug: 'firebase', icon: 'firebase.svg', category: 'bases-de-datos', order: 5 },
  { name: 'Git', slug: 'git', icon: 'git.svg', category: 'herramientas', order: 1 },
  { name: 'Docker', slug: 'docker', icon: 'docker.svg', category: 'herramientas', order: 2 },
  { name: 'Google Cloud', slug: 'google-cloud', icon: 'googlecloud.svg', category: 'herramientas', order: 3 },
  { name: 'Figma', slug: 'figma', icon: 'figma.svg', category: 'herramientas', order: 4 },
  { name: 'Postman', slug: 'postman', icon: 'postman.svg', category: 'herramientas', order: 5 },
];

const PROJECTS = [
  {
    title: 'E-commerce Platform',
    slug: 'e-commerce-platform',
    description:
      'Plataforma de comercio electrónico completa con carrito de compras, sistema de pagos y panel de administración.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/tuusuario/proyecto',
    techSlugs: ['react', 'nodejs', 'mongodb'],
    order: 1,
    featured: true,
  },
  {
    title: 'Task Management App',
    slug: 'task-management-app',
    description:
      'Aplicación de gestión de tareas con funcionalidades de colaboración en equipo, seguimiento de proyectos y notificaciones.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/tuusuario/proyecto',
    techSlugs: ['nextjs', 'typescript', 'postgresql', 'tailwind-css'],
    order: 2,
    featured: false,
  },
  {
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    description:
      'Dashboard interactivo del clima con pronósticos en tiempo real, gráficos y mapas para múltiples ubicaciones.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/tuusuario/proyecto',
    techSlugs: ['react', 'css3'],
    order: 3,
    featured: false,
  },
];

async function main() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    const categoryIdBySlug = {};
    for (const cat of TECH_CATEGORIES) {
      const existing = await strapi.entityService.findMany('api::tech-category.tech-category', {
        filters: { slug: cat.slug },
        limit: 1,
      });
      if (existing && existing.length > 0) {
        categoryIdBySlug[cat.slug] = existing[0].id;
      } else {
        const created = await strapi.entityService.create('api::tech-category.tech-category', {
          data: cat,
        });
        categoryIdBySlug[cat.slug] = created.id;
      }
    }

    const technologyIdBySlug = {};
    for (const tech of TECHNOLOGIES) {
      const existing = await strapi.entityService.findMany('api::technology.technology', {
        filters: { slug: tech.slug },
        limit: 1,
      });
      if (existing && existing.length > 0) {
        technologyIdBySlug[tech.slug] = existing[0].id;
        continue;
      }
      const icon = await uploadAsset(strapi, tech.icon);
      const created = await strapi.entityService.create('api::technology.technology', {
        data: {
          name: tech.name,
          slug: tech.slug,
          category: categoryIdBySlug[tech.category],
          order: tech.order,
          icon: icon ? icon.id : null,
        },
      });
      technologyIdBySlug[tech.slug] = created.id;
    }

    for (const project of PROJECTS) {
      const existing = await strapi.entityService.findMany('api::project.project', {
        filters: { slug: project.slug },
        limit: 1,
      });
      if (existing && existing.length > 0) continue;
      await strapi.entityService.create('api::project.project', {
        data: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          technologies: project.techSlugs.map((s) => technologyIdBySlug[s]).filter(Boolean),
          order: project.order,
          featured: project.featured,
          publishedAt: new Date(),
        },
      });
    }

    const heroExists = await strapi.entityService.findMany('api::hero.hero');
    if (!heroExists || (Array.isArray(heroExists) && heroExists.length === 0)) {
      const profileImage = await uploadAsset(strapi, 'imagenPerfil.webp');
      await uploadAsset(strapi, 'github.svg');
      await uploadAsset(strapi, 'linkedin.svg');
      await strapi.entityService.create('api::hero.hero', {
        data: {
          greeting: 'Hola, soy',
          name: 'Gabriel Yépez',
          role: 'Desarrollador de Software',
          bio: 'Apasionado por crear soluciones digitales innovadoras y experiencias de usuario excepcionales.',
          profileImage: profileImage ? profileImage.id : null,
          primaryCta: {
            label: 'Ver proyectos',
            targetSectionId: 'projects',
            variant: 'primary',
          },
          secondaryCta: {
            label: 'Contacto',
            targetSectionId: 'contact',
            variant: 'outline',
          },
          socialLinks: [
            { platform: 'github', url: 'https://github.com/Gabriel-yepez', label: 'GitHub' },
            {
              platform: 'linkedin',
              url: 'https://www.linkedin.com/in/gabriel-augusto-yepez-arenas-873b80263/',
              label: 'LinkedIn',
            },
          ],
        },
      });
    }

    const aboutExists = await strapi.entityService.findMany('api::about.about');
    if (!aboutExists || (Array.isArray(aboutExists) && aboutExists.length === 0)) {
      await strapi.entityService.create('api::about.about', {
        data: {
          title: 'Sobre mí',
          description:
            'Soy un desarrollador apasionado con experiencia en la creación de aplicaciones web modernas. Me encanta aprender nuevas tecnologías y enfrentar desafíos que me permitan crecer profesionalmente. Mi objetivo es crear productos que no solo funcionen bien, sino que también brinden una excelente experiencia de usuario. Soy una persona proactiva, autodidacta, responsable, con capacidad de hacer relaciones interpersonales.',
          highlights: [
            { iconName: 'Code', title: 'Desarrollo', description: 'Experiencia en desarrollo frontend y backend con las últimas tecnologías' },
            { iconName: 'Lightbulb', title: 'Creatividad', description: 'Soluciones innovadoras para problemas complejos' },
            { iconName: 'Users', title: 'Colaboración', description: 'Trabajo en equipo y comunicación efectiva' },
            { iconName: 'BookOpenText', title: 'Aprendizaje continuo', description: 'Siempre actualizado con nuevas herramientas y tendencias tecnológicas' },
            { iconName: 'CheckCircleIcon', title: 'Resolución de problemas', description: 'Capacidad para analizar y resolver desafíos técnicos rápidamente' },
            { iconName: 'BookmarkCheck', title: 'Liderazgo', description: 'Habilidad para guiar proyectos y motivar equipos hacia objetivos comunes' },
          ],
        },
      });
    }

    const techSectionExists = await strapi.entityService.findMany('api::technology-section.technology-section');
    if (!techSectionExists || (Array.isArray(techSectionExists) && techSectionExists.length === 0)) {
      await strapi.entityService.create('api::technology-section.technology-section', {
        data: {
          title: 'Tecnologías',
          description: 'Estas son algunas de las tecnologías y herramientas con las que trabajo',
        },
      });
    }

    const contactExists = await strapi.entityService.findMany('api::contact.contact');
    if (!contactExists || (Array.isArray(contactExists) && contactExists.length === 0)) {
      await strapi.entityService.create('api::contact.contact', {
        data: {
          title: 'Contacto',
          description: '¿Tienes un proyecto en mente? ¡Hablemos!',
          formEnabled: true,
          infoItems: [
            { iconName: 'Mail', title: 'Email', value: 'gabrielyepez04@gmail.com', link: 'mailto:gabrielyepez04@gmail.com' },
            { iconName: 'Phone', title: 'Teléfono', value: '+58 414 026 8005', link: 'tel:+584140268005' },
            { iconName: 'MapPin', title: 'Ubicación', value: 'Caracas, Venezuela' },
          ],
        },
      });
    }

    const footerExists = await strapi.entityService.findMany('api::footer.footer');
    if (!footerExists || (Array.isArray(footerExists) && footerExists.length === 0)) {
      await strapi.entityService.create('api::footer.footer', {
        data: {
          copyrightName: 'Gabriel Yépez',
          socialLinks: [
            { platform: 'github', url: 'https://github.com/Gabriel-yepez', label: 'GitHub' },
            {
              platform: 'linkedin',
              url: 'https://www.linkedin.com/in/gabriel-augusto-yepez-arenas-873b80263/',
              label: 'LinkedIn',
            },
          ],
        },
      });
    }

    const globalExists = await strapi.entityService.findMany('api::global.global');
    if (!globalExists || (Array.isArray(globalExists) && globalExists.length === 0)) {
      await strapi.entityService.create('api::global.global', {
        data: {
          siteTitle: 'Mi Portafolio',
          navItems: [
            { label: 'Sobre mí', targetSectionId: 'about' },
            { label: 'Tecnologías', targetSectionId: 'technologies' },
            { label: 'Proyectos', targetSectionId: 'projects' },
            { label: 'Contacto', targetSectionId: 'contact' },
          ],
          seo: {
            metaTitle: 'Gabriel Yépez — Desarrollador de Software',
            metaDescription:
              'Portafolio de Gabriel Yépez, desarrollador de software especializado en aplicaciones web modernas.',
          },
        },
      });
    }

    strapi.log.info('[seed] done');
  } finally {
    await strapi.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
