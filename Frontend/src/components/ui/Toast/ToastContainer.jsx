import React from 'react';
import Toast from './Toast';
import './toast.css';

export default function ToastContainer({ toasts = [], onClose }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <aside
            id="toast-container"
            aria-live="polite"
            aria-atomic="true"
            className="toast-container-custom"
        >
            {toasts.map((item) => (
                <Toast key={item.id} toast={item} onClose={onClose} />
            ))}
        </aside>
    );
}
