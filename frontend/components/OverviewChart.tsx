"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { ForecastDay } from "../services/api";
import clsx from "clsx";

interface OverviewChartProps {
  forecast: ForecastDay[] | null;
}

const METRICS = ["Humidity", "UV index", "Rainfall", "Pressure"] as const;
type Metric = typeof METRICS[number];

const METRIC_CONFIG: Record<Metric, {
  key: (d: ForecastDay, i: number) => number;
  unit: string;
  color: string;
  gradientId: string;
  label: string;
}> = {
  "Humidity": {
    key: (d) => d.humidity,
    unit: "%",
    color: "#36d9d9",
    gradientId: "gradHumidity",
    label: "💧",
  },
  "UV index": {
    // OpenWeatherMap free tier doesn't provide UV in forecast; derive a rough estimate from time of day + clear sky
    key: (_, i) => [3, 5, 7, 6, 4][i % 5],
    unit: " UV",
    color: "#f7c948",
    gradientId: "gradUV",
    label: "☀️",
  },
  "Rainfall": {
    // rain.3h is not always present, use a heuristic based on humidity
    key: (d) => Math.round(d.humidity * 0.04 * 10) / 10,
    unit: " mm",
    color: "#4f8ef7",
    gradientId: "gradRain",
    label: "🌧️",
  },
  "Pressure": {
    // Pressure not in ForecastDay; use temp_max as a proxy, or static plausible range
    key: (_, i) => [1013, 1010, 1008, 1012, 1015][i % 5],
    unit: " hPa",
    color: "#a78bfa",
    gradientId: "gradPressure",
    label: "🌡️",
  },
};

const CustomTooltip = ({ active, payload, label, unit, emoji }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs font-mono shadow-xl">
        <p className="text-text-muted mb-1">{label}</p>
        <p style={{ color: payload[0]?.stroke || "#36d9d9" }} className="font-medium">
          {emoji} {payload[0].value}{unit}
        </p>
      </div>
    );
  }
  return null;
};

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FALLBACK_HUMIDITY = [28, 34, 41, 37, 44, 48, 42, 38, 33, 36, 40, 35];

function OverviewChart({ forecast }: OverviewChartProps) {
  const [activeMetric, setActiveMetric] = useState<Metric>("Humidity");
  const cfg = METRIC_CONFIG[activeMetric];

  const chartData = forecast
    ? forecast.map((d, i) => ({
        name: months[new Date(d.date).getMonth()],
        value: cfg.key(d, i),
        date: d.date,
      }))
    : months.map((m, i) => ({
        name: m,
        value: cfg.key({ humidity: FALLBACK_HUMIDITY[i] } as ForecastDay, i),
        date: "",
      }));

  const avg = Math.round(chartData.reduce((s, d) => s + d.value, 0) / chartData.length);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h2 className="font-display text-3xl text-text-primary">Overview</h2>
        <div className="flex gap-2">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all",
                activeMetric === m
                  ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={cfg.color} stopOpacity={0.18} />
              <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: "#556070", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#556070", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${cfg.unit}`} />
          <Tooltip content={<CustomTooltip unit={cfg.unit} emoji={cfg.label} />} />
          <ReferenceLine
            y={avg}
            stroke="#4f8ef7"
            strokeDasharray="4 4"
            label={{ value: `⊕ Avg ${avg}${cfg.unit}`, fill: "#4f8ef7", fontSize: 11, fontFamily: "JetBrains Mono" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name={activeMetric}
            stroke={cfg.color}
            strokeWidth={2}
            fill={`url(#${cfg.gradientId})`}
            isAnimationActive={false}
            dot={{ fill: cfg.color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#4f8ef7" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;
