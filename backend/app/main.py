from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Form, FormCreate, FormUpdate, Response, ResponseCreate, Field
from typing import List, Dict
import uuid
from datetime import datetime

app = FastAPI(title="Google Forms Clone API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
forms_db: Dict[str, Form] = {}
responses_db: Dict[str, List[Response]] = {}
reusable_fields_db: List[Field] = []

# Initialize with sample reusable fields
def init_reusable_fields():
    global reusable_fields_db
    reusable_fields_db = [
        Field(
            id=str(uuid.uuid4()),
            question="Have you worked with any organization as a freelancer/part-time UI/UX role?",
            type="yes/no",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="What is your graduation year? (Write expected if in college)",
            type="number",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="Why are you interested in working with a startup, and what do you hope to gain from this internship? (Do not use AI to write this)",
            type="long_answer",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="Why are you interested in working with a startup, and what do you hope to gain from this internship?",
            type="short_answer",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="Have you worked in sales or marketing roles before, either through internships or part-time positions?",
            type="yes/no",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="Have you had any previous experience working with a B2B organization?",
            type="yes/no",
            required=False
        ),
        Field(
            id=str(uuid.uuid4()),
            question="How do you run a Javascript function periodically at certain delay?",
            type="single_choice",
            required=False,
            options=["setInterval", "Recursive function call", "Can implement with third-party libraries", "Not in vanilla JavaScript"]
        )
    ]

init_reusable_fields()

# REUSABLE FIELDS ENDPOINTS
@app.get("/api/reusable-fields", response_model=List[Field])
async def get_reusable_fields():
    """Get all reusable fields"""
    return reusable_fields_db

@app.post("/api/reusable-fields", response_model=Field)
async def create_reusable_field(field: Field):
    """Create a new reusable field"""
    field.id = str(uuid.uuid4())
    reusable_fields_db.append(field)
    return field

# FORM ENDPOINTS
@app.post("/api/forms", response_model=Form)
async def create_form(form_data: FormCreate):
    """Create a new form"""
    form_id = str(uuid.uuid4())
    form = Form(
        id=form_id,
        title=form_data.title,
        description=form_data.description,
        fields=form_data.fields,
        created_at=datetime.now()
    )
    forms_db[form_id] = form
    responses_db[form_id] = []
    return form

@app.get("/api/forms", response_model=List[Form])
async def get_all_forms():
    """Get all forms"""
    return list(forms_db.values())

@app.get("/api/forms/{form_id}", response_model=Form)
async def get_form(form_id: str):
    """Get a specific form by ID"""
    if form_id not in forms_db:
        raise HTTPException(status_code=404, detail="Form not found")
    return forms_db[form_id]

@app.put("/api/forms/{form_id}", response_model=Form)
async def update_form(form_id: str, form_update: FormUpdate):
    """Update a form"""
    if form_id not in forms_db:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form = forms_db[form_id]
    if form_update.title is not None:
        form.title = form_update.title
    if form_update.description is not None:
        form.description = form_update.description
    if form_update.fields is not None:
        form.fields = form_update.fields
    
    forms_db[form_id] = form
    return form

@app.delete("/api/forms/{form_id}")
async def delete_form(form_id: str):
    """Delete a form"""
    if form_id not in forms_db:
        raise HTTPException(status_code=404, detail="Form not found")
    
    del forms_db[form_id]
    if form_id in responses_db:
        del responses_db[form_id]
    
    return {"message": "Form deleted successfully"}

# RESPONSE ENDPOINTS
@app.post("/api/responses", response_model=Response)
async def submit_response(response_data: ResponseCreate):
    """Submit a response to a form"""
    if response_data.form_id not in forms_db:
        raise HTTPException(status_code=404, detail="Form not found")
    
    response_id = str(uuid.uuid4())
    response = Response(
        id=response_id,
        form_id=response_data.form_id,
        answers=response_data.answers,
        submitted_at=datetime.now()
    )
    
    if response_data.form_id not in responses_db:
        responses_db[response_data.form_id] = []
    
    responses_db[response_data.form_id].append(response)
    return response

@app.get("/api/forms/{form_id}/responses", response_model=List[Response])
async def get_form_responses(form_id: str):
    """Get all responses for a specific form"""
    if form_id not in forms_db:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return responses_db.get(form_id, [])

@app.get("/api/responses/{response_id}", response_model=Response)
async def get_response(response_id: str):
    """Get a specific response by ID"""
    for responses in responses_db.values():
        for response in responses:
            if response.id == response_id:
                return response
    raise HTTPException(status_code=404, detail="Response not found")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Google Forms Clone API", "version": "1.0.0"}