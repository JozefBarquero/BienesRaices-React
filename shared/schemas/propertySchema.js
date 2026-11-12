import { z } from 'zod';

export const PropertySchema = z.object({
    titulo: z.string().trim().min(5, 'El título debe tener al menos 5 caracteres.').max(150, 'El título no puede exceder 150 caracteres.'),
    tipo_inmueble_id: z.coerce.number().int().positive('Debe seleccionar un tipo de inmueble válido.'),
    tipo_operacion: z.enum(['venta', 'alquiler', 'ambos']),
    precio: z.coerce.number().positive('El precio debe ser un número positivo mayor a 0.'),
    moneda: z.enum(['USD', 'CRC', 'EUR']).default('USD'),
    tipo_precio: z.enum(['fijo', 'negociable']).default('fijo'),
    habitaciones: z.coerce.number().int().min(0).nullable().optional(),
    banos: z.coerce.number().min(0).nullable().optional(),
    estacionamientos: z.coerce.number().int().min(0).default(0),
    area_construida: z.coerce.number().min(0).nullable().optional(),
    area_terreno: z.coerce.number().min(0).nullable().optional(),
    descripcion_corta: z.string().trim().max(300).nullable().optional().or(z.literal('')),
    descripcion_larga: z.string().trim().min(20, 'La descripción detallada debe tener al menos 20 caracteres.'),
    url_video: z.string().trim().url('URL de video inválida.').nullable().optional().or(z.literal('')),
    latitud: z.coerce.number().min(8.0, 'Latitud fuera del territorio nacional (8.0° a 11.3°).').max(11.3, 'Latitud fuera del territorio nacional (8.0° a 11.3°).').nullable().optional(),
    longitud: z.coerce.number().min(-86.0, 'Longitud fuera del territorio nacional (-86.0° a -82.5°).').max(-82.5, 'Longitud fuera del territorio nacional (-86.0° a -82.5°).').nullable().optional(),
    provincia: z.string().trim().min(1, 'La provincia es requerida.').optional(),
    canton: z.string().trim().min(1, 'El cantón es requerido.').optional(),
    distrito: z.string().trim().min(1, 'El distrito es requerido.').optional(),
    direccion_exacta: z.string().trim().min(5, 'La dirección exacta debe tener al menos 5 caracteres.'),
    propietario_id: z.coerce.number().int().positive().nullable().optional(),
    destacada: z.union([z.boolean(), z.string().transform(v => v === 'true' || v === true)]).default(false),
    activa: z.union([z.boolean(), z.string().transform(v => v === 'true' || v === true)]).default(true)
}).refine((data) => {
    if (data.area_construida && data.area_terreno && data.area_terreno > 0) {
        return data.area_construida <= data.area_terreno;
    }
    return true;
}, {
    message: 'El área construida no puede ser mayor que el área total del terreno.',
    path: ['area_construida']
});

