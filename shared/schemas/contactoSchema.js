import { z } from 'zod';

export const ContactoSchema = z.object({
    propiedad_id: z.coerce.number().int().positive().nullable().optional(),
    nombre_cliente: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(150),
    email_cliente: z.string().trim().email('Correo electrónico inválido.'),
    telefono_cliente: z.string().trim().max(30).nullable().optional().or(z.literal('')),
    mensaje: z.string().trim().min(5, 'El mensaje debe tener al menos 5 caracteres.').max(5000, 'El mensaje excede el límite permitido.'),
    origen: z.string().trim().default('web'),
    prioridad: z.enum(['baja', 'media', 'alta']).default('media')
});

