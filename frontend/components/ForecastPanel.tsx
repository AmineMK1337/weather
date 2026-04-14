"use client";
import { useState } from "react";
import { memo } from "react";
import { ForecastDay } from "../services/api";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";
import { format, parseISO } from "date-fns";
import clsx from "clsx";

interface ForecastPanelProps {
  forecast: ForecastDay[] | null;
  unit: "C" | "F";
  loading: boolean;
}

function ForecastPanel({ forecast, unit, loading }: ForecastPanelProps) {
  const [days, setDays] = useState<3 | 5>(3);

  const items = forecast ? forecast.slice(0, days) : [];

  return (
    <div className="card p-5 min-h-[260px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-text-primary">Forecasts</h2>
        <div className="flex gap-1 bg-bg-hover rounded-xl p-1">
          {([3, 5] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={clsx(
                "px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all",
                days === d ? "bg-accent-blue text-white shadow-sm" : "text-text-muted hover:text-text-secondary"
              )}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-bg-hover rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">No forecast data</p>
      ) : (
        <div className="space-y-2">
          {items.map((day) => {
            const date = parseISO(day.date);
            return (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-hover transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWeatherIcon(day.icon)}</span>
                  <div>
                    <p className="text-text-primary text-sm font-sans font-medium">
                      {formatTemp(day.temp_max, unit)}
                      <span className="text-text-muted ml-1 text-xs">/ {formatTemp(day.temp_min, unit)}</span>
                    </p>
                    <p className="text-text-muted text-xs capitalize">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-sm font-mono font-medium">{format(date, "d")}</p>
                  <p className="text-text-muted text-xs">{format(date, "MMM, EEE")}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(ForecastPanel);
