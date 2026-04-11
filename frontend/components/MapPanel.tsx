"use client";
import { useEffect, useRef } from "react";
import { CurrentWeather } from "../services/api";
import { Maximize2 } from "lucide-react";

interface MapPanelProps {
  weather: CurrentWeather | null;
}

declare global {
  interface Window { google: any; }
}

export default function MapPanel({ weather }: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const initMap = () => {
      const lat = weather?.latitude || 52.52;
      const lng = weather?.longitude || 13.405;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 6,
        mapTypeId: "terrain",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1e2330" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#8892a4" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f1117" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1117" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#252b3b" }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !weather) return;
    const pos = { lat: weather.latitude, lng: weather.longitude };
    mapInstance.current.panTo(pos);
    if (markerRef.current) markerRef.current.setPosition(pos);
    else {
      markerRef.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: `${weather.location}: ${Math.round(weather.temperature)}°C`,
      });

      new window.google.maps.InfoWindow({
        content: `<div style="background:#1e2330;color:#e8eaf0;padding:8px 12px;border-radius:8px;font-size:12px">
          <strong>${weather.location}, ${weather.country}</strong><br/>
          ${Math.round(weather.temperature)}° ${weather.weather_condition}<br/>
          ${weather.humidity}% humidity
        </div>`,
      }).open(mapInstance.current, markerRef.current);
    }
  }, [weather]);

  return (
    <div className="card overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full min-h-[180px]" style={{ background: "#1e2330" }}>
        {!weather && (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted text-xs">
            🗺️ Map will appear after search
          </div>
        )}
      </div>
      <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-bg-card/80 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-all backdrop-blur-sm">
        <Maximize2 size={13} />
      </button>
    </div>
  );
}
