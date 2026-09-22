import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';




import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';




export default function PropertyGallery({ title, image, gallery = [] }) {


    const [indexLightbox, setIndexLightbox] = useState(-1);
    const hasMultiple = gallery && gallery.length > 1;



    return (


        <>
            <div className="mb-4">


                {hasMultiple ? (


                    <div className="ratio ratio-16x9 rounded-4 shadow-sm overflow-hidden">



                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            className="w-100 h-100"
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


                    </div>



                ) : (
                    <div className="ratio ratio-16x9 rounded-4 shadow-sm overflow-hidden">


                        <img
                            src={image}
                            alt={title}
                            className="w-100 h-100 object-fit-cover"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIndexLightbox(0)}
                        />
                    </div>


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