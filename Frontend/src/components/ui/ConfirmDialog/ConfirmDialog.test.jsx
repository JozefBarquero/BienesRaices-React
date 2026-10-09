import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ConfirmDialogProvider, confirmDialog } from './index';

function TestConfirmComponent({ onResult }) {
    const handleAction = async () => {
        const res = await confirmDialog({
            title: '¿Confirmar eliminación?',
            message: 'Esta acción no se puede deshacer',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            variant: 'danger'
        });
        onResult(res);
    };

    return <button onClick={handleAction}>Eliminar</button>;
}

describe('Sistema ConfirmDialog', () => {
    test('abre el modal y resuelve true al confirmar', async () => {
        const handleResult = vi.fn();

        render(
            <ConfirmDialogProvider>
                <TestConfirmComponent onResult={handleResult} />
            </ConfirmDialogProvider>
        );

        fireEvent.click(screen.getByText('Eliminar'));

        expect(screen.getByText('¿Confirmar eliminación?')).toBeInTheDocument();
        expect(screen.getByText('Esta acción no se puede deshacer')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Sí, eliminar'));

        await act(async () => {
            await new Promise((r) => setTimeout(r, 250));
        });

        expect(handleResult).toHaveBeenCalledWith(true);
    });

    test('resuelve false al cancelar', async () => {
        const handleResult = vi.fn();

        render(
            <ConfirmDialogProvider>
                <TestConfirmComponent onResult={handleResult} />
            </ConfirmDialogProvider>
        );

        fireEvent.click(screen.getByText('Eliminar'));
        fireEvent.click(screen.getByText('Cancelar'));

        await act(async () => {
            await new Promise((r) => setTimeout(r, 250));
        });

        expect(handleResult).toHaveBeenCalledWith(false);
    });

    test('resuelve false al presionar Escape', async () => {
        const handleResult = vi.fn();

        render(
            <ConfirmDialogProvider>
                <TestConfirmComponent onResult={handleResult} />
            </ConfirmDialogProvider>
        );

        fireEvent.click(screen.getByText('Eliminar'));
        fireEvent.keyDown(window, { key: 'Escape' });

        await act(async () => {
            await new Promise((r) => setTimeout(r, 250));
        });

        expect(handleResult).toHaveBeenCalledWith(false);
    });
});
