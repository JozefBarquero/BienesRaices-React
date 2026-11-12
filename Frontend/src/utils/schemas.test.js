import { describe, it, expect } from 'vitest';
import { PropertySchema, ContactoSchema } from '@bienesraices/shared';

describe('PropertySchema', () => {
    const validData = {
        titulo: 'Hermosa Casa en San José',
        tipo_inmueble_id: 1,
        tipo_operacion: 'venta',
        precio: 250000,
        moneda: 'USD',
        tipo_precio: 'fijo',
        habitaciones: 3,
        banos: 2,
        estacionamientos: 2,
        area_construida: 180,
        area_terreno: 300,
        descripcion_larga: 'Excelente propiedad ubicada en zona residencial tranquila con amplio jardín y cochera.',
        direccion_exacta: 'Avenida Central, Calle 5',
        latitud: 9.93,
        longitud: -84.08,
        provincia: 'San José',
        canton: 'San José',
        distrito: 'Carmen'
    };

    it('valida exitosamente una propiedad con datos correctos', () => {
        const res = PropertySchema.safeParse(validData);
        expect(res.success).toBe(true);
    });

    it('rechaza precios negativos o cero', () => {
        const resZero = PropertySchema.safeParse({ ...validData, precio: 0 });
        expect(resZero.success).toBe(false);

        const resNeg = PropertySchema.safeParse({ ...validData, precio: -100 });
        expect(resNeg.success).toBe(false);
    });

    it('rechaza cuando el área construida supera el área del terreno', () => {
        const res = PropertySchema.safeParse({
            ...validData,
            area_construida: 400,
            area_terreno: 200
        });
        expect(res.success).toBe(false);
    });

    it('rechaza coordenadas fuera de Costa Rica', () => {
        const res = PropertySchema.safeParse({
            ...validData,
            latitud: 45.0,
            longitud: -120.0
        });
        expect(res.success).toBe(false);
    });
});

describe('ContactoSchema', () => {
    it('valida exitosamente un mensaje de contacto correcto', () => {
        const res = ContactoSchema.safeParse({
            nombre_cliente: 'Juan Pérez',
            email_cliente: 'juan@example.com',
            mensaje: 'Deseo coordinar una visita a la propiedad.',
            prioridad: 'alta'
        });
        expect(res.success).toBe(true);
    });

    it('rechaza correos electrónicos inválidos', () => {
        const res = ContactoSchema.safeParse({
            nombre_cliente: 'Juan Pérez',
            email_cliente: 'correo-invalido',
            mensaje: 'Deseo coordinar una visita.'
        });
        expect(res.success).toBe(false);
    });
});

