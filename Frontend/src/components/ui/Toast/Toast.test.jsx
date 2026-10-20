import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToastProvider, toast, useToast } from './index';

function TestComponent() {
    const { toast: hookToast } = useToast();
    return (
        <div>
            <button onClick={() => hookToast.success('Operación exitosa')}>
                Success
            </button>
            <button onClick={() => hookToast.error('Ha ocurrido un error')}>
                Error
            </button>
            <button onClick={() => hookToast.warning('Atención requerida')}>
                Warning
            </button>
            <button onClick={() => hookToast.info('Información general')}>
                Info
            </button>
        </div>
    );
}

describe('Sistema Toast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    test('renderiza toast de tipo success', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        act(() => {
            fireEvent.click(screen.getByText('Success'));
        });

        expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renderiza toast de tipo error con role alert', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        act(() => {
            fireEvent.click(screen.getByText('Error'));
        });

        expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('permite cerrar toast manualmente', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        act(() => {
            fireEvent.click(screen.getByText('Info'));
        });

        expect(screen.getByText('Información general')).toBeInTheDocument();

        const closeBtn = screen.getByLabelText('Cerrar notificación');

        act(() => {
            fireEvent.click(closeBtn);
            vi.advanceTimersByTime(350);
        });

        expect(screen.queryByText('Información general')).not.toBeInTheDocument();
    });

    test('funciona mediante singleton fuera de contexto React', () => {
        render(
            <ToastProvider>
                <div>App</div>
            </ToastProvider>
        );

        act(() => {
            toast.success('Mensaje desde singleton');
        });

        expect(screen.getByText('Mensaje desde singleton')).toBeInTheDocument();
    });

    test('deduplica mensajes idénticos consecutivos', () => {
        render(
            <ToastProvider>
                <div>App</div>
            </ToastProvider>
        );

        act(() => {
            toast.error('Error duplicado');
            toast.error('Error duplicado');
        });

        const elements = screen.getAllByText('Error duplicado');
        expect(elements).toHaveLength(1);
    });
});
