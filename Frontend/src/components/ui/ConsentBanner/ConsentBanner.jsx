import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsent } from '@/context/ConsentContext';
import { LiquidGlassButton } from '@/components/ui/LiquidGlass';
import '@/assets/styles/consent-banner.css';

export default function ConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, saveConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    preferences: false,
    thirdParty: false,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    saveConsent({
      necessary: true,
      analytics: preferences.analytics,
      preferences: preferences.preferences,
      thirdParty: preferences.thirdParty,
    });
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="consent-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="consent-banner-content">
          <div className="consent-banner-text">
            <h3 className="consent-banner-title">Valoramos tu privacidad</h3>
            <p className="consent-banner-desc">
              Utilizamos almacenamiento local y tecnologías similares para garantizar el funcionamiento del sitio, recordar tus preferencias y, con tu autorización, analizar el uso del sitio. Puedes aceptar todas, rechazar las no esenciales o configurarlas según tus preferencias. Más información en nuestra{' '}
              <a href="/politica-almacenamiento" className="consent-banner-link">Política de Cookies</a>.
            </p>
          </div>

          {showDetails && (
            <motion.div
              className="consent-banner-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="consent-option">
                <div>
                  <span className="consent-option-title">Estrictamente necesarias</span>
                  <span className="consent-option-desc">Siempre activas. Permiten el funcionamiento básico y la seguridad del sitio.</span>
                </div>
                <span className="consent-option-status">Obligatorias</span>
              </div>
              <div className="consent-option">
                <div>
                  <span className="consent-option-title">Analíticas</span>
                  <span className="consent-option-desc">Nos ayudan a entender cómo se usa el sitio para mejorarlo.</span>
                </div>
                <button
                  type="button"
                  className={`consent-toggle ${preferences.analytics ? 'active' : ''}`}
                  onClick={() => handleToggle('analytics')}
                  aria-pressed={preferences.analytics}
                />
              </div>
              <div className="consent-option">
                <div>
                  <span className="consent-option-title">Preferencias</span>
                  <span className="consent-option-desc">Permiten recordar tu moneda, tema y otras configuraciones.</span>
                </div>
                <button
                  type="button"
                  className={`consent-toggle ${preferences.preferences ? 'active' : ''}`}
                  onClick={() => handleToggle('preferences')}
                  aria-pressed={preferences.preferences}
                />
              </div>
              <div className="consent-option">
                <div>
                  <span className="consent-option-title">Terceros</span>
                  <span className="consent-option-desc">Servicios externos como mapas, IA o tipos de cambio.</span>
                </div>
                <button
                  type="button"
                  className={`consent-toggle ${preferences.thirdParty ? 'active' : ''}`}
                  onClick={() => handleToggle('thirdParty')}
                  aria-pressed={preferences.thirdParty}
                />
              </div>
            </motion.div>
          )}

          <div className="consent-banner-actions">
            <button
              type="button"
              className="consent-banner-btn consent-banner-btn--text"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? 'Ocultar preferencias' : 'Configurar'}
            </button>
            <LiquidGlassButton variant="ghost" onClick={rejectNonEssential} className="consent-banner-btn">
              Rechazar no esenciales
            </LiquidGlassButton>
            {showDetails ? (
              <LiquidGlassButton variant="primary" onClick={handleSavePreferences} className="consent-banner-btn">
                Guardar preferencias
              </LiquidGlassButton>
            ) : (
              <LiquidGlassButton variant="primary" onClick={acceptAll} className="consent-banner-btn">
                Aceptar todas
              </LiquidGlassButton>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}