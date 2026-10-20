import { getEmbedUrl } from '@/utils/urlConvert';

export default function PropertyVideo({ url, title }) {
    if (!url) return null;

    return (
        <div>
            <h3 className="prop-video-title">Video de la Propiedad</h3>

            <div className="ratio ratio-16x9 prop-video-frame">
                <iframe
                    src={getEmbedUrl(url)}
                    title={`Video de ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}