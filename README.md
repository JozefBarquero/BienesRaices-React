# Catálogo Web Inmobiliario — Bienes Raíces Horquetas de Sarapiquí
*.README By Gemini IA & Deepseek*

[![React](https://img.shields.io/badge/React-v18%2F19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Universidad Nacional](https://img.shields.io/badge/UNA-Sede%20Regional%20Chorotega-red)](https://www.una.ac.cr/)

> **Entregable:** III Entregable — SPA, React Router y Testing
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

**Bienes Raíces Horquetas de Sarapiquí** es una aplicación web interactiva de página única (SPA) diseñada para la consulta, gestión y visualización dinámica de un catálogo inmobiliario. Permite la navegación fluida entre secciones, filtrado en tiempo real, conversión de divisas, navegación protegida para administración y verificación de comportamiento mediante pruebas automatizadas.

---

## Entregables del Curso

<details>
<summary><strong>📦 II Entregable — Hooks, Context API y APIs Externas</strong></summary>

<br>

### Cumplimiento de Requisitos del II Entregable

#### 1. Hooks de React (`useState` y `useEffect`)

- **`useState`**:
  - Control y gestión de filtros dinámicos (rango de precio, tipo de inmueble, ubicación).
  - Manejo de estados de la interfaz de usuario (modales, visores de imágenes Lightbox, menús responsivos).
  - Almacenamiento de listados de inmuebles y respuestas de servicios externos.
- **`useEffect`**:
  - Ejecución de solicitudes HTTP asíncronas para la obtención de datos externos durante la carga inicial del componente.
  - Sincronización de componentes de mapas interactivos (`React Leaflet`) según las coordenadas dinámicas del inmueble consultado.
  - Reacción inmediata ante la actualización de preferencias de usuario (ej. cambio de divisa).

#### 2. Context API (`CurrencyContext.jsx`)

- **Propósito**: Compartir el estado global de divisas (USD, CRC, EUR) entre componentes sin incurrir en acoplamiento ni paso innecesario de propiedades (*prop drilling*).
- **Funcionalidad**: Permite al usuario cambiar la moneda de visualización desde la interfaz, recalculando automáticamente los precios de todo el catálogo inmobiliario mediante el consumo de tipos de cambio actualizados.

#### 3. Consumo de APIs Externas

Se integran servicios en línea de terceros mediante peticiones HTTP asíncronas para proveer contenido dinámico y útil al usuario:

| API / Servicio | Propósito en el Proyecto | Implementación |
|---|---|---|
| **Exchange Rate API** | Obtención en tiempo real de los tipos de cambio para la conversión monetaria en el `CurrencyContext`. | Peticiones HTTP asíncronas (`fetch` / `axios`) |
| **OpenMeteo API** | Consulta e integración del clima/tiempo meteorológico en vivo para la ubicación de cada propiedad. | Solicitud `fetch` / `axios` |
| **OpenStreetMap / Leaflet** | Renderizado de mapas dinámicos interactivos con marcadores geográficos (`ubicaciones.js`). | `leaflet`, `react-leaflet` |
| **Gemini IA** | Módulo de Inteligencia Artificial para ofertas inmobiliarias. | Integración API de IA |

#### 4. Manejo de Estados de Carga (Loading) y Errores

- **Estado de Carga (Loading)**: Indicadores visuales de espera (*spinners* / componentes de carga) mientras se resuelven las solicitudes HTTP a las APIs.
- **Manejo de Errores**: Captura de excepciones (`try/catch`) y mensajes amigables en pantalla cuando una API no responde o falla la conexión.

</details>

---

<details>
<summary><strong>🚀 III Entregable — SPA, React Router y Testing</strong></summary>

<br>

### Cumplimiento de Requisitos del III Entregable

#### 1. Aplicación de Página Única (SPA) y React Router

- **Enrutador Global**: La aplicación está estructurada con `BrowserRouter` centralizado en `App.jsx`, manteniendo la continuidad de la experiencia del usuario sin recargas de página.
- **Enlaces de Navegación**: Uso de componentes `<Link>` / `<NavLink>` en el `Header` y vistas generales para navegación client-side.
- **Parámetros de Ruta**: Implementación del hook `useParams()` en `PropertyDetailPage.jsx` para cargar la información dinámica de cada inmueble según su ID (`/propiedad/:id`).
- **Navegación Programática**: Implementación de `useNavigate()` para redireccionamientos tras acciones del usuario (login, logout, gestión de sesión).
- **Ruta de Error (404)**: Manejo de rutas no reconocidas mediante `/*` redirigiendo al componente `NotFound.jsx`.

#### 2. Pruebas Automatizadas (Testing)

- **Pila de Pruebas**: Configuración de entorno con **Vitest**, **React Testing Library**, **@testing-library/jest-dom** y **jsdom**.
- **Mock de Entorno**: Configuración global en `setupTests.js` que simula la API de `localStorage` y registra el entorno de JSX automático para el renderizado de componentes que incluyen modales.
- **Cobertura de Pruebas**: Elaboración del suite `App.test.jsx` con 3 pruebas que verifican:
  1. Renderizado adecuado del componente y encabezados de la vista principal (`Home.jsx`).
  2. Presencia de campos obligatorios e interacciones del formulario en la vista de consultas (`Contacto.jsx`).
  3. Despliegue de la vista de error 404 (`NotFound.jsx`) al acceder a rutas no configuradas o inválidas.

#### 3. Estructura de Rutas del Sistema

| Ruta | Vista / Componente | Propósito |
| :--- | :--- | :--- |
| `/` | `Home` | Página de bienvenida con historia, pilares y llamado a la acción. |
| `/catalogo` | `CatalogPage` | Catálogo interactivo de propiedades con filtros de búsqueda y conversión de divisas. |
| `/catalogo/:id` | `PropertyDetailPage` | Detalle exhaustivo del inmueble con galería, características, mapa y formulario. |
| `/nosotros` | `Nosotros` | Información institucional, misión, visión y trayectoria. |
| `/servicios` | `Servicios` | Listado de servicios ofrecidos e inspección multimedia de tomas aéreas. |
| `/contacto` | `Contacto` | Formulario de contacto directo y asesoría inmobiliaria. |
| `/admin` | `AdminLoginPage` | Formulario de autenticación para administradores. |
| `/admin/dashboard` | `AdminDashboardPage` | Panel protegido para administración CRUD de propiedades y usuarios. |
| `/*` | `NotFound` | Respuesta para rutas desconocidas o no registradas (Página 404). |

#### 4. Suite de Pruebas Automatizadas

| # | Prueba | Componente / Funcionalidad Evaluada | Resultado Esperado |
|---| :--- | :--- | :--- |
| 1 | `Renderizado de Home` | Componente `Home.jsx` | Renderiza el encabezado principal y las secciones informativas sin errores. |
| 2 | `Formulario de Contacto` | Componente `Contacto.jsx` | Renderiza los inputs de texto, correo y el botón de envío de consulta. |
| 3 | `Ruta no Reconocida (404)` | Componente `NotFound.jsx` | Muestra el código de error 404 y la opción de regresar al inicio ante rutas inválidas. |

</details>

---

## Tecnologías y Arquitectura del Sistema

### 1. Framework, Enrutamiento y Pruebas

- **React 19 & Vite 8**: Biblioteca UI y empaquetador de código de alto rendimiento.
- **React Router DOM v7**: Gestión de rutas, parámetros y navegación SPA.
- **Vitest & React Testing Library**: Ejecución de pruebas unitarias y de integración.
- **jsdom**: Simulación del DOM en el entorno de ejecución de Node.js.

### 2. UI, Componentes e Interacción

- **Bootstrap & Popper.js**: Layout responsivo y componentes UI (`bootstrap`, `@popperjs/core`).
- **Framer Motion**: Animaciones para componentes React (`framer-motion`).
- **Swiper & Lightbox**: Carruseles táctiles y galerías de imágenes a pantalla completa (`swiper`, `yet-another-react-lightbox`).

### 3. Estado Global y APIs

- **CurrencyContext**: Estado global para conversión de precios en tiempo real.
- **Leaflet & React Leaflet**: Integración de mapas geográficos e interactivos (`leaflet`, `react-leaflet`).
- **APIs Externas**: ExchangeRate API, OpenMeteo API, Gemini IA.

---

## Instrucciones de Instalación, Ejecución y Pruebas

### Prerrequisitos

- **Node.js** (v18.0.0 o superior recomendado)
- **npm** (incluido con Node.js)

### 1. Clonar el repositorio

```bash
git clone https://github.com/JozefBarquero/bienes-raices.git
cd bienes-raices/Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Cree un archivo `.env` tomando como referencia las variables de conexión a APIs externas:

```env
VITE_EXCHANGE_RATE_API_KEY=tu_api_key_aqui
```

---

## Ejecución del Proyecto

### Servidor de desarrollo (SPA)

```bash
npm run dev
```

Acceda en el navegador a `http://localhost:5173`.

### Ejecutar Pruebas Automatizadas (Testing)

```bash
npm run test
```

Este comando ejecutará el suite completo de Vitest (`vitest run`) y mostrará el estado de aprobación de las pruebas en la terminal.
