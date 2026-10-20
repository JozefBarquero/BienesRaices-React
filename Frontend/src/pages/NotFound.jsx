import { motion } from 'framer-motion';
import { LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function NotFound() {
    return (
        <motion.div
            className="notfound-wrap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
        >
            <div className="notfound-card lg lg--liquid">
                <motion.h1
                    className="notfound-code"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
                >
                    404
                </motion.h1>
                <h2 className="notfound-title">Página no encontrada</h2>
                <p className="notfound-text">
                    La ruta que intentas visitar no existe o ha sido movida.
                </p>
                <LiquidGlassButton variant="primary" to="/">
                    Volver al Inicio
                </LiquidGlassButton>
            </div>
        </motion.div>
    );
}
