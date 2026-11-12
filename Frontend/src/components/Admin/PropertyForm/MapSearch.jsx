import React, { useState } from 'react';
import { toast } from '@/components/ui/Toast';

export default function MapSearch({ onLocationChange }) {
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const search = async () => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'BienesRaicesApp/1.0 (contact@bienesraices.com)'
                    }
                }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                onLocationChange(data[0].lat, data[0].lon);
                toast.success('Ubicación localizada en el mapa.');
            } else {
                toast.info('No se encontraron coordenadas para la búsqueda especificada.');
            }
        } catch {
            toast.error('Error de red al consultar el servicio de geocodificación.');
        } finally {
            setSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            search();
        }
    };

    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Buscar lugar en el mapa (ej. Liberia, Guanacaste)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={searching}
            />

            <button
                type="button"
                className="admin-action-btn admin-action-btn--primary"
                onClick={search}
                disabled={searching}
            >
                {searching ? 'Buscando...' : 'Buscar'}
            </button>
        </div>
    );
}
