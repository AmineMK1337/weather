"use client";
import { Search, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface HeaderProps {
  onSearch: (location: string) => void;
  unit: "C" | "F";
  onUnitToggle: () => void;
  loading: boolean;
}

export default function Header({ onSearch, unit, onUnitToggle, loading }: HeaderProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      onSearch(`${pos.coords.latitude},${pos.coords.longitude}`);
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      {/* Left: greeting + date */}
      <div>
        <p className="text-text-muted text-xs font-sans">Hi, Welcome back 👋</p>
        <h1 className="font-display text-2xl text-text-primary">
          {format(new Date(), "EEE, dd MMM, yyyy")}
        </h1>
      </div>

      {/* Right: search + geo + unit toggle */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or postcode..."
            className="pl-9 pr-4 py-2 rounded-xl bg-bg-card border border-white/8 text-text-primary placeholder:text-text-muted text-sm font-sans w-60 focus:outline-none focus:border-accent-blue/50 transition-all"
          />
        </form>

        <button
          onClick={handleGeolocate}
          title="Use my location"
          className="w-9 h-9 rounded-xl bg-bg-card border border-white/8 flex items-center justify-center text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
        >
          <MapPin size={15} />
        </button>

        <button
          onClick={onUnitToggle}
          className="flex items-center gap-1 bg-bg-card border border-white/8 rounded-xl px-3 py-2 text-sm font-mono transition-all"
        >
          <span className={unit === "C" ? "text-accent-blue font-medium" : "text-text-muted"}>C°</span>
          <span className="text-text-muted mx-0.5">/</span>
          <span className={unit === "F" ? "text-accent-blue font-medium" : "text-text-muted"}>F°</span>
        </button>

        {loading && (
          <div className="w-5 h-5 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        )}
      </div>
    </header>
  );
}
