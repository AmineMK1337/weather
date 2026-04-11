import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000,
});

export interface CurrentWeather {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_condition: string;
  weather_icon: string;
  pressure: number;
  visibility: number;
  ai_summary: string;
}

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  condition: string;
  icon: string;
  hourly: { time: string; temp: number; condition: string; icon: string }[];
}

export interface WeatherRecord {
  id: number;
  location: string;
  country: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  weather_condition: string;
  ai_summary: string;
  queried_at: string;
}

export const weatherApi = {
  getCurrent: (location: string, units = "metric") =>
    api.get<CurrentWeather>("/weather/current", { params: { location, units } }),

  getForecast: (location: string, days = 5, units = "metric") =>
    api.get<{ location: string; country: string; forecast: ForecastDay[] }>(
      "/weather/forecast",
      { params: { location, days, units } }
    ),

  getRecords: () => api.get<WeatherRecord[]>("/records"),
  createRecord: (data: Partial<WeatherRecord>) => api.post("/records", data),
  updateRecord: (id: number, data: Partial<WeatherRecord>) => api.put(`/records/${id}`, data),
  deleteRecord: (id: number) => api.delete(`/records/${id}`),

  exportJson: () => window.open(`${api.defaults.baseURL}/export/json`, "_blank"),
  exportCsv: () => window.open(`${api.defaults.baseURL}/export/csv`, "_blank"),
  exportPdf: () => window.open(`${api.defaults.baseURL}/export/pdf`, "_blank"),
  exportMarkdown: () => window.open(`${api.defaults.baseURL}/export/md`, "_blank"),
};
