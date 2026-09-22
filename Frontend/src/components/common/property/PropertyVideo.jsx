import { getEmbedUrl } from '@/utils/urlConvert';

export default function PropertyVideo({ url, title }) {


    if (!url) return null;



    return (

        <div className="mb-5">

            <h3 className="fw-bold mb-3">Video de la Propiedad</h3>

            <div className="ratio ratio-16x9 rounded-4 shadow-sm overflow-hidden">
                
                <iframe
                    src={getEmbedUrl(url)}
                    title={`Video de ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                
                ></iframe>
            
            </div>
        
        
        </div>
    );
}