import { useEffect, useState } from 'react';
import { getPropertyAiSummary } from '@/services/aiSummaryService';
import { LiquidGlassPanel } from '@/components/ui/LiquidGlass';

export const PropertyAiSummary = ({ propertyId, lat, lng, type }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;

    let isMounted = true;
    setLoading(true);

    getPropertyAiSummary(propertyId, lat, lng, type).then((data) => {
      if (isMounted) {
        setSummary(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [propertyId, lat, lng, type]);

  if (loading) {
    return (
      <LiquidGlassPanel liquid className="prop-ai-loading">
        <span className="prop-ai-loading-spinner" aria-hidden="true" />
        <span>Generando análisis del entorno con IA...</span>
      </LiquidGlassPanel>
    );
  }

  if (!summary) return null;

  return (
    <LiquidGlassPanel liquid className="prop-ai">
      <div className="prop-ai-header">
        <h3 className="prop-ai-title">Resumen Inteligente del Entorno</h3>
        <span className="prop-ai-badge">Gemini AI + Open-Meteo</span>
      </div>

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
          <span className="prop-ai-stat-label">Lluvia acum.</span>
          {summary.stats?.totalRain} mm
        </span>
      </div>
    </LiquidGlassPanel>
  );
};
