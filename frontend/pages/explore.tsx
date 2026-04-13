"use client";
import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";
import MapPanel from "../components/MapPanel";
import HourlyHumidityRainOverview from "../components/HourlyHumidityRainOverview";
import { Compass, Search } from "lucide-react";
import { weatherApi, CurrentWeather, ForecastDay } from "../services/api";

export default function ExplorePage() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        weatherApi.getCurrent(query),
        weatherApi.getForecast(query, 1),
      ]);
      setWeather(currentRes.data);
      setForecast(forecastRes.data.forecast);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <Head>
        <title>Explore - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <Compass className="text-accent-blue" />
              Explore the World
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Interactive radar and satellite maps for any region.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city to center map..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg-card border border-white/8 text-text-primary placeholder:text-text-muted text-sm font-sans focus:outline-none focus:border-accent-blue/50 transition-all shadow-lg"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
            )}
          </form>
        </header>

        <div className="relative">
          <MapPanel key={weather?.location || "explore-map"} weather={weather} mapHeight={640} />
          {!weather && (
            <div className="absolute bottom-6 left-6 pointer-events-none z-10 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 max-w-sm">
              <p className="text-sm text-white/90">
                <strong className="text-accent-cyan">Tip:</strong> Search for a specific city in the top right to pinpoint weather patterns and view local temperature.
              </p>
            </div>
          )}
        </div>

        <HourlyHumidityRainOverview forecast={forecast} />
      </div>
    </SidebarLayout>
  );
}
