export const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const clean = url.trim();
    const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
        return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return '';
};
