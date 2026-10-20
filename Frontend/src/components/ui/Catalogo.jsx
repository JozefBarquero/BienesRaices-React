import { motion } from 'framer-motion';
import { propiedades } from '@/data/propiedades';
import PropiedadCard from './PropiedadCard';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

export default function Catalogo() {
    return (
        <section className="py-5">
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeUp} className="section-head">
                    <span className="section-badge">Selección Curada</span>
                    <h2 className="section-title">Nuestras Propiedades Destacadas</h2>
                    <p className="section-subtitle">
                        Una muestra de los inmuebles que representamos, elegidos por su ubicación, valor y potencial.
                    </p>
                </motion.div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {propiedades.map((prop) => (
                        <motion.div key={prop.id} className="col" variants={fadeUp}>
                            <PropiedadCard propiedad={prop} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
