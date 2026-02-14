@echo off
echo 🚀 Starting Google Forms Clone...
echo.

echo 📦 Starting Backend (FastAPI)...
cd backend
python -m venv venv 2>nul
call venv\Scripts\activate
pip install -r requirements.txt -q
start /B uvicorn app.main:app --reload --port 8000
cd ..

echo ✅ Backend started on http://localhost:8000
echo.

echo 🎨 Starting Frontend (React)...
cd frontend
call npm install 2>nul
start /B npm run dev
cd ..

echo.
echo ✅ Frontend started on http://localhost:3000
echo.
echo 🎉 Application is ready!
echo 📝 Admin Panel: http://localhost:3000
echo 📡 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop servers...
pause >nul

taskkill /F /IM node.exe
taskkill /F /IM python.exe