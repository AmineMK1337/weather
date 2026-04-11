// Maps OpenWeatherMap icon codes to emoji icons
export const weatherIconMap: Record<string, string> = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "🌙",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "🌨️", "13n": "🌨️",
  "50d": "🌫️", "50n": "🌫️",
};

export const getWeatherIcon = (iconCode: string) => weatherIconMap[iconCode] || "🌡️";

export const getWeatherBg = (iconCode: string): string => {
  if (iconCode.startsWith("01")) return "from-amber-500/20 to-orange-500/10";
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "from-blue-500/20 to-slate-500/10";
  if (iconCode.startsWith("11")) return "from-purple-500/20 to-slate-500/10";
  if (iconCode.startsWith("13")) return "from-blue-200/20 to-slate-300/10";
  return "from-slate-500/20 to-slate-600/10";
};

export const formatTemp = (temp: number, unit: "C" | "F"): string => {
  if (unit === "F") return `${Math.round((temp * 9) / 5 + 32)}°F`;
  return `${Math.round(temp)}°C`;
};
