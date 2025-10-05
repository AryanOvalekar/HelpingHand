# Helping Hand

Helping Hand is a volunteer-oriented platform that connects compassionate individuals with communities in need. Whether it's bringing clothing to flood victims, delivering food to disaster-affected areas, or coordinating relief efforts, our platform uses AI-powered classification through Google Gemini to identify volunteer opportunities from real-time news sources. By presenting these opportunities through interactive maps and organized lists, Helping Hand makes it easy for volunteers to find meaningful ways to support their communities during times of crisis.

## Features

- Interactive map visualization with zoom-responsive heatmap overlay and pulsing markers for incident exploration
- Comprehensive list view with scrollable incident cards and smooth animations
- AI-powered volunteer opportunity identification using Google Gemini to automatically classify news articles and determine specific needs like clothing, food, or monetary donations
- Severity classification with visual indicators for high-priority incidents requiring immediate attention

## Technology Used

- **Frontend**: React, Vite, Mapbox GL JS
- **Backend**: FastAPI (Python), MongoDB
- **Database**: MongoDB with geospatial indexing
- **Mapping**: Mapbox GL JS with custom styling and heatmap layers
- **Data Processing**: Python-based news aggregation and classification using Google Gemini
- **APIs**: News API integration for real-time incident data

## Demo

Watch the demo on YouTube:
Link will go here

## Devpost

View the project on Devpost:
https://devpost.com/software/helping-hand-4y163t

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB instance
- Mapbox API key
- News API key

### Installing Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Data Grabber:**
```bash
cd grabber
pip install -r requirements.txt
```

## Running the Application

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
fastapi run api.py --port 8000
```

### Data Grabber
```bash
cd grabber
python grabber.py
```
