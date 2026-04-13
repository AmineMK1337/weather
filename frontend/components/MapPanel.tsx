"use client";
import { useEffect, useRef, useCallback, memo } from "react";
import { CurrentWeather } from "../services/api";
import { Maximize2 } from "lucide-react";

interface MapPanelProps {
  weather: CurrentWeather | null;
  mapHeight?: number;
}

declare global {
  interface Window { google: any; }
}

const DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#1e2330" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8892a4" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1117" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1117" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#252b3b" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function MapPanel({ weather, mapHeight = 200 }: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const createOrUpdateMarker = useCallback((lat: number, lng: number, w: CurrentWeather) => {
    if (!mapInstance.current) return;
    const pos = { lat, lng };

    if (markerRef.current) {
      markerRef.current.setPosition(pos);
      mapInstance.current.panTo(pos);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: `${w.location}: ${Math.round(w.temperature)}°C`,
        animation: window.google.maps.Animation.DROP,
      });
    }

    if (infoWindowRef.current) infoWindowRef.current.close();
    infoWindowRef.current = new window.google.maps.InfoWindow({
      content: `<div style="background:#1e2330;color:#e8eaf0;padding:10px 14px;border-radius:10px;font-size:12px;font-family:'DM Sans',sans-serif;min-width:140px">
        <strong style="font-size:13px">${w.location}, ${w.country}</strong><br/>
        <span style="color:#36d9d9;font-size:16px;font-weight:600">${Math.round(w.temperature)}°C</span>
        <span style="color:#8892a4;margin-left:6px;text-transform:capitalize">${w.weather_condition}</span><br/>
        <span style="color:#8892a4">💧 ${w.humidity}% · 💨 ${Math.round(w.wind_speed * 3.6)} km/h</span>
      </div>`,
    });
    infoWindowRef.current.open(mapInstance.current, markerRef.current);
    mapInstance.current.panTo(pos);
  }, []);

  // Initialize map once
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!mapRef.current) return;

    const initMap = (lat = 48.8566, lng = 2.3522) => {
      if (mapInstance.current) return; // already initialized
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 6,
        mapTypeId: "terrain",
        styles: DARK_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });
    };

    if (!apiKey) {
      // No API key — show placeholder, skip loading
      return;
    }

    let waitInterval: NodeJS.Timeout | null = null;

    if (window.google?.maps) {
      initMap();
    } else {
      // Avoid duplicate script injection
      if (document.getElementById("google-maps-script")) {
        waitInterval = setInterval(() => {
          if (window.google?.maps) { 
            if (waitInterval) clearInterval(waitInterval);
            initMap(); 
          }
        }, 100);
      } else {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.head.appendChild(script);
      }
    }

    // Cleanup
    return () => {
      if (waitInterval) clearInterval(waitInterval);
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      if (window.google?.maps?.event && mapInstance.current) {
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
      mapInstance.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker when weather changes
  useEffect(() => {
    if (!weather || !mapInstance.current) return;
    createOrUpdateMarker(weather.latitude, weather.longitude, weather);
  }, [weather, createOrUpdateMarker]);

  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="card overflow-hidden relative" style={{ minHeight: mapHeight }}>
      {hasApiKey ? (
        <>
          <div ref={mapRef} className="w-full" style={{ height: mapHeight, background: "#1e2330" }} />
          {!weather && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted text-xs gap-2 pointer-events-none">
              <span className="text-3xl">🗺️</span>
              <span>Map appears after search</span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center text-text-muted text-xs gap-2 py-10">
          <span className="text-3xl">🗺️</span>
          <span className="font-sans">Add <code className="text-accent-blue">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code></span>
          <span>to enable the interactive map</span>
        </div>
      )}
      <button
        title="Fullscreen"
        className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-bg-card/80 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-all backdrop-blur-sm"
      >
        <Maximize2 size={13} />
      </button>
    </div>
  );
}

export default memo(MapPanel);
