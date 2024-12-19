'use client';

import { useEffect, useState } from "react";
import { itemIcons } from "./utils/IconMap";
import dynamic from "next/dynamic";
const MyMap = dynamic(() => import('./components/MyMap'), { ssr: false });

const getPlaceIcon = (place: { tags: { [key: string]: string } }) => {
  const tags = place.tags;

  // Return the first matching icon based on available tags
  return (
    itemIcons.get("amenity")?.get(tags.amenity) ||
    itemIcons.get("shop")?.get(tags.shop) ||
    itemIcons.get("tourism")?.get(tags.tourism) ||
    itemIcons.get("natural")?.get(tags.natural) ||
    itemIcons.get("leisure")?.get(tags.leisure) ||
    itemIcons.get("office")?.get(tags.office) ||
    itemIcons.get("sport")?.get(tags.sport) ||
    "❓"
  );
};

export default function Home() {
  const [lat, setLat] = useState<number | null>(0);
  const [lon, setLon] = useState<number | null>(0);
  const [OSM, setOSM] = useState<[]>([])
  const [placeSelected, setPlaceSelected] = useState<{ lat: number, lon: number, tags: {} } | null>(null);
  const [area, setArea] = useState<number>(500)
  const [distanceMap, setDistanceMap] = useState<Map<string, number>>(new Map<string, number>());


  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      return;
    }

    try {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (pos.coords.latitude !== lat || pos.coords.longitude !== lon) {
            setLat(pos.coords.latitude);
            setLon(pos.coords.longitude);
          }
        },
        (err) => {
          console.log(err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 100000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);

    } catch (error) {
      console.log(error)
    }

  }, [])

  useEffect(() => {
    if (lat && lon && area) {
      fetchOSM();
    }

  }, [lat, lon, area])

  const fetchOSM = async () => {
    const query = `
    [out:json];
    (
        node(around:${area}, ${lat}, ${lon}) ["amenity"~"bus_stop|hospital|restaurant|police|school|bank|tourism|hostel|place_of_worship"];
        node(around:${area}, ${lat}, ${lon}) ["shop"~"supermarket|convenience|mall"];
        node(around:${area}, ${lat}, ${lon}) ["tourism"="attraction"];
        node(around:${area}, ${lat}, ${lon}) ["office"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="post_office"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="government"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="bank"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="school"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="restaurant"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="fuel"];  
        node(around:${area}, ${lat}, ${lon}) ["leisure"="park"];  
        node(around:${area}, ${lat}, ${lon}) ["boundary"="protected_area"];  
        node(around:${area}, ${lat}, ${lon}) ["natural"="wood"];  
        node(around:${area}, ${lat}, ${lon}) ["natural"="reserve"];  
        node(around:${area}, ${lat}, ${lon}) ["amenity"="pharmacy"]; 
        node(around:${area}, ${lat}, ${lon}) ["amenity"="clinic"];  
        node(around:${area}, ${lat}, ${lon}) ["amenity"="community_centre"];  
        node(around:${area}, ${lat}, ${lon}) ["amenity"="arts_centre"];  
        node(around:${area}, ${lat}, ${lon}) ["amenity"="social_facility"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="veterinary"]; 
        node(around:${area}, ${lat}, ${lon}) ["shop"="marketplace"];
        node(around:${area}, ${lat}, ${lon}) ["amenity"="embassy"];
        node(around:${area}, ${lat}, ${lon}) ["sport"];
        node(around:${area}, ${lat}, ${lon}) ["leisure"~"sports_centre|stadium|pitch|track"];
    );
    out center;
  `;
    try {
      const result = await fetch(`https://overpass-api.de/api/interpreter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      })
      const data = await result.json();

      data.elements.forEach((element: any) => {
        getDistance(element.lat, element.lon)
      });

      setOSM(data.elements)

    } catch (error) {
      console.log(error)
    }
  }

  const getDistance = async (end_latitude: number, end_longitude: number) => {
    const startLon = lon;
    const startLat = lat;

    const apiUrl = `/api?startLon=${startLon}&startLat=${startLat}&endLon=${end_longitude}&endLat=${end_latitude}`;

    try {
      if (!distanceMap.get(`${end_latitude}${end_longitude}`)) {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.log(`Error: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        setDistanceMap((prev) => {
          const newVal: Map<string, number> = new Map<string, number>(prev);
          newVal.set(`${end_latitude}${end_longitude}`, data.routes[0].distance);  // Add or update a key-value pair
          return newVal;
        });
      }
    } catch (error) {
      console.log('Error fetching route:', error);
    }
  };


  return (
    <>
      <div className="flex flex-col sm:flex-row max-h-screen overflow-hidden">
        <div className="flex-1">
          <div className="p-5">
            <div>
              <label htmlFor="area">Select area</label>
            </div>
            <select id="area" className="select select-bordered select-sm w-full max-w-xs" defaultValue={500} onChange={(e) => { setArea(parseInt(e.currentTarget.value)) }}>
              <option value={500}>500m</option>
              <option value={1000}>1Km</option>
              <option value={2000}>2Km</option>
            </select>
          </div>
          <div className="p-5 overflow-y-auto h-[70%]" style={{ scrollbarWidth: "thin" }}>
            <div>
              {
                OSM.map((place: { lat: number, lon: number, tags: { name: string, "name:ml": string, "name:fr": string, "name:en": string, amenity: string, shop: string, tourism: string, office: string, boundary: string, leisure: string, natural: string, sport: string } }, index) => (
                  <div className="card bg-base-100 w-96 shadow-xl mb-5" key={index}>
                    <div className="card-body">
                      <h2 className="card-title">{getPlaceIcon(place)} {place.tags.amenity || place.tags.shop || place.tags.tourism || place.tags.office || place.tags.boundary || place.tags.leisure || place.tags.natural || place.tags.sport || 'Unknown Place'}</h2>
                      <p>{place.tags.name || place.tags["name:ml"] || place.tags["name:fr"] || place.tags["name:en"] || ''}</p>
                      <p>Distance: {distanceMap.get(`${place.lat}${place.lon}`) ? `${distanceMap.get(`${place.lat}${place.lon}`)}m` : ''}</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={() => { setPlaceSelected(place) }}>See in map</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="w-screen sm:w-2/3">
          <MyMap lat={lat} lon={lon} area={area} place={placeSelected}></MyMap>
        </div>
      </div>
    </>
  );
}
