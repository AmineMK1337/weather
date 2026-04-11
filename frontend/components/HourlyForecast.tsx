"use client";
import { ForecastDay } from "../services/api";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";

interface HourlyForecastProps {
  forecast: ForecastDay[] | null;
  unit: "C" | "F";
}

export default function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
  if (!forecast || forecast.length === 0) return null;
  const today = forecast[0];

  return (
    <div className="card p-4">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {today.hourly.map((h, i) => (
          <div
            key={i}
            className="min-w-[64px] flex flex-col items-center gap-1.5 bg-bg-hover/50 rounded-xl px-3 py-3 flex-shrink-0 border border-white/5 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all cursor-default"
          >
            <span className="text-xs text-text-muted font-mono">{h.time}</span>
            <span className="text-2xl">{getWeatherIcon(h.icon)}</span>
            <span className="text-xs font-mono font-medium text-text-primary">{formatTemp(h.temp, unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
