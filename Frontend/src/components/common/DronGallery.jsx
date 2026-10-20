import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';

export default function DronGallery({ photos, indexLightbox, setIndexLightbox }) {
    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
            >
                {photos.map((foto, idx) => (
                    <SwiperSlide key={idx}>
                        <motion.img
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.5 }}
                            src={foto.src}
                            alt={foto.alt}
                            onClick={() => setIndexLightbox(idx)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                display: 'block',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <Lightbox
                open={indexLightbox >= 0}
                index={indexLightbox}
                close={() => setIndexLightbox(-1)}
                slides={photos.map((f) => ({ src: f.src, alt: f.alt }))}
            />
        </>
    );
}