"use client";
import { CurrentWeather } from "../services/api";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";
import { Droplets, Wind, Thermometer, Eye, Gauge } from "lucide-react";

interface CurrentWeatherCardProps {
  weather: CurrentWeather | null;
  unit: "C" | "F";
  loading: boolean;
}

export default function CurrentWeatherCard({ weather, unit, loading }: CurrentWeatherCardProps) {
  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-bg-hover" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-bg-hover rounded-xl w-40" />
            <div className="h-4 bg-bg-hover rounded-xl w-24" />
            <div className="flex gap-6 mt-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-bg-hover rounded-xl w-24" />)}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5 overflow-x-auto pb-1">
          {[...Array(9)].map((_, i) => <div key={i} className="min-w-[64px] h-20 bg-bg-hover rounded-xl flex-shrink-0" />)}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="card p-8 flex items-center justify-center text-text-muted text-sm">
        Search a city to get started ☀️
      </div>
    );
  }

  const icon = getWeatherIcon(weather.weather_icon);

  const stats = [
    { label: "Temperature", value: formatTemp(weather.temperature, unit), icon: Thermometer },
    { label: "Humidity", value: `${weather.humidity}%`, icon: Droplets },
    { label: "Wind speed", value: `${Math.round(weather.wind_speed * 3.6)} km/h`, icon: Wind },
    { label: "Visibility", value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: Eye },
    { label: "Pressure", value: `${weather.pressure} hPa`, icon: Gauge },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="text-7xl leading-none">{icon}</div>

        {/* Location + stats */}
        <div className="flex-1">
          <h2 className="font-display text-4xl text-text-primary leading-tight">{weather.location}</h2>
          <p className="text-text-muted text-sm font-sans mt-0.5">{weather.country} · {weather.weather_condition}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xl font-mono font-medium text-text-primary">{value}</span>
                <span className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                  <Icon size={11} />
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI summary */}
        {weather.ai_summary && (
          <div className="max-w-xs bg-accent-blue/8 border border-accent-blue/20 rounded-xl p-3">
            <p className="text-xs text-accent-blue font-sans font-medium mb-1">✨ AI Insight</p>
            <p className="text-xs text-text-secondary leading-relaxed">{weather.ai_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
