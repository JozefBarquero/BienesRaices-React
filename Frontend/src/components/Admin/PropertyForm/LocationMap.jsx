import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



const defaultIcon = L.icon({

    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]

});
L.Marker.prototype.options.icon = defaultIcon;




export default function LocationMap({ lat, lng, onLocationChange }) {


    const defaultPosition = [9.9281, -84.0905];
    const position = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) 
        ? [parseFloat(lat), parseFloat(lng)] 
        : defaultPosition;



    function MapEvents() {

        const map = useMapEvents({
            click(e) {
                onLocationChange(e.latlng.lat, e.latlng.lng);
            },
        });


        useEffect(() => {

            if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
                map.flyTo([parseFloat(lat), parseFloat(lng)], map.getZoom());
            }

        }, [lat, lng, map]);


        return null;
    }




    return (


        <MapContainer center={position} zoom={13} style={{ height: '350px', width: '100%', borderRadius: '0.375rem', zIndex: 0 }}>


            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && (
                <Marker position={position} />
            )}
            <MapEvents />

            
        </MapContainer>


    );
}