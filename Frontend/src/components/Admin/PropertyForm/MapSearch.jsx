import React, { useState } from 'react';



export default function MapSearch({ onLocationChange }) {


    const [query, setQuery] = useState('');



    const search = async () => {


        if (!query) return;

        try {

            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                onLocationChange(data[0].lat, data[0].lon);
            }
        } catch (error) {}


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
                onChange={e => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown} 
            />


            <button className="btn btn-outline-primary" type="button" onClick={search}>
                Buscar
            </button>

            
        </div>
    );
}