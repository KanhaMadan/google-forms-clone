# Google Forms Clone

A simplified version of Google Forms built with **React** (Frontend) and **FastAPI** (Backend).

## 🎥 Demo Video

[Watch the demo video here](https://drive.google.com/file/d/1g5U2eeqMffocFP6lhdrE1mgsoC9PNRYZ/view?usp=drivesdk)

## ✨ Features

### Admin View
- ✅ Create forms with unique shareable links
- ✅ Multiple field types: Short Answer, Long Answer, Number, Yes/No, Single Choice, Multiple Choice, Date
- ✅ Reusable fields - save and reuse questions across forms
- ✅ Mark fields as required
- ✅ View all form responses in a table format
- ✅ Copy form links to share with users

### User View
- ✅ Fill out forms via unique links
- ✅ Form validation for required fields
- ✅ Submit responses to backend
- ✅ Clean, responsive Material-UI design

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Vite

**Backend:**
- Python 3.8+
- FastAPI
- Uvicorn
- Pydantic

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm

## 🚀 Installation & Setup

### Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will run on: `http://localhost:8000`

### Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🌐 Access the Application

- **Frontend (User Interface):** http://localhost:5173
- **Backend (API Documentation):** http://localhost:8000/docs

## 📁 Project Structure
```
google-forms-clone/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   └── models.py        # Pydantic models
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── pages/           # Page components
    │   ├── services/        # API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## 🎯 How to Use

1. **Start both servers** (backend and frontend)
2. **Open** http://localhost:5173 in your browser
3. **Create a form:**
   - Click "Create Form"
   - Add questions with different field types
   - Mark fields as required
   - Click "Create Form"
4. **Share the form:**
   - Copy the form link
   - Share with users
5. **View responses:**
   - Click the eye icon on any form
   - See all submissions in table format

## 📊 API Endpoints

- `POST /api/forms` - Create new form
- `GET /api/forms` - Get all forms
- `GET /api/forms/{form_id}` - Get specific form
- `POST /api/responses` - Submit form response
- `GET /api/forms/{form_id}/responses` - Get form responses
- `GET /api/reusable-fields` - Get reusable fields

For full API documentation, visit: http://localhost:8000/docs
