import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Home from '@/pages/Home';
import Contacto from '@/pages/Contacto';
import NotFound from '@/pages/NotFound';

describe('Pruebas del Front Office - Entregable #3', () => {

    // Prueba 1: Vista Inicio
    test('1. Renderizado de inicio', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByText(/Sobre Nosotros/i)).toBeInTheDocument();
        expect(screen.getByText(/Nuestra Historia/i)).toBeInTheDocument();
    });

    // 2: Vista Contacto
    test('2. Renderizado de contacto y sus campos.', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        );
        expect(screen.getByText(/Ponte en Contacto/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Tu nombre completo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Enviar Consulta/i })).toBeInTheDocument();
    });

    // 3: Ruta no existente
    test('3. Vista para ruta inexistente.', () => {
        render(
            <MemoryRouter initialEntries={['/ruta-falsa']}>
                <NotFound />
            </MemoryRouter>
        );
        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/Página no encontrada/i)).toBeInTheDocument();
    });
});