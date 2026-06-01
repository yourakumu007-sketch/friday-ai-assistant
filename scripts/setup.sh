#!/bin/bash

# FRIDAY AI Assistant - Setup Script

echo "🚀 FRIDAY AI Assistant - Setup"
echo "==============================="
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

if ! python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)'; then
    echo "❌ Python 3.11+ required"
    exit 1
fi

# Check Node version
echo ""
echo "Checking Node.js version..."
node_version=$(node --version)
echo "Node version: $node_version"

if ! node -e 'process.exit(parseInt(process.versions.node.split(".")[0]) >= 18 ? 0 : 1)'; then
    echo "❌ Node.js 18+ required"
    exit 1
fi

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your API keys"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

echo "Installing Node dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ Frontend .env created"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your API keys"
echo "2. Run: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "3. Run: cd frontend && npm run dev"
echo "4. Visit: http://localhost:5173"
