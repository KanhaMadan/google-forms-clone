#!/bin/bash

echo "🚀 Starting Google Forms Clone..."
echo ""

# Start backend
echo "📦 Starting Backend (FastAPI)..."
cd backend
python3 -m venv venv 2>/dev/null || echo "Virtual environment already exists"
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "✅ Backend started on http://localhost:8000"
echo ""

# Start frontend
echo "🎨 Starting Frontend (React)..."
cd frontend
npm install -q 2>/dev/null || echo "Dependencies already installed"
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Frontend started on http://localhost:3000"
echo ""
echo "🎉 Application is ready!"
echo "📝 Admin Panel: http://localhost:3000"
echo "📡 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for processes
wait