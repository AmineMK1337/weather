"use client";
import { useState } from "react";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";
import { Plus } from "lucide-react";

const DEFAULT_CITIES = [
  { name: "Lisbon", country: "Portugal", temp: 23, tempMin: 15, icon: "01d" },
  { name: "Kyoto", country: "Japan", temp: 29, tempMin: 16, icon: "02d" },
  { name: "Antalya", country: "Türkiye", temp: 30, tempMin: 19, icon: "01d" },
  { name: "New York", country: "USA", temp: 18, tempMin: 12, icon: "03d" },
  { name: "Dubai", country: "UAE", temp: 38, tempMin: 28, icon: "01d" },
];

interface WorldForecastProps {
  unit: "C" | "F";
}

export default function WorldForecast({ unit }: WorldForecastProps) {
  const [cities] = useState(DEFAULT_CITIES);

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {/* Add card */}
      <div className="min-w-[130px] card border-dashed border-white/10 p-4 flex flex-col gap-2 cursor-pointer hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all flex-shrink-0">
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <Plus size={14} className="text-text-muted" />
        </div>
        <h3 className="font-display text-base text-text-primary leading-tight">World forecast</h3>
        <p className="text-xs text-text-muted">Add the cities you are interested in</p>
      </div>

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
