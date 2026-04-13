"use client";
import { memo } from "react";
import { ForecastDay } from "../services/api";
import { getWeatherIcon, formatTemp } from "../services/weatherUtils";

interface HourlyForecastProps {
  forecast: ForecastDay[] | null;
  unit: "C" | "F";
}

function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
  const today = forecast?.[0];
  const hasHourly = today?.hourly && today.hourly.length > 0;

  return (
    <div className="card p-4">
      {!hasHourly ? (
        <div className="invisible" aria-hidden="true">
          <div className="text-xs text-text-muted font-mono">placeholder</div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {today!.hourly.map((h) => (
            <div
              key={h.time}
              className="min-w-[64px] flex flex-col items-center gap-1.5 bg-bg-hover/50 rounded-xl px-3 py-3 flex-shrink-0 border border-white/5 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all cursor-default"
            >
              <span className="text-xs text-text-muted font-mono">{h.time}</span>
              <span className="text-2xl">{getWeatherIcon(h.icon)}</span>
              <span className="text-xs font-mono font-medium text-text-primary">{formatTemp(h.temp, unit)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(HourlyForecast);
