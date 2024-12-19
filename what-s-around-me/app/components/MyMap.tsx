'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";

interface MapProps {
  lat: number | null;
  lon: number | null;
  area: number;
  place: { lat: number; lon: number; tags: Record<string, string> } | null;
}

const MyMap: React.FC<MapProps> = ({ lat, lon, area, place }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || lat === null || lon === null) return;

    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([lat, lon], 16);

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add Main Marker
    const mainMarker = L.marker([lat, lon]).addTo(map);
    mainMarker.bindPopup('You are here').openPopup();

    // Add Circle
    const circle = L.circle([lat, lon], { radius: area }).addTo(map);

    // Add Place Marker
    if (place) {
      const placeMarker = L.marker([place.lat, place.lon]).addTo(map);
      placeMarker.bindPopup(
        place.tags.name ||
          place.tags['name:ml'] ||
          place.tags['name:fr'] ||
          place.tags['name:en'] ||
          place.tags.amenity ||
          place.tags.shop ||
          place.tags.tourism ||
          place.tags.office ||
          place.tags.boundary ||
          place.tags.leisure ||
          place.tags.natural ||
          place.tags.sport ||
          'Unknown Place'
      );
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(lat, lon), // Start point
          L.latLng(place.lat, place.lon), // End point
        ],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
        },
        addWaypoints: false,
      }).addTo(map);
    }

    // Cleanup on unmount
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
      map.remove();
    };
    
  }, [lat, lon, area, place]);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default MyMap;
