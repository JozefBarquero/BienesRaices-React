import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';

export default function PropertyGalleryInner({ title, image, gallery = [], indexLightbox, setIndexLightbox }) {
    const hasMultiple = gallery && gallery.length > 1;

    return (
        <>
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
                {hasMultiple ? (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        loop={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        className="w-100 h-100"
                        style={{ height: '100%' }}
                    >
                        {gallery.map((img, idx) => (
                            <SwiperSlide key={idx} className="w-100 h-100">
                                <img
                                    src={img}
                                    alt={`${title} - Foto ${idx + 1}`}
                                    className="w-100 h-100 object-fit-cover d-block"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIndexLightbox(idx)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <img
                        src={image}
                        alt={title}
                        className="w-100 h-100 object-fit-cover d-block"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIndexLightbox(0)}
                    />
                )}
            </div>

            <Lightbox
                open={indexLightbox >= 0}
                index={indexLightbox}
                close={() => setIndexLightbox(-1)}
                slides={(gallery || []).map((src) => ({ src }))}
            />
        </>
    );
}