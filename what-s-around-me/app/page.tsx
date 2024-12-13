'use client';

import { useEffect, useState } from "react";
import Map from "./components/Map";
import { itemIcons } from "./utils/IconMap";

const getPlaceIcon = (place: { tags: { [key: string]: string } }) => {
  const tags = place.tags;

  // Return the first matching icon based on available tags
  return (
    itemIcons.get("amenity")?.get(tags.amenity) ||
    itemIcons.get("shop")?.get(tags.shop) ||
    itemIcons.get("tourism")?.get(tags.tourism) ||
    itemIcons.get("natural")?.get(tags.natural) ||
    itemIcons.get("leisure")?.get(tags.leisure) ||
    "❓"
  );
};

export default function Home() {
  const [lat, setLat] = useState<number | null>(0);
  const [lon, setLon] = useState<number | null>(0);
  const [OSM, setOSM] = useState<[]>([])
  const [area, setArea] = useState<number>(500)

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      return;
    }

    try {

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLon(pos.coords.longitude);
        },
        (err) => {
          console.log(err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
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
    const result = await fetch(`https://overpass-api.de/api/interpreter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    })
    const data = await result.json();
    console.log(data.elements);

    setOSM(data.elements)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1">
          <div>
            <label htmlFor="area">Select area</label>
          </div>
          <select id="area" className="select select-bordered select-sm w-full max-w-xs" defaultValue={500} onChange={(e) => { setArea(parseInt(e.currentTarget.value)) }}>
            <option value={500}>500m</option>
            <option value={1000}>1Km</option>
            <option value={2000}>2Km</option>
          </select>
        </div>
        <div className="w-screen sm:w-2/3">
          <Map lat={lat} lon={lon} area={area} places={OSM}></Map>
        </div>
      </div>
    </>
  );
}
