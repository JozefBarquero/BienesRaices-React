import { lazy, Suspense, useState } from 'react';

const PropertyGalleryInner = lazy(() => import('./PropertyGalleryInner'));

export default function PropertyGallery({ title, image, gallery = [] }) {
    const [indexLightbox, setIndexLightbox] = useState(-1);
    const fallbackSrc = image || gallery[0] || '';

    return (
        <div className="gallery-frame lg lg--liquid w-100 overflow-hidden">
            <div className="ratio ratio-16x9 position-relative">
                <Suspense
                    fallback={
                        <img
                            src={fallbackSrc}
                            alt={title}
                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover d-block"
                            onClick={() => setIndexLightbox(0)}
                        />
                    }
                >
                    <PropertyGalleryInner
                        title={title}
                        image={image}
                        gallery={gallery}
                        indexLightbox={indexLightbox}
                        setIndexLightbox={setIndexLightbox}
                    />
                </Suspense>
            </div>
        </div>
    );
}