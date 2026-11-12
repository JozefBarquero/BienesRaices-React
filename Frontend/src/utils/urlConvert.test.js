import { describe, it, expect } from 'vitest';
import { getEmbedUrl } from './urlConvert';

describe('urlConvert - getEmbedUrl', () => {
    it('convierte URLs de YouTube estándar a embed seguro', () => {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        expect(getEmbedUrl(url)).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    });

    it('convierte URLs cortas de youtu.be a embed seguro', () => {
        const url = 'https://youtu.be/dQw4w9WgXcQ';
        expect(getEmbedUrl(url)).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    });

    it('convierte URLs de Vimeo a embed seguro', () => {
        const url = 'https://vimeo.com/123456789';
        expect(getEmbedUrl(url)).toBe('https://player.vimeo.com/video/123456789');
    });

    it('neutraliza inyecciones XSS y cadenas javascript:', () => {
        const malicious = 'javascript:alert(document.cookie)';
        expect(getEmbedUrl(malicious)).toBe('');
    });

    it('retorna cadena vacía ante URLs de dominios no autorizados', () => {
        const untrusted = 'https://malicious-phishing.com/video.mp4';
        expect(getEmbedUrl(untrusted)).toBe('');
    });

    it('retorna cadena vacía ante entradas nulas o vacías', () => {
        expect(getEmbedUrl('')).toBe('');
        expect(getEmbedUrl(null)).toBe('');
        expect(getEmbedUrl(undefined)).toBe('');
    });
});

