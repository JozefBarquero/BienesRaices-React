# Sistema de Notificaciones Toast

Sistema ligero, accesible y responsivo de notificaciones flotantes diseñado para el proyecto Bienes Raíces. Construido con React Context, CSS nativo y compatible con Bootstrap 5 y el tema claro/oscuro del proyecto.

## Características

- 4 tipos de notificación: `success`, `error`, `warning`, `info`.
- Íconos SVG dedicados y bordes temáticos distintivos por tipo.
- Autocierre configurable (4s para success/info, 6s para warning/error).
- Pausa automática de tiempo al colocar el cursor encima (hover).
- Barra de progreso visual sincronizada con la duración.
- Cola FIFO con límite configurable de elementos visibles simultáneos (5).
- Prevención automática de duplicados en ráfagas (deduplicación por mensaje).
- Accesibilidad ARIA (`aria-live="polite"`, roles `alert`/`status`, botón accesible).
- Animaciones fluidas que respetan `prefers-reduced-motion`.
- Totalmente compatible con modo claro y oscuro (`theme.css`).
- Uso como hook (`useToast`) en componentes React o como singleton directo en archivos externos (`api.js`).

## Instalación y Configuración

El provider se monta en la raíz de la aplicación (`main.jsx` o `App.jsx`):

```jsx
import { ToastProvider } from '@/components/ui/Toast';

<ToastProvider>
    <App />
</ToastProvider>
```

## Uso en Componentes React (Hook)

```jsx
import { useToast } from '@/components/ui/Toast';

export default function MiComponente() {
    const { toast } = useToast();

    const guardar = async () => {
        try {
            await guardarDatos();
            toast.success('Cambios guardados con éxito');
        } catch (err) {
            toast.error(err.message, { title: 'Error al guardar' });
        }
    };

    return <button onClick={guardar}>Guardar</button>;
}
```

## Uso fuera de React (Singleton)

Ideal para clientes HTTP, servicios o interceptores (ej. `services/api.js`):

```javascript
import { toast } from '@/components/ui/Toast';

toast.error('No se pudo conectar con el servidor.');
```

## API de Métodos

- `toast.success(message, options)`
- `toast.error(message, options)`
- `toast.warning(message, options)`
- `toast.info(message, options)`
- `toast.dismiss(id)`

### Opciones Disponibles (`options`)

| Opción | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `undefined` | Título en negrita destacado en la cabecera. |
| `duration` | `number` | 4000 o 6000 | Duración en milisegundos antes del autocierre. |
| `action` | `{ label, onClick }` | `undefined` | Botón de acción interactivo secundario. |
