import '@testing-library/jest-dom';
import { vi } from 'vitest';




class IntersectionObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
}

global.IntersectionObserver = IntersectionObserverMock;
global.IntersectionObserverEntry = class {};







Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};