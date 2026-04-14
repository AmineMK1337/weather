"use client";
import { useEffect, useState } from "react";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";
import { Plus } from "lucide-react";
import { weatherApi } from "../services/api";

const DEFAULT_CITIES = [
  { name: "Lisbon", country: "Portugal", temp: 23, tempMin: 15, icon: "01d" },
  { name: "Kyoto", country: "Japan", temp: 29, tempMin: 16, icon: "02d" },
  { name: "Antalya", country: "Türkiye", temp: 30, tempMin: 19, icon: "01d" },
  { name: "New York", country: "USA", temp: 18, tempMin: 12, icon: "03d" },
  { name: "Dubai", country: "UAE", temp: 38, tempMin: 28, icon: "01d" },
];

const STORAGE_KEY = "weather.worldForecast.cities";

interface WorldCity {
  name: string;
  country: string;
  temp: number;
  tempMin: number;
  icon: string;
}

interface WorldForecastProps {
  unit: "C" | "F";
}

export default function WorldForecast({ unit }: WorldForecastProps) {
  const [cities, setCities] = useState<WorldCity[]>(DEFAULT_CITIES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as WorldCity[];
      if (Array.isArray(parsed) && parsed.length) {
        const sanitized = parsed.filter(
          (city) =>
            typeof city?.name === "string" &&
            typeof city?.country === "string" &&
            typeof city?.temp === "number" &&
            typeof city?.tempMin === "number" &&
            typeof city?.icon === "string"
        );
        if (sanitized.length) {
          setCities(sanitized);
        }
      }
    } catch {
      // Ignore malformed storage values.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities]);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = cityQuery.trim();
    if (!query) return;

    if (cities.some((city) => city.name.toLowerCase() === query.toLowerCase())) {
      setAddError("This city is already in your world forecast.");
      return;
    }

    setIsAdding(true);
    setAddError(null);

    try {
      const { data } = await weatherApi.getCurrent(query);
      const nextCity: WorldCity = {
        name: data.location,
        country: data.country,
        temp: data.temperature,
        tempMin: data.feels_like,
        icon: data.weather_icon,
      };

      setCities((prev) => [nextCity, ...prev.filter((c) => c.name !== nextCity.name)].slice(0, 10));
      setCityQuery("");
      setShowAddForm(false);
    } catch {
      setAddError("Could not add this city. Please try another search.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {/* Add card */}
      {showAddForm ? (
        <form
          onSubmit={handleAddCity}
          className="min-w-[230px] card border-dashed border-accent-blue/35 p-4 flex flex-col gap-2 flex-shrink-0"
        >
          <label htmlFor="world-city" className="text-xs text-text-muted font-sans">
            Add city
          </label>
          <input
            id="world-city"
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Type a city..."
            className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-blue/50"
          />
          {addError && <p className="text-[11px] text-red-400">{addError}</p>}
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={isAdding}
              className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-medium disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setCityQuery("");
                setAddError(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-text-muted text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="min-w-[130px] card border-dashed border-white/10 p-4 flex flex-col gap-2 cursor-pointer hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all flex-shrink-0 text-left"
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <Plus size={14} className="text-text-muted" />
          </div>
          <h3 className="font-display text-base text-text-primary leading-tight">World forecast</h3>
          <p className="text-xs text-text-muted">Add the cities you are interested in</p>
        </button>
      )}

      {/* City cards */}
      {cities.map((city) => (
        <div
          key={city.name}
          className="min-w-[130px] card p-4 flex flex-col gap-3 cursor-default hover:bg-bg-hover transition-all flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center text-xl">
            {getWeatherIcon(city.icon)}
          </div>
          <div>
            <h3 className="font-sans font-semibold text-text-primary text-sm">{city.name}</h3>
            <p className="text-text-muted text-xs">{city.country}</p>
          </div>
          <p className="font-mono text-xl text-text-primary">
            {formatTemp(city.temp, unit)}
            <span className="text-text-muted text-xs ml-1">/{formatTemp(city.tempMin, unit)}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
