# 🌦️ WeatherDash — Full-Stack Weather Application

A production-ready, full-stack weather dashboard inspired by a sleek dark-themed UI. Built with **Next.js**, **FastAPI**, **PostgreSQL**, and powered by **OpenWeatherMap**, **Google Maps**, **YouTube Data API**, and **Google Gemini** for intelligent weather summaries.

---

## 🤝 PM Accelerator

<img src="assets/pm-accelerator-logo.jpg" alt="PM Accelerator logo" width="360" />

PM Accelerator supports product management professionals at every stage of their careers, from aspiring PMs to experienced leaders.

- LinkedIn: https://www.linkedin.com/school/pmaccelerator/

---

## ✨ Features

### 🌐 Frontend (Next.js + TypeScript + Tailwind CSS)
- **Real-time weather search** by city name, ZIP code, or coordinates
- **Browser geolocation** for instant local weather
- **Hourly forecast strip** with weather icons and temperatures
- **5-day forecast panel** with min/max temperatures
- **Interactive overview chart** (Humidity, UV Index, Rainfall, Pressure)
- **Google Maps integration** pinpointing the searched location
- **YouTube travel videos** for the searched city
- **World cities forecast** strip
- **°C / °F unit toggle**
- **Records manager modal** with export options
- **AI-powered weather summaries** (clothing & activity recommendations)
- Dark, responsive dashboard design

### ⚙️ Backend (FastAPI + PostgreSQL)
- Full **CRUD** for weather query records
- Auto-saves every search to the database
- **Export** records as JSON, CSV, PDF, or Markdown
- Swagger/OpenAPI docs at `/docs`
- **Google Gemini** integration for intelligent summaries

---

## 🗂️ Project Structure

```
weather-app/
├── frontend/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── CurrentWeatherCard.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── OverviewChart.tsx
│   │   ├── ForecastPanel.tsx
│   │   ├── MapPanel.tsx
│   │   ├── WorldForecast.tsx
│   │   ├── YouTubeVideos.tsx
│   │   └── RecordsModal.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   └── index.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── weatherUtils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── weather.py      # GET /weather/current, /weather/forecast
│   │   │   ├── records.py      # CRUD /records
│   │   │   └── export.py       # GET /export/{json,csv,pdf,md}
│   │   ├── models/
│   │   │   └── weather.py      # SQLAlchemy model
│   │   ├── schemas/
│   │   │   └── weather.py      # Pydantic schemas
│   │   ├── services/
│   │   │   └── weather_service.py  # OpenWeatherMap + AI
│   │   └── database.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `OPENWEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) API key (free tier) |
| `GOOGLE_API_KEY` | [Google AI Studio](https://aistudio.google.com) API key for Gemini summaries |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | [Google Maps JavaScript API](https://console.cloud.google.com) key |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | [YouTube Data API v3](https://console.cloud.google.com) key |
| `NEXT_PUBLIC_API_URL` | Backend URL (default: `http://localhost:8000`) |

---

## 🚀 Quick Start

### Option A — Docker (Recommended)

```bash
git clone https://github.com/your-username/weather-app
cd weather-app
cp .env.example .env
# Fill in your API keys in .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### Option B — Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env        # Set your keys
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp ../.env.example .env.local  # Set your NEXT_PUBLIC_ keys
npm run dev
```

---

## 🔌 API Reference

### Weather Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/weather/current?location=Berlin` | Current weather |
| `GET` | `/weather/forecast?location=Berlin&days=5` | 5-day forecast |

### Records CRUD
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/records` | Create a record |
| `GET` | `/records` | List all records |
| `GET` | `/records/{id}` | Get single record |
| `PUT` | `/records/{id}` | Update a record |
| `DELETE` | `/records/{id}` | Delete a record |

### Export
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/export/json` | Export as JSON |
| `GET` | `/export/csv` | Export as CSV |
| `GET` | `/export/pdf` | Export as PDF |
| `GET` | `/export/md` | Export as Markdown |

### Sample Request
```bash
curl "http://localhost:8000/weather/current?location=Paris&units=metric"
```

### Sample Response
```json
{
  "location": "Paris",
  "country": "FR",
  "latitude": 48.8534,
  "longitude": 2.3488,
  "temperature": 18.5,
  "feels_like": 17.2,
  "humidity": 72,
  "wind_speed": 4.6,
  "weather_condition": "scattered clouds",
  "weather_icon": "03d",
  "pressure": 1013,
  "visibility": 10000,
  "ai_summary": "Expect a mild, partly cloudy day in Paris. A light jacket is advisable and perfect conditions for exploring outdoor cafés and landmarks."
}
```

---

## 🤖 AI Integration

The app uses **Google Gemini (gemini-2.0-flash)** via the Google AI SDK to generate smart weather summaries that include:
- Current condition description
- Clothing recommendations
- Activity suggestions

If the Google API key is not set, the app gracefully falls back to a basic template summary.

---

## 🎬 Demo Script (1–2 min)

1. Open the dashboard at `http://localhost:3000`
2. Search for **"Berlin"** in the search bar → current weather loads
3. Toggle between **°C and °F** units
4. Scroll the **hourly forecast strip**
5. Check the **5-day forecast** panel (switch between 3/5 days)
6. View the **Overview chart** — click Humidity, UV Index tabs
7. See the **Google Map** pin for Berlin
8. Watch a **YouTube travel video** for Berlin
9. Click **"View saved records"** → see auto-saved entry
10. Export data as **CSV or PDF**
11. Try **geolocation** (click the pin icon near search)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14 + React 18 + TypeScript |
| Styling | Tailwind CSS + DM Serif Display / DM Sans fonts |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | FastAPI (Python 3.11) |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic v2 |
| AI Summaries | Google Gemini API |
| Weather Data | OpenWeatherMap API |
| Maps | Google Maps JavaScript API |
| Videos | YouTube Data API v3 |
| Containerization | Docker + Docker Compose |
| PDF Export | ReportLab |

---

## 📄 License

MIT License — free to use and modify.
