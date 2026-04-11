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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs font-mono shadow-xl">
        <p className="text-text-muted mb-1">{label}</p>
        <p className="text-accent-cyan font-medium">
          {payload[0].name === "Humidity" ? "💧 " : ""}
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function OverviewChart({ forecast }: OverviewChartProps) {
  const [activeMetric, setActiveMetric] = useState<Metric>("Humidity");

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const chartData = forecast
    ? forecast.map((d, i) => ({
        name: months[new Date(d.date).getMonth()],
        value: d.humidity,
        date: d.date,
      }))
    : months.map((m, i) => ({ name: m, value: Math.floor(Math.random() * 60 + 20), date: "" }));

  const avg = Math.round(chartData.reduce((s, d) => s + d.value, 0) / chartData.length);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
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

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#36d9d9" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#36d9d9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: "#556070", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#556070", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke="#4f8ef7" strokeDasharray="4 4" label={{ value: `⊕ Average ${avg}%`, fill: "#4f8ef7", fontSize: 11, fontFamily: "JetBrains Mono" }} />
          <Area type="monotone" dataKey="value" name={activeMetric} stroke="#36d9d9" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: "#36d9d9", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#4f8ef7" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
