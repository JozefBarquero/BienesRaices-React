import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const ConfirmDialogContext = createContext(null);

let activeConfirmHandler = null;

export const confirmDialog = (options = {}) => {
    if (activeConfirmHandler) {
        return activeConfirmHandler(options);
    }
    return Promise.resolve(false);
};

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        return confirmDialog;
    }
    return context.confirmDialog;
};

const DialogIcons = {
    danger: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    )
};

export function ConfirmDialogProvider({ children }) {
    const [state, setState] = useState(null);
    const [isShowing, setIsShowing] = useState(false);
    const resolverRef = useRef(null);
    const confirmBtnRef = useRef(null);

    const closeDialog = useCallback((result) => {
        setIsShowing(false);
        setTimeout(() => {
            if (resolverRef.current) {
                resolverRef.current(result);
                resolverRef.current = null;
            }
            setState(null);
        }, 200);
    }, []);

    const openConfirm = useCallback((options) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setState({
                title: options.title || 'Confirmación',
                message: options.message || '',
                confirmText: options.confirmText || 'Confirmar',
                cancelText: options.cancelText || 'Cancelar',
                variant: options.variant || 'danger'
            });
            setTimeout(() => {
                setIsShowing(true);
            }, 10);
        });
    }, []);

    useEffect(() => {
        activeConfirmHandler = openConfirm;
        return () => {
            activeConfirmHandler = null;
        };
    }, [openConfirm]);

    useEffect(() => {
        if (!state) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDialog(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state, closeDialog]);

    useEffect(() => {
        if (isShowing && confirmBtnRef.current) {
            confirmBtnRef.current.focus();
        }
    }, [isShowing]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeDialog(false);
        }
    };

    const variant = state?.variant || 'danger';
    const confirmBtnClass = variant === 'danger'
        ? 'btn-danger'
        : variant === 'warning'
            ? 'btn-warning'
            : 'btn-primary';

    const iconBadgeStyle = variant === 'danger'
        ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }
        : variant === 'warning'
            ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }
            : { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' };

    return (
        <ConfirmDialogContext.Provider value={{ confirmDialog: openConfirm }}>
            {children}

            {state && (
                <div
                    id="confirmDialogModal"
                    className={`modal-overlay ${isShowing ? 'show' : ''}`}
                    onClick={handleBackdropClick}
                    role="presentation"
                >
                    <div
                        className="modal-content"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirmDialogTitle"
                        aria-describedby="confirmDialogMessage"
                    >
                        <div className="modal-icon-badge" style={iconBadgeStyle}>
                            {DialogIcons[variant] || DialogIcons.info}
                        </div>

                        <h3 id="confirmDialogTitle" className="title-tertiary">
                            {state.title}
                        </h3>

                        {state.message && (
                            <p id="confirmDialogMessage" className="text-body mb-4">
                                {state.message}
                            </p>
                        )}

                        <div className="d-flex justify-content-center gap-3 w-100 mt-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-semibold flex-fill"
                                onClick={() => closeDialog(false)}
                            >
                                {state.cancelText}
                            </button>

                            <button
                                ref={confirmBtnRef}
                                type="button"
                                className={`btn ${confirmBtnClass} px-4 py-2 rounded-3 fw-semibold text-white flex-fill shadow-sm`}
                                onClick={() => closeDialog(true)}
                            >
                                {state.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmDialogContext.Provider>
    );
}
