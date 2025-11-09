# ✨ Mi Portafolio — Proyecto personal

> Una web de portafolio moderna con paleta azul cielo + beige, construida con Vite + React + Tailwind.

---

## 🌟 Propósito
Este repositorio contiene mi portafolio personal: una pequeña SPA pensada para mostrar proyectos, tecnologías, contacto y una estética limpia y profesional. El objetivo es tener una base ligera, accesible y fácil de personalizar para presentar trabajo y experiencias.

## 🎨 Paleta de colores
La estética principal utiliza una combinación de azul cielo y beige para transmitir profesionalismo y calidez.

- Fondo (modo claro): Beige suave — `#F5EBD8`
- Texto principal: Azul profundo / gris oscuro — `#0f172a`
- Primario (accent): Azul cielo — `#38bdf8`
- Accent suave: `#e6f8ff`
- Modo oscuro: fondo navy profundo — `#071026` y texto beige claro — `#F5EBD8`

Estas variables están declaradas en `src/styles/globals.css` como custom properties (CSS variables) para que todo el sistema las reuse fácilmente.

## 🧩 Tecnologías
- React 19
- Vite
- TypeScript
- TailwindCSS (config y utilidades en `src/styles/globals.css`)
- Pequeña colección de componentes en `src/components` (Header, Hero, About, Projects, Contact, Footer)

> Nota: También hay un archivo `readm.md` (este) con una presentación estilizada rápida.

## 🚀 Cómo ejecutar (desarrollo)

Abre una terminal (PowerShell recomendado) en la raíz `mi_portafolio` y ejecuta:

```powershell
# instalar dependencias (si no están instaladas)
pnpm install

# o con npm
# npm install

# arrancar el servidor de desarrollo
pnpm dev

# o con npm
# npm run dev
```

Visita la URL que te indique Vite (por defecto http://localhost:5173).

## 🔧 Notas de desarrollo
- Las variables de color globales están en `src/styles/globals.css`. Cambiándolas se actualiza toda la interfaz.
- Los inputs usan clases utilitarias y heredan `--input` (ahora configurado para mostrar un borde por defecto). Si quieres un borde más intenso en un componente concreto, añade una clase específica (por ejemplo `border-2 border-primary/30`).
- Se aprovechan utilidades Tailwind y componentes en `src/components/ui` para mantener consistencia.

## ✅ Buenas prácticas sugeridas
- Mantén las variables de paleta en `globals.css` y usa `var(--nombre)` en componentes.
- Para accesibilidad, comprueba contraste de color cuando añadas tonos nuevos.
- Añade tests o snapshots para componentes críticos si el proyecto crece.

## 🤝 Contribuciones
Si quieres contribuir:
1. Haz fork o crea una rama nueva.
2. Abre un PR con una descripción corta de los cambios.

## 📬 Contacto
Si tienes preguntas o quieres comentar algo del diseño, usa el componente `Contact` de la app o abre una issue en el repo.

## ⚖️ Licencia
Este repositorio está disponible para uso personal y educativo. Añade la licencia que prefieras (por ejemplo MIT) en `LICENSE` si quieres compartirlo públicamente.

---

