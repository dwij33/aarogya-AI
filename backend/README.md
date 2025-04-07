
# ArogyaAI+ Backend

This is the Python backend server for ArogyaAI+, built with Flask. It provides the AI capabilities and API endpoints that support the React frontend.

## Features

- Symptom analysis using NLP
- Mental health chatbot
- User authentication
- Health records management
- Medication tracking
- Health alerts system

## Requirements

- Python 3.8+
- Flask
- Flask-CORS
- NumPy
- PyTorch (optional, for advanced ML capabilities)
- Transformers (optional, for NLP models)

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install flask flask-cors numpy
   # For ML capabilities:
   pip install torch transformers
   ```

3. Run the server:
   ```bash
   python server.py
   ```

The server will run on http://localhost:5000.

## API Endpoints

### Health Check
- `GET /api/health`

### Symptom Analysis
- `POST /api/analyze-symptoms`
  - Body: `{ "symptoms": "your symptoms text", "userInfo": { ... } }`

### Mental Health Chat
- `POST /api/mental-health/chat`
  - Body: `{ "message": "user message" }`

### User Authentication
- `POST /api/users/register`
  - Body: `{ "email": "user@example.com", "password": "password", "profile": { ... } }`
- `POST /api/users/login`
  - Body: `{ "email": "user@example.com", "password": "password" }`

### Health Records
- `POST /api/health-records`
  - Body: `{ "user_id": "123", "vital_signs": { ... }, "medications": [ ... ], "conditions": [ ... ] }`

### Medications
- `GET /api/medications?user_id=123`

### Health Alerts
- `GET /api/health-alerts?region=Maharashtra`

## Notes

This backend server is a simplified version for demonstration purposes. In a production environment, additional security measures, proper error handling, database integration, and advanced ML models would be implemented.
