"use client";
import { useEffect, useState } from "react";
import { weatherApi, WeatherRecord } from "../services/api";
import { Trash2, Download, X, Database } from "lucide-react";
import { format, parseISO } from "date-fns";

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordsModal({ isOpen, onClose }: RecordsModalProps) {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const { data } = await weatherApi.getRecords();
      if (!signal?.aborted) {
        setRecords(data);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        // Silent fail
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => { 
    if (!isOpen) return;
    const abortController = new AbortController();
    fetchRecords(abortController.signal);
    return () => abortController.abort();
  }, [isOpen]);

  const handleDelete = async (id: number) => {
    await weatherApi.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity pointer-events-none ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div 
        className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-accent-blue" />
            <h2 className="font-display text-xl text-text-primary">Weather Records</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[
                { label: "JSON", fn: weatherApi.exportJson },
                { label: "CSV", fn: weatherApi.exportCsv },
                { label: "PDF", fn: weatherApi.exportPdf },
                { label: "MD", fn: weatherApi.exportMarkdown },
              ].map(({ label, fn }) => (
                <button key={label} onClick={fn} className="px-2 py-1 rounded-lg bg-bg-card border border-white/8 text-xs text-text-muted hover:text-accent-blue hover:border-accent-blue/30 transition-all flex items-center gap-1">
                  <Download size={10} /> {label}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-bg-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-bg-card rounded-xl animate-pulse" />)}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              <p className="text-3xl mb-3">📭</p>
              No records saved yet. Search a city to create records.
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-bg-hover transition-all">
                  <div>
                    <p className="text-sm font-sans font-medium text-text-primary">{r.location}, {r.country}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {r.temperature}°C · {r.humidity}% humidity · {r.weather_condition}
                    </p>
                    {r.queried_at && (
                      <p className="text-xs text-text-muted/60 mt-0.5">
                        {format(parseISO(r.queried_at), "MMM d, yyyy HH:mm")}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
