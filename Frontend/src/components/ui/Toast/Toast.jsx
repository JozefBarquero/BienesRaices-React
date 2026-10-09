import React, { useState, useEffect, useRef } from 'react';

const ToastIcons = {
    success: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    )
};

export default function Toast({ toast, onClose }) {
    const { id, type = 'info', title, message, description, duration = 4000, action } = toast;
    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const remainingRef = useRef(duration);
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef(null);

    const handleDismiss = () => {
        if (isExiting) return;
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    useEffect(() => {
        if (duration <= 0) return;

        if (isPaused) {
            remainingRef.current -= Date.now() - startTimeRef.current;
            clearTimeout(timerRef.current);
        } else {
            startTimeRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                handleDismiss();
            }, Math.max(0, remainingRef.current));
        }

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [isPaused, duration]);

    const displayMessage = message || description;
    const role = type === 'error' || type === 'warning' ? 'alert' : 'status';

    return (
        <div
            id={`toast-${id}`}
            role={role}
            className={`toast-item toast-item-${type} ${isExiting ? 'toast-exiting' : ''} ${isPaused ? 'is-paused' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="toast-icon-wrapper">
                {ToastIcons[type] || ToastIcons.info}
            </div>

            <div className="toast-content">
                {title && <h5 className="toast-title">{title}</h5>}
                {displayMessage && <p className="toast-message">{displayMessage}</p>}
                {action && (
                    <div className="toast-action">
                        <button
                            type="button"
                            className="toast-action-btn"
                            onClick={() => {
                                if (action.onClick) action.onClick();
                                handleDismiss();
                            }}
                        >
                            {action.label}
                        </button>
                    </div>
                )}
            </div>

            <button
                type="button"
                className="toast-close-btn"
                onClick={handleDismiss}
                aria-label="Cerrar notificación"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {duration > 0 && (
                <div
                    className="toast-progress"
                    style={{ animationDuration: `${duration}ms` }}
                />
            )}
        </div>
    );
}
