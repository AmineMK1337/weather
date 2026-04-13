"use client";
import React, { useEffect, useState } from "react";
import { weatherApi, WeatherRecord } from "../services/api";
import { Trash2, Download, Database, CloudRain } from "lucide-react";
import { format, parseISO } from "date-fns";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";

export default function HistoryPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const { data } = await weatherApi.getRecords();
      setRecords(data);
    } catch {
      // Error handling can be silent if empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: number) => {
    await weatherApi.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <SidebarLayout>
      <Head>
        <title>History - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-hidden gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <Database className="text-accent-blue" />
              Search History
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Review and manage your past weather queries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: "JSON", fn: weatherApi.exportJson },
              { label: "CSV", fn: weatherApi.exportCsv },
              { label: "PDF", fn: weatherApi.exportPdf },
              { label: "MD", fn: weatherApi.exportMarkdown },
            ].map(({ label, fn }) => (
              <button
                key={label}
                onClick={fn}
                className="px-3 py-2 rounded-xl bg-bg-card border border-white/8 text-sm text-text-muted hover:text-accent-blue hover:border-accent-blue/30 transition-all flex items-center gap-2 font-mono"
              >
                <Download size={14} /> {label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 bg-bg-card rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="grid grid-cols-6 gap-4 p-5 py-4 border-b border-white/5 bg-white/[0.02] text-xs font-mono text-text-muted select-none">
            <div className="col-span-2">LOCATION</div>
            <div>TEMPERATURE</div>
            <div>CONDITION</div>
            <div>QUERIED AT</div>
            <div className="text-right flex-1 pr-2">ACTIONS</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-4 p-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-bg-hover rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <CloudRain size={48} className="mb-4 opacity-50 text-accent-blue" />
                <p>No records found. Search a city to get started!</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-6 gap-4 p-4 rounded-2xl hover:bg-bg-hover transition-all items-center group"
                  >
                    <div className="col-span-2">
                      <p className="font-sans font-medium text-text-primary text-sm flex items-center gap-2">
                        {r.location}
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-text-muted font-mono tracking-wide">
                          {r.country}
                        </span>
                      </p>
                    </div>
                    <div className="font-mono text-sm text-text-secondary">
                      {r.temperature}°C
                    </div>
                    <div className="text-sm text-text-secondary capitalize">
                      {r.weather_condition}
                    </div>
                    <div className="font-mono text-xs text-text-muted">
                      {r.queried_at ? format(parseISO(r.queried_at), "MMM d, yyyy HH:mm") : "-"}
                    </div>
                    <div className="text-right flex justify-end">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
