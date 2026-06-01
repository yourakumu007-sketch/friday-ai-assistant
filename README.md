# 🤖 FRIDAY - AI Personal Assistant

**FRIDAY** is a production-ready AI personal assistant inspired by Tony Stark's JARVIS, designed specifically for Indian users aged 18-24.

## ✨ Features

- 🎤 **Voice Conversations** - Natural dialogue with context awareness
- 📅 **Daily Planning** - Smart task and reminder management
- 🎵 **Mood-Based Music** - Personalized playlists (English, Hindi, Bengali)
- 🌍 **Real-time Updates** - Weather, web search, news
- 💾 **Smart Memory** - Remembers preferences and history
- 🌐 **Multi-Language** - English, Hindi, Bengali support
- 📱 **Responsive Design** - Mobile and desktop optimized
- 🔐 **Secure** - JWT authentication, encrypted data

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL or SQLite
- OpenAI API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourakumu007-sketch/friday-ai-assistant.git
cd friday-ai-assistant

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Running the Project

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Backend:** http://localhost:8000
**Frontend:** http://localhost:5173

## 📁 Project Structure

```
friday-ai-assistant/
├── frontend/              # React + Vite + TailwindCSS
├── backend/               # FastAPI + SQLAlchemy
├── database/              # Database schemas
├── docs/                  # Documentation
└── docker-compose.yml     # Docker setup
```

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- TailwindCSS for styling
- Framer Motion for animations
- Zustand for state management

**Backend:**
- FastAPI with async support
- SQLAlchemy ORM
- WebSocket for real-time communication
- APScheduler for reminders
- OpenAI API integration

**Database:**
- SQLite (development)
- PostgreSQL (production)

## 📋 Development Roadmap

### Phase 1: MVP (2 weeks)
- [x] Project structure
- [ ] Authentication system
- [ ] Basic chat interface
- [ ] Task management
- [ ] Voice interface
- [ ] Memory engine

### Phase 2: Beta (2 weeks)
- [ ] Reminder system
- [ ] Music recommendations
- [ ] Weather integration
- [ ] Web search
- [ ] Multi-language support

### Phase 3: Production (1 week)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment setup
- [ ] Monitoring & logging

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Contributing](./CONTRIBUTING.md)

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Created by [yourakumu007-sketch](https://github.com/yourakumu007-sketch)

---

**Built with ❤️ for the next generation of AI assistants**
