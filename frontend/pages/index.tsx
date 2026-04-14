"use client";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { weatherApi, CurrentWeather, ForecastDay } from "../services/api";
import { Database, ArrowUpRight } from "lucide-react";

// Lazy load all components to avoid SSR issues
const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const CurrentWeatherCard = dynamic(() => import("../components/CurrentWeatherCard"), { ssr: false });
const HourlyForecast = dynamic(() => import("../components/HourlyForecast"), { ssr: false });
const OverviewChart = dynamic(() => import("../components/OverviewChart"), { ssr: false });
const ForecastPanel = dynamic(() => import("../components/ForecastPanel"), { ssr: false });
const MapPanel = dynamic(() => import("../components/MapPanel"), { ssr: false });
const WorldForecast = dynamic(() => import("../components/WorldForecast"), { ssr: false });
const YouTubeVideos = dynamic(() => import("../components/YouTubeVideos"), { ssr: false });
const RecordsModal = dynamic(() => import("../components/RecordsModal"), { ssr: false });
const SidebarLayout = dynamic(() => import("../components/SidebarLayout"), { ssr: false });

export default function Dashboard() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecords, setShowRecords] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState<string | null>(null);

  const handleSearch = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        weatherApi.getCurrent(location),
        weatherApi.getForecast(location, 5),
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data.forecast);
      setSearchedLocation(weatherRes.data.location);

      // Auto-save record
      try {
        await weatherApi.createRecord({
          location: weatherRes.data.location,
          country: weatherRes.data.country,
          latitude: weatherRes.data.latitude,
          longitude: weatherRes.data.longitude,
          temperature: weatherRes.data.temperature,
          feels_like: weatherRes.data.feels_like,
          humidity: weatherRes.data.humidity,
          wind_speed: weatherRes.data.wind_speed,
          weather_condition: weatherRes.data.weather_condition,
          weather_icon: weatherRes.data.weather_icon,
          ai_summary: weatherRes.data.ai_summary,
        });
      } catch { /* non-critical */ }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to fetch weather data. Check the city name and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SidebarLayout>
      <Header
        onSearch={handleSearch}
        unit={unit}
        onUnitToggle={() => setUnit(u => u === "C" ? "F" : "C")}
        loading={loading}
      />

      {/* Error banner */}
      <div className={`mx-6 mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-sans transition-all ${
        error ? "opacity-100 pointer-events-auto h-auto" : "opacity-0 pointer-events-none h-0 overflow-hidden"
      }`}>
        ⚠️ {error || "No error"}
      </div>

        {/* Main grid */}
        <main className="flex-1 overflow-y-auto p-5 gap-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 min-h-0">
            <CurrentWeatherCard key={searchedLocation} weather={weather} unit={unit} loading={loading} />
            <HourlyForecast forecast={forecast} unit={unit} />
            <div className="w-full">
              <OverviewChart forecast={forecast} />
            </div>

            {/* World forecast strip */}
            <div>
              <h3 className="font-display text-xl text-text-primary mb-3">World Forecasts</h3>
              <WorldForecast unit={unit} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <MapPanel key={searchedLocation || "map-initial"} weather={weather} mapHeight={270} />
            <ForecastPanel forecast={forecast} unit={unit} loading={loading} />
            <YouTubeVideos location={searchedLocation} />

            {/* Subscribe card */}
            <div className="card p-5 relative overflow-hidden bg-gradient-to-br from-slate-200/95 to-slate-100">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
              <div className="relative z-10">
                <h3 className="font-display text-2xl text-slate-900 leading-tight">Subscribe!</h3>
                <p className="text-slate-600 text-xs font-sans mt-2 leading-relaxed">
                  Stay ahead of the weather with our daily forecasts and updates! Get ready to embrace the elements and make the most of your day.
                </p>
                <button className="mt-4 w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-sans font-medium hover:bg-slate-800 transition-all">
                  Get daily updates →
                </button>
              </div>
              <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                <ArrowUpRight size={13} className="text-white" />
              </button>
            </div>

            {/* Records button */}
            <button
              onClick={() => setShowRecords(true)}
              className="card p-3 flex items-center gap-2 text-text-muted hover:text-accent-blue hover:border-accent-blue/30 transition-all text-sm font-sans"
            >
              <Database size={15} />
              View saved records & export data
            </button>
          </div>
        </main>
      <RecordsModal isOpen={showRecords} onClose={() => setShowRecords(false)} />
    </SidebarLayout>
  );
}
