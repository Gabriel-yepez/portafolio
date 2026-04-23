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
  { name: 'n8n', slug: 'n8n', icon: null, category: 'herramientas', order: 6 },
  { name: 'Zustand', slug: 'zustand', icon: null, category: 'frontend', order: 8 },
  { name: 'Sequelize', slug: 'sequelize', icon: null, category: 'backend', order: 5 },
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
  {
    title: 'ActionMetrics',
    slug: 'action-metrics',
    description:
      'Sistema de gestión de métricas y análisis de datos para mejorar el rendimiento del recurso humano a nivel empresarial.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/Gabriel-yepez/ActionMetrics',
    techSlugs: ['nextjs', 'express', 'tailwind-css', 'zustand', 'postgresql', 'sequelize'],
    order: 4,
    featured: false,
  },
];

const CERTIFICATIONS = [
  {
    title: 'Associate Cloud Engineer',
    issuer: 'Google Cloud',
    issueDate: 'Sep 2024',
    credentialId: '13366036-ed06-4f79-b557-02da4acd65c2',
    credentialUrl: 'https://www.credly.com/badges/13366036-ed06-4f79-b557-02da4acd65c2',
    description:
      'El proceso para obtener formalmente el título de Associate Cloud Engineer culminará con la aplicación práctica y la certificación oficial tras dominar los fundamentos teóricos que ya has revisado, los cuales incluyen el despliegue de soluciones, el monitoreo operativo, la gestión de IAM y la administración de redes y almacenamiento; la clave es transformar esa teoría en habilidad práctica a través del uso intensivo de la interfaz de línea de comandos (CLI) / gcloud SDK y la Cloud Console. Este camino de estudio y experiencia práctica finalizará con la inscripción y la aprobación satisfactoria del examen de certificación oficial de Google Cloud, validando tu capacidad para realizar tareas operativas esenciales y consolidando tu título como Associate Cloud Engineer.',
    topics: ['Cloud Architecture', 'Cloud Computing', 'DevOps', 'Iam', 'GKE', 'Networking', 'Google Cloud Platform'],
    order: 1,
  },
  {
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    issueDate: 'Aug 2025',
    credentialId: 'FDE-8217',
    credentialUrl: 'https://www.credly.com/earner/earned/badge/36d51470-cc8b-444f-b69a-7e2592336872',
    description:
      'Cisco, en colaboración con OpenEDG Python Institute, verifica que la persona que obtiene este distintivo ha completado con éxito el curso Python Essentials 1 y ha alcanzado las credenciales a nivel estudiantil. Los titulares tienen conocimientos sobre los conceptos de programación informática, la sintaxis y semántica del lenguaje Python, así como la capacidad de realizar tareas de codificación relacionadas con los fundamentos de la programación en Python y resolver desafíos de implementación utilizando la Biblioteca Estándar de Python.',
    topics: ['Python'],
    order: 2,
  },
  {
    title: 'Python Essentials 2',
    issuer: 'Cisco Networking Academy',
    issueDate: 'Nov 2025',
    credentialId: '9ec9fcc3-e553-43cf-8c55-0b631d376ad0',
    credentialUrl: 'https://www.credly.com/earner/earned/badge/9ec9fcc3-e553-43cf-8c55-0b631d376ad0',
    description:
      'Cisco, en colaboración con OpenEDG Python Institute, verifica que el titular de esta insignia completó con éxito el curso Python Essentials 2 y logró las credenciales a nivel estudiantil. Los titulares poseen conocimientos y habilidades en aspectos intermedios de la programación en Python, incluyendo módulos, paquetes, excepciones, procesamiento de archivos, así como técnicas generales de codificación y programación orientada a objetos (POO), y prepara al estudiante para la certificación PCAP – Certified Associate in Python Programming.',
    topics: ['Python'],
    order: 3,
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
      const icon = tech.icon ? await uploadAsset(strapi, tech.icon) : null;
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

    // Seed certifications
    for (const cert of CERTIFICATIONS) {
      const existing = await strapi.entityService.findMany('api::certification.certification', {
        filters: { credentialId: cert.credentialId },
        limit: 1,
      });
      if (existing && existing.length > 0) continue;
      await strapi.entityService.create('api::certification.certification', {
        data: {
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          description: cert.description,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
          topics: cert.topics,
          order: cert.order,
          publishedAt: new Date(),
        },
      });
    }

    // Add Certificaciones to global navItems if missing
    const globalData = await strapi.entityService.findMany('api::global.global', {
      populate: ['navItems'],
    });
    const globalRecord = Array.isArray(globalData) ? globalData[0] : globalData;
    if (globalRecord) {
      const navItems = globalRecord.navItems || [];
      if (!navItems.some((n) => n.targetSectionId === 'certifications')) {
        const withoutContact = navItems.filter((n) => n.targetSectionId !== 'contact');
        withoutContact.push({ label: 'Certificaciones', targetSectionId: 'certifications' });
        withoutContact.push({ label: 'Contacto', targetSectionId: 'contact' });
        await strapi.entityService.update('api::global.global', globalRecord.id, {
          data: { navItems: withoutContact },
        });
        strapi.log.info('[seed] added Certificaciones navItem');
      }
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
