# FRIDAY AI Assistant - Setup Guide

## Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows
- **RAM**: 4GB minimum
- **Storage**: 2GB for dependencies
- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **npm**: 9 or higher

### Required API Keys
1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Google Cloud API Key**: https://cloud.google.com/docs/authentication
3. **Weather API Key**: https://www.weatherapi.com/
4. **Spotify API**: https://developer.spotify.com/

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourakumu007-sketch/friday-ai-assistant.git
cd friday-ai-assistant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your preferred editor

# Initialize database
python -m app.database
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 4. Environment Variables Configuration

#### Backend (.env)
```env
# Database
DATABASE_URL=sqlite:///./friday.db
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/friday_db

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
OPENAI_API_KEY=sk-your-key-here
GOOGLE_CLOUD_API_KEY=your-google-key
WEATHER_API_KEY=your-weather-key
SPOTIFY_CLIENT_ID=your-spotify-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret

# Application
FASTAPI_ENV=development
CORS_ORIGINS=["http://localhost:5173"]
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=FRIDAY
```

## Running the Application

### Option 1: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432

## Database Setup

### SQLite (Development)
```bash
# Automatically created on first run
python -c "from app.database import init_db; init_db()"
```

### PostgreSQL (Production)

```bash
# Install PostgreSQL
# macOS:
brew install postgresql

# Linux (Ubuntu/Debian):
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb friday_db
sudo -u postgres createuser friday_user
sudo -u postgres psql -c "ALTER USER friday_user WITH PASSWORD 'your_password';"
```

## Verification

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Frontend Build
```bash
cd frontend
npm run build
```

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Explore API documentation at http://localhost:8000/docs
2. Create a user account
3. Test voice features
4. Configure preferences
5. Create your first task

## Support

For issues:
1. Check existing GitHub issues
2. Review logs
3. Open a new issue with error details
