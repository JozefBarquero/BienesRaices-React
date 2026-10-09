import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <motion.div 
            className="container text-center py-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        >
            <motion.h1 
                className="display-1 fw-bold text-primary"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
            >
                404
            </motion.h1>
            <h2 className="mb-3">Página no encontrada</h2>
            <p className="lead text-secondary mb-4">
                La ruta que intentas visitar no existe o ha sido movida.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-inline-block">
                <Link to="/" className="btn btn-primary btn-lg">
                    Volver al Inicio
                </Link>
            </motion.div>
        </motion.div>
    );
}