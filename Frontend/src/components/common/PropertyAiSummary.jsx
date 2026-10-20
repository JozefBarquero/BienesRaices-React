import { useEffect, useState } from 'react';
import { getPropertyAiSummary } from '@/services/aiSummaryService';
import { LiquidGlassPanel } from '@/components/ui/LiquidGlass';

const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const PropertyAiSummary = ({ propertyId, lat, lng, type, operation }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getPropertyAiSummary(propertyId, lat, lng, type, operation)
      .then((data) => {
        if (isMounted) {
          if (data && data.text) {
            setSummary(data);
          } else {
            setError('No se pudo obtener la información de la IA.');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al conectar con el servicio de IA.');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [propertyId, lat, lng, type, operation]);

  if (!lat || !lng) return null;

  if (loading) {
    return (
      <LiquidGlassPanel liquid className="prop-ai-loading">
        <span className="prop-ai-loading-spinner" aria-hidden="true" />
        <span>Generando análisis del entorno con IA...</span>
      </LiquidGlassPanel>
    );
  }

  if (error) {
    return (
      <div className="prop-ai-error">
        <strong>Análisis IA:</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <LiquidGlassPanel liquid className="prop-ai">
      <div className="prop-ai-header">
        <h3 className="prop-ai-title">
          <span className="prop-ai-icon">
            <IconSparkle />
          </span>
          ¿Por qué elegir esta propiedad?
        </h3>
        <span className="prop-ai-badge">Gemini AI</span>
      </div>

      {summary.stats?.areaName && (
        <div className="prop-ai-area">
          <strong>Ubicación detectada:</strong>
          <span>{summary.stats.areaName}</span>
        </div>
      )}

      <p className="prop-ai-text">{summary.text}</p>

      <div className="prop-ai-stats">
        <span className="prop-ai-stat">
          <span className="prop-ai-stat-label">Max</span>
          {summary.stats?.maxTempAvg}°C
        </span>
        <span className="prop-ai-stat">
          <span className="prop-ai-stat-label">Min</span>
          {summary.stats?.minTempAvg}°C
        </span>
        <span className="prop-ai-stat">
          <span className="prop-ai-stat-label">Lluvia</span>
          {summary.stats?.totalRain} mm
        </span>
      </div>

      <div className="prop-ai-foot">
        La IA puede cometer errores.
      </div>
    </LiquidGlassPanel>
  );
};
