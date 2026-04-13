"use client";
import { memo, useMemo } from "react";
import { ForecastDay } from "../services/api";

interface HourlyHumidityRainOverviewProps {
  forecast: ForecastDay[] | null;
}

function HourlyHumidityRainOverview({ forecast }: HourlyHumidityRainOverviewProps) {
  const today = forecast?.[0];

  const rows = useMemo(() => {
    if (!today?.hourly?.length) return [];

    return today.hourly
      .flatMap((h, i) => {
        const baseHour = Number.parseInt(h.time.split(":")[0], 10);
        if (Number.isNaN(baseHour)) {
          return [{
            key: `${today.date}-${i}-raw`,
            time: h.time,
            humidity: h.humidity,
            rain_mm: h.rain_mm,
            condition: h.condition,
          }];
        }

        return Array.from({ length: 3 }, (_, offset) => ({
          key: `${today.date}-${i}-${offset}`,
          time: `${String((baseHour + offset) % 24).padStart(2, "0")}:00`,
          humidity: h.humidity,
          // OpenWeather returns 3h rain volume; distribute it over each hour for an hourly estimate.
          rain_mm: h.rain_mm / 3,
          condition: h.condition,
        }));
      })
      .slice(0, 24);
  }, [today]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-text-primary">Hourly Humidity & Rain</h2>
        <span className="text-xs text-text-muted font-mono">24h view</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-text-muted font-sans">Search a city to see hourly humidity and rainfall.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/10">
                <th className="py-2 pr-4 font-sans font-medium">Hour</th>
                <th className="py-2 pr-4 font-sans font-medium">Humidity</th>
                <th className="py-2 pr-4 font-sans font-medium">Rain (mm/h est.)</th>
                <th className="py-2 font-sans font-medium">Condition</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.key} className="border-b border-white/5 hover:bg-bg-hover/40 transition-colors">
                  <td className="py-2 pr-4 text-text-primary font-mono">{h.time}</td>
                  <td className="py-2 pr-4 text-text-secondary">{h.humidity}%</td>
                  <td className="py-2 pr-4 text-text-secondary">{h.rain_mm.toFixed(1)} mm</td>
                  <td className="py-2 text-text-secondary capitalize">{h.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default memo(HourlyHumidityRainOverview);
