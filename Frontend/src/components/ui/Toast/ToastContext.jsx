import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext(null);

const DEFAULT_DURATIONS = {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 6000
};

const MAX_VISIBLE_TOASTS = 5;

let activeToastDispatcher = null;
let activeToastDismiss = null;
const earlyQueue = [];
const recentToasts = new Map();

const deduplicateToast = (type, message) => {
    const key = `${type}:${message}`;
    const now = Date.now();
    const lastTime = recentToasts.get(key);
    if (lastTime && now - lastTime < 1500) {
        return true;
    }
    recentToasts.set(key, now);
    if (recentToasts.size > 50) {
        const oldestKey = recentToasts.keys().next().value;
        recentToasts.delete(oldestKey);
    }
    return false;
};

const dispatchToast = (type, messageOrOptions, maybeOptions) => {
    let options = {};
    let message = '';

    if (typeof messageOrOptions === 'string') {
        message = messageOrOptions;
        options = maybeOptions || {};
    } else if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
        options = messageOrOptions;
        message = options.message || options.description || '';
    }

    if (deduplicateToast(type, message)) {
        return null;
    }

    const duration = options.duration !== undefined ? options.duration : DEFAULT_DURATIONS[type] || 4000;
    const toastData = {
        id: options.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type,
        message,
        title: options.title,
        duration,
        action: options.action
    };

    if (activeToastDispatcher) {
        activeToastDispatcher(toastData);
    } else {
        earlyQueue.push(toastData);
    }

    return toastData.id;
};

export const toast = {
    success: (msg, opts) => dispatchToast('success', msg, opts),
    error: (msg, opts) => dispatchToast('error', msg, opts),
    warning: (msg, opts) => dispatchToast('warning', msg, opts),
    info: (msg, opts) => dispatchToast('info', msg, opts),
    show: (opts) => dispatchToast(opts?.type || 'info', opts),
    dismiss: (id) => {
        if (activeToastDismiss) {
            activeToastDismiss(id);
        }
    }
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const queueRef = useRef([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => {
            const next = prev.filter((t) => t.id !== id);
            if (queueRef.current.length > 0 && next.length < MAX_VISIBLE_TOASTS) {
                const [nextItem, ...remaining] = queueRef.current;
                queueRef.current = remaining;
                return [...next, nextItem];
            }
            return next;
        });
    }, []);

    const addToast = useCallback((toastItem) => {
        setToasts((prev) => {
            if (prev.length >= MAX_VISIBLE_TOASTS) {
                queueRef.current.push(toastItem);
                return prev;
            }
            return [...prev, toastItem];
        });
    }, []);

    useEffect(() => {
        activeToastDispatcher = addToast;
        activeToastDismiss = removeToast;

        if (earlyQueue.length > 0) {
            earlyQueue.forEach((item) => addToast(item));
            earlyQueue.length = 0;
        }

        return () => {
            activeToastDispatcher = null;
            activeToastDismiss = null;
        };
    }, [addToast, removeToast]);

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        return {
            toast,
            addToast: (t) => toast.show(t),
            removeToast: (id) => toast.dismiss(id)
        };
    }
    return context;
}
