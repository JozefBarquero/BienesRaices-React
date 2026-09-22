import { useEffect, useState } from 'react';
import { getPropertyAiSummary } from '@/services/aiSummaryService';



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

      <div className="card my-4 border-info">


        <div className="card-body d-flex align-items-center gap-3">

          <div className="spinner-border text-info spinner-border-sm" role="status"></div>

          <span>Generando análisis del entorno con IA...</span>

        </div>


      </div>
    );


  }



  if (error) {

    return (

      <div className="card my-4 border-warning">

        <div className="card-body text-warning-emphasis">

          <strong>Análisis IA:</strong> {error}

        </div>

      </div>
    );
  }



  if (!summary) return null;



  return (

    <div className="card my-4 border-info">


      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">

        <span className="fw-bold">¿Por qué elegir esta propiedad? (Análisis IA)</span>
        <small className="badge bg-light text-dark">Gemini AI</small>


      </div>


      <div className="card-body">

        {summary.stats?.areaName && (

          <div className="mb-3">

            <strong>Ubicación detectada:</strong> {summary.stats.areaName}

          </div>

        )}



        <p className="card-text" style={{ whiteSpace: 'pre-line' }}>{summary.text}</p>

        <hr />

          <div className="d-flex gap-3 text-muted small justify-content-between align-items-center">

            <div className="m-6 d-flex gap-3">

              <span>Max: {summary.stats?.maxTempAvg}°C</span>
              <span>Min: {summary.stats?.minTempAvg}°C</span>
              <span>Lluvia acumulada: {summary.stats?.totalRain} mm</span>


            </div>

            <small className="text-muted small">La IA puede cometer errores.</small>
          </div>


          
      </div>
    </div>
  );
};