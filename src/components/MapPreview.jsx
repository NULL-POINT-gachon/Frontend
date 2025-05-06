import React from "react"; 
import { useMemo } from "react";
import {
  GoogleMap, LoadScript, Marker, Polyline
} from "@react-google-maps/api";

/** props: { items: [{lat,lng,title,order}], height? } */
export default function MapPreview({ items, height = "100%" }) {
  const path = useMemo(
    () => items
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((p) => ({ lat: p.lat, lng: p.lng })),
    [items]
  );
  const center = path[0] || { lat: 37.5665, lng: 126.9780 }; // fallback = 서울

  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  return (
    <LoadScript googleMapsApiKey={GOOGLE_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        zoom={13}
        center={center}
      >
        {path.map((p, idx) => (
          <Marker
            key={idx}
            position={p}
            label={`${idx + 1}`}
            title={items[idx].title}
          />
        ))}
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{ strokeOpacity: 0.8, strokeWeight: 4 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
