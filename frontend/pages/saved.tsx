"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";
import { Star, Plus, MoreHorizontal } from "lucide-react";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";
import { weatherApi } from "../services/api";

const STORAGE_KEY = "weather.saved.locations";

interface SavedLocation {
  name: string;
  country: string;
  temp: number;
  condition: string;
  icon: string;
  wind: string;
  humidity: string;
}

const DEFAULT_SAVED_LOCATIONS: SavedLocation[] = [
  { name: "Florida", country: "US", temp: 25, condition: "Heavy Rain", icon: "10d", wind: "7.9 km/h", humidity: "85%" },
  { name: "Canberra", country: "Australia", temp: 26, condition: "Clear", icon: "01d", wind: "10.2 km/h", humidity: "40%" },
  { name: "Tokyo", country: "Japan", temp: 30, condition: "Mostly Sunny", icon: "02d", wind: "5.5 km/h", humidity: "60%" },
  { name: "Moscow", country: "Russia", temp: -4, condition: "Cloudy", icon: "04d", wind: "12.0 km/h", humidity: "75%" },
  { name: "Lisbon", country: "Portugal", temp: 23, condition: "Clear", icon: "01d", wind: "8.3 km/h", humidity: "50%" },
];

export default function SavedPage() {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(DEFAULT_SAVED_LOCATIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as SavedLocation[];
      if (Array.isArray(parsed) && parsed.length) {
        const sanitized = parsed.filter(
          (city) =>
            typeof city?.name === "string" &&
            typeof city?.country === "string" &&
            typeof city?.temp === "number" &&
            typeof city?.condition === "string" &&
            typeof city?.icon === "string" &&
            typeof city?.wind === "string" &&
            typeof city?.humidity === "string"
        );

        if (sanitized.length) {
          setSavedLocations(sanitized);
        }
      }
    } catch {
      // Ignore malformed local data.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = locationQuery.trim();
    if (!query) return;

    setIsAdding(true);
    setAddError(null);

    try {
      const { data } = await weatherApi.getCurrent(query);
      const newLocation: SavedLocation = {
        name: data.location,
        country: data.country,
        temp: data.temperature,
        condition: data.weather_condition,
        icon: data.weather_icon,
        wind: `${(data.wind_speed * 3.6).toFixed(1)} km/h`,
        humidity: `${Math.round(data.humidity)}%`,
      };

      const normalizedName = newLocation.name.toLowerCase();
      if (savedLocations.some((city) => city.name.toLowerCase() === normalizedName)) {
        setAddError("This location is already saved.");
        return;
      }

      setSavedLocations((prev) => [
        newLocation,
        ...prev.filter((city) => city.name.toLowerCase() !== normalizedName),
      ].slice(0, 18));
      setLocationQuery("");
      setShowAddForm(false);
    } catch {
      setAddError("Could not find that location. Try a city name.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SidebarLayout>
      <Head>
        <title>Saved Locations - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto gap-6 z-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <Star className="text-accent-blue" />
              Saved Locations
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Keep track of weather conditions across your favorite places around the globe.
            </p>
          </div>
          
          <button
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
            className="flex items-center gap-1 bg-bg-card border border-white/8 rounded-xl px-4 py-2 text-sm font-mono transition-all shadow-md"
          >
            <span className={unit === "C" ? "text-accent-blue font-medium" : "text-text-muted"}>C°</span>
            <span className="text-text-muted mx-1">/</span>
            <span className={unit === "F" ? "text-accent-blue font-medium" : "text-text-muted"}>F°</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Card */}
          {showAddForm ? (
            <form
              onSubmit={handleAddLocation}
              className="card p-6 min-h-[220px] rounded-[24px] border border-dashed border-accent-blue/40 flex flex-col justify-center gap-3"
            >
              <h3 className="font-display text-xl text-text-primary">Add Location</h3>
              <p className="text-sm text-text-muted">Search and save a new city</p>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-blue/50"
              />
              {addError && <p className="text-xs text-red-400">{addError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium disabled:opacity-60"
                >
                  {isAdding ? "Adding..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setLocationQuery("");
                    setAddError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-text-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="card p-8 min-h-[220px] rounded-[24px] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all group text-left"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus size={24} className="text-text-muted group-hover:text-accent-blue transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl text-text-primary mb-1">Add Location</h3>
                <p className="text-sm text-text-muted">Search and save a new city</p>
              </div>
            </button>
          )}

          {/* Saved City Cards */}
          {savedLocations.map((city) => (
            <div
              key={`${city.name}-${city.country}`}
              className="card p-6 min-h-[220px] rounded-[24px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-bg-card to-[#1a1e2a] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-pointer group"
            >
              {/* Background gradient hint based on temperature (hot/cold) */}
              <div 
                className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20
                ${city.temp > 20 ? 'bg-orange-500' : city.temp < 10 ? 'bg-blue-500' : 'bg-green-500'}`} 
                style={{ transform: "translate(20%, -30%)" }}
              />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-2xl text-text-primary leading-tight">{city.name}</h3>
                  <p className="text-sm text-text-muted">{city.country}</p>
                </div>
                <button className="text-text-muted hover:text-text-primary transition-colors p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="relative z-10 flex items-end justify-between mt-6">
                <div>
                  <div className="text-4xl lg:text-5xl font-mono text-text-primary tracking-tight">
                    {formatTemp(city.temp, unit)}
                  </div>
                  <div className="text-sm font-medium text-text-secondary mt-1">{city.condition}</div>
                </div>
                <div className="w-16 h-16 flex items-center justify-center text-5xl filter drop-shadow-lg">
                  {getWeatherIcon(city.icon)}
                </div>
              </div>

              {/* Bottom stats row */}
              <div className="relative z-10 flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-70">Wind:</span>
                  <span className="text-text-secondary">{city.wind}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="opacity-70">Hum:</span>
                  <span className="text-text-secondary">{city.humidity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
