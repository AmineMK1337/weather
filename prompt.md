Role:
You are an expert Full-Stack AI Engineer specializing in modern web development, API integration, and scalable system design. Your task is to build a production-ready Weather Application by using the provided web page as a design and structural reference.

🌐 Reference Web Page

I will provide a web page. Use it as inspiration for:

UI/UX design
Layout and component structure
Color schemes and typography
User flow and interactions
Instructions
Carefully analyze the web page before generating code.
Replicate the design and user experience as closely as possible.
Do not copy copyrighted assets directly; instead, recreate similar styles using open-source resources.
Maintain responsiveness and accessibility.
Preserve the look and feel while ensuring technical excellence.


📌 Project Overview

Build a full-stack Weather Application that retrieves real-time weather data from external APIs, stores user queries in a database, and displays the results through a responsive and intuitive interface.

🎯 Functional Requirements
🌦️ Core Features
Allow users to enter a location (city, ZIP code, coordinates, or landmarks).
Display current weather conditions.
Show a 5-day forecast.
Detect the user's current location using browser geolocation.
Use icons and visual indicators for weather conditions.
Ensure responsive design for desktop, tablet, and mobile devices.
Implement clear loading states and graceful error handling.
🧰 Technical Requirements
🔹 Frontend
Framework: Next.js (React + TypeScript)
Styling: Tailwind CSS
API Calls: Axios or Fetch
State Management: React Hooks
Constraint: Do NOT use Python or Java frameworks for the frontend.
🔹 Backend
Framework: FastAPI (Python)
ORM: SQLAlchemy
Database: PostgreSQL
Validation: Pydantic
Documentation: Swagger/OpenAPI
🔹 External APIs
Weather Data: OpenWeatherMap API
Maps: Google Maps API
Videos: YouTube Data API
🗄️ Backend Functionalities
CRUD Operations
CREATE: Store location, date range, and weather data.
READ: Retrieve stored queries.
UPDATE: Modify existing records.
DELETE: Remove records from the database.
Data Export

Support exporting stored data in:

JSON
CSV
PDF
Markdown
Additional Integrations
Display a Google Map for selected locations.
Provide YouTube videos related to the location.
📁 Project Structure
weather-app/
│── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
│── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── database.py
│   └── main.py
│
│── docker-compose.yml
│── README.md
│── .env.example
🔌 REST API Endpoints
Method	Endpoint	Description
GET	/weather/current	Get current weather
GET	/weather/forecast	Get 5-day forecast
POST	/records	Create a weather record
GET	/records	Retrieve all records
PUT	/records/{id}	Update a record
DELETE	/records/{id}	Delete a record
GET	/export/json	Export data as JSON
GET	/export/csv	Export data as CSV
GET	/export/pdf	Export data as PDF
GET	/export/md	Export data as Markdown
🤖 Optional AI Enhancements

To strengthen the AI Engineer profile, include at least one of the following:

AI-generated weather summaries.
Clothing and travel recommendations based on weather conditions.
A GenAI-powered chatbot for weather insights.

Example:

“Expect light rain tomorrow. Carry an umbrella and plan indoor activities.”

🔑 Environment Variables
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
YOUTUBE_API_KEY=your_youtube_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/weather_db
📘 Documentation Requirements

Generate a complete README.md including:

Project overview
Features
Setup instructions
API documentation
Screenshots
Deployment guide
📦 Deliverables
Full frontend and backend source code.
Clean, modular, and production-ready files.
A public GitHub-ready repository structure.
Docker configuration.
Sample API requests and responses.
A 1–2 minute demo script.
📤 Output Instructions
First, analyze the provided web page and summarize its layout and components.
Map its sections to the weather app features.
Generate the complete code step-by-step.
Clearly label each file.
Provide instructions to run the project locally.
✅ Success Criteria
Pixel-consistent design inspired by the provided web page.
Fully functional and responsive application.
Clean architecture and well-documented code.
Robust API integrations and error handling.
Compliance with all technical assessment requirements.