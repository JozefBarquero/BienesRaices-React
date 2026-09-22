# Catálogo Web Inmobiliario — Bienes Raíces Horquetas de Sarapiquí

[![React](https://img.shields.io/badge/React-v18%2F19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Universidad Nacional](https://img.shields.io/badge/UNA-Sede%20Regional%20Chorotega-red)](https://www.una.ac.cr/)

> **Entregable:** II Entregable — Front Office Funcional: Hooks, Context API y Consumo de APIs  
> **Curso:** Programación III (II Ciclo 2026)  
> **Institución:** Universidad Nacional de Costa Rica (UNA) — Sede Regional Chorotega, Campus Liberia  
> **Carrera:** Ingeniería de Sistemas de Información  
> **Profesor:** Mag. Enrique Gómez Jiménez  

---

## Integrantes del Grupo

| # | Nombre Completo | Perfil GitHub |
|---|---|---|
| 1 | Jozéf Barquero | [@JozefBarquero](https://github.com/JozefBarquero) |
| 2 | Fabricio Méndez | — |

---

## Descripción del Proyecto

**Bienes Raíces Horquetas de Sarapiquí** es una aplicación web interactiva diseñada para la consulta, gestión y visualización dinámica de un catálogo inmobiliario.

---

## Cumplimiento de Requisitos del II Entregable

### 1. Hooks de React (`useState` y `useEffect`)
* **`useState`**:
  * Control y gestión de filtros dinámicos (rango de precio, tipo de inmueble, ubicación).
  * Manejo de estados de la interfaz de usuario (modales, visores de imágenes Lightbox, menús responsivos).
  * Almacenamiento de listados de inmuebles y respuestas de servicios externos.
* **`useEffect`**:
  * Ejecución de solicitudes HTTP asíncronas para la obtención de datos externos durante la carga inicial del componente.
  * Sincronización de componentes de mapas interactivos (`React Leaflet`) según las coordenadas dinámicas del inmueble consultado.
  * Reacción inmediata ante la actualización de preferencias de usuario (ej. cambio de divisa).

### 2. Context API (`CurrencyContext.jsx`)
* **Propósito**: Compartir el estado global de divisas (USD, CRC, EUR) entre componentes sin incurrir en acoplamiento ni paso innecesario de propiedades (*prop drilling*).
* **Funcionalidad**: Permite al usuario cambiar la moneda de visualización desde la interfaz, recalculando automáticamente los precios de todo el catálogo inmobiliario mediante el consumo de tipos de cambio actualizados.

### 3. Consumo de APIs Externas
Se integran servicios en línea de terceros mediante peticiones HTTP asíncronas para proveer contenido dinámico y útil al usuario:

| API / Servicio | Propósito en el Proyecto | Implementación |
|---|---|---|
| **Exchange Rate API** | Obtención en tiempo real de los tipos de cambio para la conversión monetaria en el `CurrencyContext`. | Peticiones HTTP asíncronas (`fetch` / `axios`) |
| **OpenMeteo API** | Consulta e integración del clima/tiempo meteorológico en vivo para la ubicación de cada propiedad. | Solicitud `fetch` / `axios` |
| **OpenStreetMap / Leaflet** | Renderizado de mapas dinámicos interactivos con marcadores geográficos (`ubicaciones.js`). | `leaflet`, `react-leaflet` |
| **Gemini IA** | Módulo de Inteligencia Artificial para ofertas inmobiliarias. | Integración API de IA |

### 4. Manejo de Estados de Carga (Loading) y Errores
* **Estado de Carga (Loading)**: Indicadores visuales de espera (*spinners* / componentes de carga) mientras se resuelven las solicitudes HTTP a las APIs.
* **Manejo de Errores**: Captura de excepciones (`try/catch`) y mensajes amigables en pantalla cuando una API no responde o falla la conexión.

---

## Tecnologías y Arquitectura del Sistema

### 1. UI, Componentes e Interacción
* **Bootstrap & Popper.js**: Layout responsivo y componentes UI (`bootstrap`, `@popperjs/core`).
* **Framer Motion**: Animaciones avanzadas para componentes React (`framer-motion`).
* **Swiper**: Carruseles y sliders táctiles para el catálogo de propiedades (`swiper`).
* **Yet Another React Lightbox**: Galería e inspección de imágenes a pantalla completa.
* **Simple Icons & SVG/WebP**: Assets optimizados e iconografía vectorial (`public/svg`, `public/ico`, `public/img`).

### 2. Mapas y Geolocalización
* **Leaflet & React Leaflet**: Visualización e interacción con mapas geográficos de propiedades (`leaflet`, `react-leaflet`, `ubicaciones.js`).

### 3. Backend (Preparación de Servicios)
* **Node.js + Express**: Servidor de APIs RESTful (`server.js`, `routes/auth.js`, `routes/contacto.js`, `routes/propiedades.js`, `routes/tipos-inmueble.js`).
* **Nodemailer / Brevo (SMTP)**: Módulo y servicio para envío automático de correos (`config/mailer.js`).
* **Multer & Sharp**: Procesamiento, compresión y conversión de imágenes multimedia a WebP (`sharp`, `imageProcessor.js`).
* **Seguridad & Sesiones**: JSON Web Tokens (JWT), Bcrypt / Bcryptjs (hashing de claves), Cookies (`set-cookie-parser`).

### 4. Herramientas de Compilación y DevTools
* **Vite**: Servidor de desarrollo y empaquetador veloz (`vite.config.js`).
* **@vitejs/plugin-react**, **LightningCSS**, **PostCSS**, **Rolldown**.
* **Nodemon / Chokidar**: Monitoreo de cambios en archivos durante el desarrollo local.

### 5. Infraestructura y Hosting
* **Servidor Local/Producción**: Host Debian Linux con MariaDB & [Open Script Manager (OSM)](https://github.com/JozefBarquero/Open-Script-Manager).
* **Plataformas & CDN**: Cloudflare, Netlify, GitHub.

---

## Instrucciones de Instalación y Ejecución

### Prerrequisitos
* **Node.js** (v18.0.0 o superior recomendado)
* **npm** (incluido con Node.js)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JozefBarquero/bienes-raices.git
   cd bienes-raices
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Cree un archivo `.env` en la raíz del proyecto tomando como referencia las variables necesarias (ej. claves de APIs de tipo de cambio, correo o Gemini IA):
   ```env
   VITE_EXCHANGE_RATE_API_KEY=tu_api_key_aqui
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación:**
   Abra su navegador e ingrese a la dirección mostrada en la terminal (por defecto `http://localhost:5173`).