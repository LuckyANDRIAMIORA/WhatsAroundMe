'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import L from 'leaflet';
import Image from 'next/image';

interface updateMapProps {
  lat: number | null,
  lon: number | null
}

const customIcon = L.divIcon({
  className: 'custom-icon',
  html: `
      <Image src="/marker-icon.svg" alt='*' width={15} height={15}/>
    `,
});

const UpdateMapView: React.FC<updateMapProps> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {

    map.setView([lat, lon], map.getZoom());

  }, [lat, lon, map])

  return null

}

interface MapProps extends updateMapProps {
  area: number,
  places: [any] | []
}

const Map: React.FC<MapProps> = ({ lat, lon, area, places = [] }) => {

  return (
    <>
      <MapContainer center={[lat, lon]} zoom={16} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
        />
        <Marker position={[lat, lon]}>
          <Popup>You are here</Popup>
        </Marker>
        <Circle center={[lat, lon]} radius={area} />
        <UpdateMapView lat={lat} lon={lon} />
        {places.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIcon}>
            <Popup> {place.tags.name || place.tags["name:ml"] || place.tags["name:fr"] || place.tags["name:en"] || place.tags.amenity || place.tags.shop || place.tags.tourism || 'Unknown Place'}</Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </>
  );
};

export default Map;
