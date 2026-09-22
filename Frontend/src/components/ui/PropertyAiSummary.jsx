import { useEffect, useState } from 'react';
import { getPropertyAiSummary } from '@/services/aiSummaryService';

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
    return <div className="p-4 border rounded bg-light">Generando análisis del entorno con IA...</div>;
  }

  if (!summary) return null;

  return (
    <div className="card my-4 border-info">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <span>Resumen Inteligente del Entorno</span>
        <small className="badge bg-light text-dark">Gemini AI + Open-Meteo</small>
      </div>
      <div className="card-body">
        <p className="card-text">{summary.text}</p>
        <hr />
        <div className="d-flex gap-3 text-muted small">
          <span>Max: {summary.stats.maxTempAvg}°C</span>
          <span>Min: {summary.stats.minTempAvg}°C</span>
          <span>Lluvia acum.: {summary.stats.totalRain} mm</span>
        </div>
      </div>
    </div>
  );
};