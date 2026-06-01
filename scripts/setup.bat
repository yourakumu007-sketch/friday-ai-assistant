@echo off
REM FRIDAY AI Assistant - Setup Script for Windows

echo.
echo 🚀 FRIDAY AI Assistant - Setup
echo ===============================
echo.

REM Check Python version
echo Checking Python version...
python --version

REM Backend setup
echo.
echo 📦 Setting up backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your API keys
)

cd ..

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd frontend

echo Installing Node dependencies...
call npm install

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your API keys
echo 2. Run: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo 3. Run: cd frontend ^&^& npm run dev
echo 4. Visit: http://localhost:5173
echo.
pause
